export const DEMO_TOUR_STEPS = [
  { title: 'Dashboard', description: 'Review KPIs, charts, and critical attention items.', to: '/dashboard' },
  { title: 'Amazon Order #1001', description: 'Open the hero order and start the interactive workflow.', to: '/orders/1001' },
  { title: 'SKU Mapping', description: 'Map marketplace SKUs to internal RUG SKUs.', to: '/sku-mapping' },
  { title: 'Inventory Check', description: 'USA first → India → else MTO for RUG-1001.', to: '/inventory' },
  { title: 'Warehouse Picking', description: 'Start and confirm pick for Order #1001.', to: '/warehouse/pick-pack' },
  { title: 'Weighing', description: 'Capture weight, dimensions and weighing photo (no courier API).', to: '/orders/1001' },
  { title: 'Label Generation', description: 'Generate and print internal shipping label.', to: '/labels' },
  { title: 'Ship to Customer', description: 'Create customer shipment and tracking.', to: '/shipments' },
  { title: 'True Cost', description: 'Revenue vs estimated and actual costs.', to: '/finance/costing' },
  { title: 'Profitability', description: 'Order #1001 profit story — ₹6,350 / 31.75%.', to: '/finance/profitability' },
  { title: 'Reports', description: 'Management reports and CSV export.', to: '/reports' },
];
