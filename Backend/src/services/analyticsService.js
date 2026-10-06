import { Order } from '../models/Order.js';
import { InventoryItem } from '../models/InventoryItem.js';
import { TenantAppState } from '../models/TenantAppState.js';
import { buildAppStateData } from '../seed/appStateSeed.js';

function startOfDay(d = new Date()) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function startOfMonth(d = new Date()) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

function dayLabel(d) {
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
}

function sum(arr, fn) {
  return arr.reduce((s, row) => s + (Number(fn(row)) || 0), 0);
}

function groupCount(arr, keyFn) {
  const map = new Map();
  for (const row of arr) {
    const k = keyFn(row) || 'Unknown';
    map.set(k, (map.get(k) || 0) + 1);
  }
  return [...map.entries()].map(([name, value]) => ({ name, value }));
}

function groupSum(arr, keyFn, valFn) {
  const map = new Map();
  for (const row of arr) {
    const k = keyFn(row) || 'Unknown';
    map.set(k, (map.get(k) || 0) + (Number(valFn(row)) || 0));
  }
  return [...map.entries()].map(([name, value]) => ({ name, value }));
}

const PENDING_DISPATCH = new Set([
  'Packed', 'Ready for Dispatch', 'Reserved', 'Picked', 'Packing', 'Picking', 'Processing',
]);
const IN_TRANSIT = new Set(['In Transit', 'Dispatched', 'Shipped']);
const PENDING_ORDER = new Set([
  'Imported', 'Mapping Required', 'Awaiting Inventory', 'Reserved', 'Processing',
  'Picking', 'Picked', 'Packing', 'Packed', 'Ready for Dispatch',
]);

async function loadApp(tenantId) {
  const doc = await TenantAppState.findOne({ tenantId }).lean();
  return doc?.data || buildAppStateData();
}

export async function buildDashboardAnalytics(tenantId) {
  const [orders, inventory, app] = await Promise.all([
    Order.find({ tenantId }).lean(),
    InventoryItem.find({ tenantId }).lean(),
    loadApp(tenantId),
  ]);

  // Demo dataset is historical — anchor "today" to latest order date so KPIs are meaningful
  const latestOrderDate = orders.reduce((max, o) => {
    const d = o.date ? new Date(o.date) : null;
    if (!d || Number.isNaN(d.getTime())) return max;
    return !max || d > max ? d : max;
  }, null);
  const now = latestOrderDate || new Date();
  const todayStart = startOfDay(now);
  const monthStart = startOfMonth(now);

  const ordersToday = orders.filter((o) => o.date && new Date(o.date) >= todayStart);
  const ordersMonth = orders.filter((o) => o.date && new Date(o.date) >= monthStart);

  const todaysSales = sum(ordersToday, (o) => o.sellingPrice);
  const monthlySales = sum(ordersMonth, (o) => o.sellingPrice);
  const delivered = orders.filter((o) => o.status === 'Delivered' && o.profit != null);
  const grossProfit = sum(delivered, (o) => o.profit);
  const grossMargin = delivered.length
    ? Math.round((sum(delivered, (o) => o.margin) / delivered.length) * 10) / 10
    : 0;
  const netProfit = Math.round(grossProfit * 0.7);

  const indiaInventoryUnits = sum(inventory, (i) => i.indiaAvailable);
  const usaInventoryUnits = sum(inventory, (i) => i.usa);
  const inTransitUnits = sum(inventory, (i) => i.inTransit);
  const indiaStockValue = sum(inventory, (i) => (i.indiaAvailable || 0) * (i.standardCost || 0));
  const usaStockValue = sum(inventory, (i) => (i.usa || 0) * (i.standardCost || 0));
  const lowStockSkus = inventory.filter((i) => {
    const free = (i.indiaAvailable || 0) - (i.reserved || 0);
    return free < (i.reorderLevel || 0) || ((i.usa || 0) === 0 && free <= 0);
  }).length;

  const receivables = app.receivables || [];
  const outstandingReceivables = sum(
    receivables.filter((r) => r.status !== 'Settled' && r.status !== 'Paid'),
    (r) => r.amount ?? r.outstanding ?? r.balance ?? 0
  );

  const returns = (app.returns || []).length;
  const exceptions = app.exceptions || [];
  const courierDisputes = sum(exceptions, (e) => e.claimedAmount ?? e.amount ?? 0) || exceptions.length * 5000;

  const kpis = {
    todaysSales,
    monthlySales,
    totalOrders: orders.length,
    ordersToday: ordersToday.length,
    pendingOrders: orders.filter((o) => PENDING_ORDER.has(o.status)).length,
    pendingDispatch: orders.filter((o) => PENDING_DISPATCH.has(o.status)).length,
    inTransitUnits,
    usaInventoryUnits,
    indiaInventoryUnits,
    usaStockValue,
    indiaStockValue,
    outstandingReceivables,
    grossProfit,
    netProfit,
    grossMargin,
    returns,
    courierDisputes,
    lowStockSkus,
  };

  // Sales trend — last 7 days from orders
  const daily = [];
  for (let i = 6; i >= 0; i -= 1) {
    const day = new Date(now);
    day.setDate(day.getDate() - i);
    const start = startOfDay(day);
    const end = new Date(start);
    end.setDate(end.getDate() + 1);
    const dayOrders = orders.filter((o) => o.date && new Date(o.date) >= start && new Date(o.date) < end);
    daily.push({
      label: dayLabel(start),
      sales: sum(dayOrders, (o) => o.sellingPrice),
      orders: dayOrders.length,
    });
  }

  const salesByMarketplace = groupSum(orders, (o) => o.marketplace, (o) => o.sellingPrice);
  const salesByCountry = groupSum(orders, (o) => o.country, (o) => o.sellingPrice);

  const inventoryByLocation = [
    { name: 'India', value: indiaInventoryUnits },
    { name: 'In Transit', value: inTransitUnits },
    { name: 'USA', value: usaInventoryUnits },
    { name: 'Amazon FBA', value: sum(inventory, (i) => i.fba) },
  ];

  const statusBuckets = {
    Delivered: 0,
    'In Transit': 0,
    Processing: 0,
    Packed: 0,
    Pending: 0,
    'Returns/RTO': 0,
  };
  for (const o of orders) {
    if (o.status === 'Delivered') statusBuckets.Delivered += 1;
    else if (IN_TRANSIT.has(o.status)) statusBuckets['In Transit'] += 1;
    else if (['Packed', 'Ready for Dispatch'].includes(o.status)) statusBuckets.Packed += 1;
    else if (['RTO', 'Returned'].includes(o.status)) statusBuckets['Returns/RTO'] += 1;
    else if (PENDING_ORDER.has(o.status)) statusBuckets.Pending += 1;
    else statusBuckets.Processing += 1;
  }
  const orderStatusDist = Object.entries(statusBuckets).map(([name, value]) => ({ name, value }));

  const topSkus = [...inventory]
    .map((i) => ({
      sku: i.sku,
      product: i.product,
      units: (i.usa || 0) + (i.indiaAvailable || 0) + (i.fba || 0),
      value: ((i.usa || 0) + (i.indiaAvailable || 0)) * (i.standardCost || 0),
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8);

  const lowStock = inventory
    .filter((i) => {
      const free = (i.indiaAvailable || 0) - (i.reserved || 0);
      return free < (i.reorderLevel || 0);
    })
    .map((i) => ({
      sku: i.sku,
      product: i.product,
      indiaAvailable: i.indiaAvailable,
      usa: i.usa,
      reorderLevel: i.reorderLevel,
    }))
    .slice(0, 10);

  const criticalAttention = [
    ...orders
      .filter((o) => ['Mapping Required', 'Awaiting Inventory'].includes(o.status))
      .slice(0, 5)
      .map((o) => ({
        type: 'Order',
        label: `${o.orderNumber} · ${o.status}`,
        to: `/orders/${o.key}`,
        severity: 'high',
      })),
    ...lowStock.slice(0, 3).map((i) => ({
      type: 'Inventory',
      label: `${i.sku} below reorder`,
      to: '/inventory',
      severity: 'medium',
    })),
    ...exceptions.slice(0, 3).map((e) => ({
      type: 'Exception',
      label: e.reason || e.type || e.id || 'Courier exception',
      to: '/shipping-exceptions',
      severity: 'high',
    })),
  ].slice(0, 10);

  const courierExceptionsChart = groupCount(exceptions, (e) => e.type || e.reason || 'Other');

  const receivableAgeing = groupSum(
    receivables,
    (r) => r.ageBucket || r.bucket || r.ageing || 'Current',
    (r) => r.amount ?? r.outstanding ?? r.balance ?? 0
  );

  // Keep seeded weekly/monthly/profit if live history is thin
  const seeded = buildAppStateData();

  return {
    kpis,
    salesTrend: {
      daily,
      weekly: seeded.salesTrend?.weekly || [],
      monthly: seeded.salesTrend?.monthly || [],
    },
    salesByMarketplace: salesByMarketplace.length ? salesByMarketplace : seeded.salesByMarketplace,
    salesByCountry: salesByCountry.length ? salesByCountry : seeded.salesByCountry,
    inventoryByLocation,
    orderStatusDist,
    profitTrend: seeded.profitTrend,
    receivableAgeing: receivableAgeing.length ? receivableAgeing : seeded.receivableAgeing,
    courierExceptionsChart: courierExceptionsChart.length ? courierExceptionsChart : seeded.courierExceptionsChart,
    topSkus: topSkus.length ? topSkus : seeded.topSkus,
    lowStock: lowStock.length ? lowStock : seeded.lowStock,
    criticalAttention: criticalAttention.length ? criticalAttention : seeded.criticalAttention,
    commandCenter: app.commandCenter || seeded.commandCenter,
    forecast: app.forecast || seeded.forecast,
    notifications: app.notifications || seeded.notifications,
  };
}
