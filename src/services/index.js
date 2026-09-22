import { mockRequest } from './apiClient';

export async function getProducts(products) {
  return mockRequest(products);
}

export async function getProductById(products, id) {
  const p = products.find((x) => x.id === id || x.sku === id);
  if (!p) throw new Error('Product not found');
  return mockRequest(p);
}

export async function getSkuMappings(mappings) {
  return mockRequest(mappings);
}

export async function getInventory(inventory) {
  return mockRequest(inventory);
}

export async function getStockLedger(ledger, sku) {
  let rows = ledger;
  if (sku) rows = ledger.filter((l) => l.sku === sku);
  return mockRequest(rows);
}

export async function getShipments(shipments) {
  return mockRequest(shipments);
}

export async function getShipmentById(shipments, id) {
  const s = shipments.find((x) => x.id === id);
  if (!s) throw new Error('Shipment not found');
  return mockRequest(s);
}

export async function getReplenishments(items) {
  return mockRequest(items);
}

export async function getReplenishmentById(items, id) {
  const r = items.find((x) => x.id === id);
  if (!r) throw new Error('Replenishment not found');
  return mockRequest(r);
}

export async function getReceivables(items) {
  return mockRequest(items);
}

export async function getAlerts(alerts) {
  return mockRequest(alerts);
}

export async function getDashboardData(state) {
  return mockRequest({
    kpis: state.kpis,
    salesTrend: state.salesTrend,
    salesByMarketplace: state.salesByMarketplace,
    salesByCountry: state.salesByCountry,
    inventoryByLocation: state.inventoryByLocation,
    orderStatusDist: state.orderStatusDist,
    profitTrend: state.profitTrend,
    receivableAgeing: state.receivableAgeing,
    courierExceptionsChart: state.courierExceptionsChart,
    topSkus: state.topSkus,
    lowStock: state.lowStock,
    criticalAttention: state.criticalAttention,
  });
}

export async function globalSearch(state, query) {
  const q = (query || '').toLowerCase().trim();
  if (!q) return mockRequest([], { delay: 100 });
  const results = [];
  state.orders.forEach((o) => {
    if (
      o.orderNumber.toLowerCase().includes(q) ||
      (o.sku || '').toLowerCase().includes(q) ||
      (o.customer || '').toLowerCase().includes(q) ||
      (o.product || '').toLowerCase().includes(q)
    ) {
      results.push({ type: 'Order', label: `${o.orderNumber} · ${o.product || 'Unmapped'}`, to: `/orders/${o.id}` });
    }
  });
  state.products.forEach((p) => {
    if (p.sku.toLowerCase().includes(q) || p.name.toLowerCase().includes(q)) {
      results.push({ type: 'SKU', label: `${p.sku} · ${p.name}`, to: `/products/${p.sku}` });
    }
  });
  state.shipments.forEach((s) => {
    if (
      s.id.toLowerCase().includes(q) ||
      (s.awb || '').toLowerCase().includes(q) ||
      (s.order || '').toLowerCase().includes(q)
    ) {
      results.push({ type: 'Shipment', label: `${s.id} · ${s.awb || 'No AWB'}`, to: `/shipments/${s.id}` });
    }
  });
  return mockRequest(results.slice(0, 12), { delay: 200 });
}
