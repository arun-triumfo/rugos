export const mockDashboardKpis = {
  todaysSales: 485000,
  monthlySales: 12800000,
  totalOrders: 248,
  ordersToday: 36,
  pendingOrders: 42,
  pendingDispatch: 17,
  inTransitUnits: 842,
  usaInventoryUnits: 1428,
  indiaInventoryUnits: 3764,
  usaStockValue: 18500000,
  indiaStockValue: 24200000,
  outstandingReceivables: 1875000,
  grossProfit: 4460000,
  netProfit: 3120000,
  grossMargin: 34.8,
  returns: 18,
  courierDisputes: 82450,
  lowStockSkus: 5,
};

export const mockSalesTrend = {
  daily: [
    { label: '16 Sep', sales: 320000, orders: 28 },
    { label: '17 Sep', sales: 410000, orders: 34 },
    { label: '18 Sep', sales: 385000, orders: 31 },
    { label: '19 Sep', sales: 455000, orders: 38 },
    { label: '20 Sep', sales: 390000, orders: 33 },
    { label: '21 Sep', sales: 470000, orders: 40 },
    { label: '22 Sep', sales: 485000, orders: 36 },
  ],
  weekly: [
    { label: 'W1 Aug', sales: 2100000, orders: 180 },
    { label: 'W2 Aug', sales: 2450000, orders: 205 },
    { label: 'W3 Aug', sales: 2680000, orders: 220 },
    { label: 'W4 Aug', sales: 2920000, orders: 240 },
    { label: 'W1 Sep', sales: 3100000, orders: 255 },
    { label: 'W2 Sep', sales: 3350000, orders: 270 },
    { label: 'W3 Sep', sales: 3200000, orders: 248 },
  ],
  monthly: [
    { label: 'Apr', sales: 9200000, orders: 780 },
    { label: 'May', sales: 10100000, orders: 850 },
    { label: 'Jun', sales: 11200000, orders: 920 },
    { label: 'Jul', sales: 11800000, orders: 980 },
    { label: 'Aug', sales: 12100000, orders: 1020 },
    { label: 'Sep', sales: 12800000, orders: 1050 },
  ],
};

export const mockSalesByMarketplace = [
  { name: 'Amazon', value: 7200000 },
  { name: 'Etsy', value: 3100000 },
  { name: 'Walmart', value: 2500000 },
];

export const mockSalesByCountry = [
  { name: 'USA', value: 8500000 },
  { name: 'Canada', value: 1600000 },
  { name: 'UK', value: 1200000 },
  { name: 'Germany', value: 900000 },
  { name: 'Australia', value: 600000 },
];

export const mockInventoryByLocation = [
  { name: 'India', value: 3764 },
  { name: 'In Transit', value: 842 },
  { name: 'USA', value: 1428 },
  { name: 'Amazon FBA', value: 980 },
];

export const mockOrderStatusDist = [
  { name: 'Delivered', value: 98 },
  { name: 'In Transit', value: 32 },
  { name: 'Processing', value: 45 },
  { name: 'Packed', value: 28 },
  { name: 'Pending', value: 30 },
  { name: 'Returns/RTO', value: 15 },
];

export const mockProfitTrend = [
  { label: 'Apr', gross: 28.5, net: 18.2 },
  { label: 'May', gross: 30.1, net: 19.5 },
  { label: 'Jun', gross: 31.8, net: 21.0 },
  { label: 'Jul', gross: 33.2, net: 22.4 },
  { label: 'Aug', gross: 34.0, net: 23.1 },
  { label: 'Sep', gross: 34.8, net: 24.4 },
];

export const mockReceivableAgeing = [
  { name: 'Current', value: 420000 },
  { name: '1-30', value: 380000 },
  { name: '31-60', value: 455000 },
  { name: '61-90', value: 320000 },
  { name: '90+', value: 300000 },
];

export const mockCourierExceptionsChart = [
  { name: 'Delay', value: 8 },
  { name: 'Delivery Exception', value: 5 },
  { name: 'RTO', value: 4 },
  { name: 'Address Issue', value: 3 },
  { name: 'Damage', value: 2 },
];

export const mockTopSkus = [
  { sku: 'RUG-1001', name: 'Hand Knotted Wool Rug', units: 48, revenue: 960000 },
  { sku: 'RUG-1003', name: 'Jute Area Rug', units: 92, revenue: 625600 },
  { sku: 'RUG-1006', name: 'Flatweave Kilim', units: 71, revenue: 631900 },
  { sku: 'RUG-1009', name: 'Natural Jute Runner', units: 110, revenue: 462000 },
  { sku: 'RUG-1002', name: 'Hand Tufted Rug', units: 55, revenue: 687500 },
];

export const mockLowStock = [
  { sku: 'RUG-1017', name: 'Limited Edition Silk Runner', free: 0, reorder: 2 },
  { sku: 'RUG-1013', name: 'Moroccan Trellis Rug', free: 1, reorder: 5 },
  { sku: 'RUG-1004', name: 'Vintage Persian Rug', free: 3, reorder: 3 },
  { sku: 'RUG-1010', name: 'Luxury Wool Rug', free: 4, reorder: 3 },
  { sku: 'RUG-1005', name: 'Wool Silk Rug', free: 4, reorder: 2 },
];

export const mockCriticalAttention = [
  { id: 'ca1', title: 'SKU Mapping Missing', count: 5, link: '/sku-mapping', severity: 'Critical' },
  { id: 'ca2', title: 'Orders Awaiting Allocation', count: 3, link: '/orders?status=Awaiting+Inventory', severity: 'High' },
  { id: 'ca3', title: 'Delayed India Dispatch', count: 4, link: '/warehouse/dispatch', severity: 'High' },
  { id: 'ca4', title: 'USA Receipt Discrepancies', count: 1, link: '/warehouse/usa-receipts', severity: 'Critical' },
  { id: 'ca5', title: 'Courier Delivery Exception', count: 2, link: '/shipping-exceptions', severity: 'High' },
  { id: 'ca6', title: 'Overdue Receivable', count: 3, link: '/finance/receivables', severity: 'Critical' },
  { id: 'ca7', title: 'Courier Invoice Variance', count: 8, link: '/finance/courier-audit', severity: 'High' },
  { id: 'ca8', title: 'Pending Export Realization', count: 2, link: '/export/ebrc-brc', severity: 'Medium' },
  { id: 'ca9', title: 'Low Stock', count: 5, link: '/inventory', severity: 'High' },
  { id: 'ca10', title: 'Old Inventory (>90 days)', count: 12, link: '/analytics/inventory', severity: 'Medium' },
];

export const mockCommandCenter = [
  { key: 'marketplace', label: 'Marketplace', count: 3, status: 'Connected', exceptions: 2, link: '/marketplace-imports' },
  { key: 'orders', label: 'Orders', count: 248, status: 'Active', exceptions: 5, link: '/orders' },
  { key: 'mapping', label: 'SKU Mapping', count: 8, status: 'Exceptions', exceptions: 5, link: '/sku-mapping' },
  { key: 'inventory', label: 'Inventory', count: 7014, status: 'Healthy', exceptions: 5, link: '/inventory' },
  { key: 'warehouse', label: 'Warehouse', count: 17, status: 'Processing', exceptions: 4, link: '/warehouse/pick-pack' },
  { key: 'packing', label: 'Packing', count: 8, status: 'In Progress', exceptions: 1, link: '/warehouse/packing' },
  { key: 'dispatch', label: 'India Dispatch', count: 17, status: 'Pending', exceptions: 4, link: '/warehouse/dispatch' },
  { key: 'transit', label: 'In Transit', count: 842, status: 'Moving', exceptions: 3, link: '/replenishment' },
  { key: 'usaReceipt', label: 'USA Receipt', count: 6, status: 'Active', exceptions: 1, link: '/warehouse/usa-receipts' },
  { key: 'usaInventory', label: 'USA Inventory', count: 1428, status: 'Available', exceptions: 0, link: '/inventory' },
  { key: 'shipment', label: 'Customer Shipment', count: 15, status: 'Active', exceptions: 2, link: '/shipments' },
  { key: 'delivery', label: 'Delivery / Return', count: 116, status: 'Mixed', exceptions: 8, link: '/returns' },
  { key: 'finance', label: 'Finance', count: 11, status: 'Open Items', exceptions: 3, link: '/finance/receivables' },
  { key: 'profit', label: 'Profitability', count: '34.8%', status: 'On Track', exceptions: 0, link: '/finance/profitability' },
];

export const mockForecast = {
  sales30Day: [
    { label: 'D1', actual: 485000, forecast: 490000 },
    { label: 'D5', actual: null, forecast: 505000 },
    { label: 'D10', actual: null, forecast: 520000 },
    { label: 'D15', actual: null, forecast: 535000 },
    { label: 'D20', actual: null, forecast: 545000 },
    { label: 'D25', actual: null, forecast: 560000 },
    { label: 'D30', actual: null, forecast: 575000 },
  ],
  demandBySku: [
    { sku: 'RUG-1001', demand: 22, available: 10, suggestion: 'Replenish 15 to USA' },
    { sku: 'RUG-1003', demand: 40, available: 45, suggestion: 'Maintain' },
    { sku: 'RUG-1013', demand: 18, available: 2, suggestion: 'Urgent replenish 20' },
    { sku: 'RUG-1004', demand: 12, available: 4, suggestion: 'Replenish 10' },
    { sku: 'RUG-1009', demand: 55, available: 60, suggestion: 'Maintain' },
  ],
  usaInventoryProjection: [
    { label: 'Week 1', units: 1428 },
    { label: 'Week 2', units: 1380 },
    { label: 'Week 3', units: 1510 },
    { label: 'Week 4', units: 1460 },
  ],
  badge: 'Forecast based on available historical data',
};

export const mockNotifications = [
  { id: 'N1', title: 'Order #1001 ready for demo workflow', time: '10 min ago', read: false },
  { id: 'N2', title: 'Walmart sync completed with 2 failures', time: '3 hrs ago', read: false },
  { id: 'N3', title: 'USA receipt discrepancy on REP-2026-001', time: '4 days ago', read: true },
  { id: 'N4', title: 'Courier dispute opened — ₹82,450', time: '2 days ago', read: false },
];
