/**
 * Client-facing workflow map: what exists today, who uses it, what is next.
 * status: live | ready | planned
 *   live    = backend + UI working in current delivery
 *   ready   = screen + flow wired in app (demo / tenant data)
 *   planned = to be developed
 */

export const STATUS = {
  live: { id: 'live', label: 'Live', hint: 'Working in the system today', className: 'bg-emerald-50 text-emerald-800 ring-emerald-200' },
  ready: { id: 'ready', label: 'Ready', hint: 'Screen & flow available to try', className: 'bg-sky-50 text-sky-800 ring-sky-200' },
  planned: { id: 'planned', label: 'To be developed', hint: 'Planned for next build', className: 'bg-amber-50 text-amber-900 ring-amber-200' },
};

/** Big-picture journeys a client can follow end-to-end */
export const WORKFLOWS = [
  {
    id: 'order-to-ship',
    title: 'Order → Ship (main daily work)',
    plain: 'Customer places an order on Amazon / Etsy / Walmart. Your team prepares the product and sends it to the buyer.',
    department: 'Sales · Warehouse · Logistics',
    steps: [
      { n: 1, title: 'Orders arrive', plain: 'Marketplace orders come into RugOS.', menu: 'Marketplace Imports', to: '/marketplace-imports', status: 'ready' },
      { n: 2, title: 'Fix SKU mismatches', plain: 'If the marketplace SKU is not mapped, map it once.', menu: 'SKU Mapping', to: '/sku-mapping', status: 'ready' },
      { n: 3, title: 'Review the order', plain: 'Open the order, check items, address, and value.', menu: 'Orders', to: '/orders', status: 'live' },
      { n: 4, title: 'Reserve stock', plain: 'System prefers USA stock → then India → else Make-to-Order.', menu: 'Inventory Overview', to: '/inventory', status: 'live' },
      { n: 5, title: 'Pick & pack', plain: 'Warehouse picks items and packs the carton.', menu: 'Pick & Pack', to: '/warehouse/pick-pack', status: 'ready' },
      { n: 6, title: 'Create shipment', plain: 'Create AWB / label and hand over to courier.', menu: 'Shipments', to: '/shipments', status: 'ready' },
      { n: 7, title: 'Track delivery', plain: 'Watch tracking until delivered (or exception).', menu: 'Tracking', to: '/tracking', status: 'ready' },
    ],
  },
  {
    id: 'catalog-setup',
    title: 'Product & catalog setup',
    plain: 'Before selling, you define what you sell and how each marketplace calls that product.',
    department: 'Sales · Management',
    steps: [
      { n: 1, title: 'Add products', plain: 'Create product master (name, category, cost).', menu: 'Products', to: '/products', status: 'ready' },
      { n: 2, title: 'Define SKUs', plain: 'Each sellable variant gets a SKU code.', menu: 'SKU Master', to: '/sku-master', status: 'ready' },
      { n: 3, title: 'Map marketplaces', plain: 'Link Amazon / Etsy / Walmart IDs to your SKU.', menu: 'Marketplace Mapping', to: '/marketplace-mapping', status: 'ready' },
    ],
  },
  {
    id: 'inventory-control',
    title: 'Inventory control',
    plain: 'Know how much stock you have in India and USA, and keep the books clean.',
    department: 'Warehouse · Management',
    steps: [
      { n: 1, title: 'See stock levels', plain: 'USA available, India available, reserved, in-transit.', menu: 'Inventory Overview', to: '/inventory', status: 'live' },
      { n: 2, title: 'Read the ledger', plain: 'Every stock movement is recorded.', menu: 'Stock Ledger', to: '/inventory/ledger', status: 'ready' },
      { n: 3, title: 'Transfer / adjust', plain: 'Move stock between locations or correct counts.', menu: 'Inventory Transfers', to: '/inventory/transfers', status: 'ready' },
      { n: 4, title: 'Cycle count', plain: 'Physical count vs system count.', menu: 'Cycle Count', to: '/inventory/cycle-count', status: 'ready' },
    ],
  },
  {
    id: 'india-usa-replenish',
    title: 'India → USA replenishment',
    plain: 'When USA stock is low, India prepares a shipment and USA receives it.',
    department: 'India Warehouse · USA Warehouse · Logistics',
    steps: [
      { n: 1, title: 'Plan what to send', plain: 'Decide which SKUs and quantities to replenish.', menu: 'Replenishment Planning', to: '/replenishment/planning', status: 'ready' },
      { n: 2, title: 'Create India→USA shipment', plain: 'Pack and dispatch from India warehouse.', menu: 'India → USA Shipments', to: '/replenishment', status: 'ready' },
      { n: 3, title: 'Watch in transit', plain: 'Goods are on the way to USA.', menu: 'In Transit', to: '/in-transit', status: 'ready' },
      { n: 4, title: 'USA receives', plain: 'USA warehouse confirms receipt.', menu: 'USA Receipts', to: '/warehouse/usa-receipts', status: 'ready' },
      { n: 5, title: 'Reconcile', plain: 'Match expected vs received quantities.', menu: 'Receipt Reconciliation', to: '/receipt-reconciliation', status: 'ready' },
    ],
  },
  {
    id: 'mto-production',
    title: 'Make-to-Order (MTO) / production',
    plain: 'If stock is not available, the order waits for production, then continues packing.',
    department: 'India Warehouse',
    steps: [
      { n: 1, title: 'Order marked MTO', plain: 'Allocation finds no USA/India stock.', menu: 'Orders', to: '/orders', status: 'live' },
      { n: 2, title: 'Produce / finish', plain: 'Track production jobs until ready.', menu: 'MTO / Production', to: '/warehouse/mto', status: 'ready' },
      { n: 3, title: 'Back to pick & pack', plain: 'Once ready, warehouse fulfils the order.', menu: 'Pick & Pack', to: '/warehouse/pick-pack', status: 'ready' },
    ],
  },
  {
    id: 'export-compliance',
    title: 'Export documents & compliance',
    plain: 'For India export shipments you need invoices, packing lists, and bank remittance proof.',
    department: 'Accounts · Logistics',
    steps: [
      { n: 1, title: 'Commercial invoice', plain: 'Invoice for customs and buyer.', menu: 'Commercial Invoices', to: '/export/commercial-invoices', status: 'ready' },
      { n: 2, title: 'Packing list', plain: 'What is inside each carton.', menu: 'Packing Lists', to: '/export/packing-lists', status: 'ready' },
      { n: 3, title: 'Proforma', plain: 'Advance quotation / proforma invoice.', menu: 'Proforma Invoices', to: '/export/proforma', status: 'ready' },
      { n: 4, title: 'EBRC / BRC & FIRA', plain: 'Bank realization documents after payment.', menu: 'EBRC / BRC', to: '/export/ebrc-brc', status: 'ready' },
    ],
  },
  {
    id: 'returns-claims',
    title: 'Returns, RTO & claims',
    plain: 'If a parcel comes back or is damaged, you record it and recover money where possible.',
    department: 'USA Warehouse · Logistics · Accounts',
    steps: [
      { n: 1, title: 'Customer return', plain: 'Buyer returns the product.', menu: 'Returns', to: '/returns', status: 'ready' },
      { n: 2, title: 'RTO', plain: 'Courier could not deliver — returned to origin.', menu: 'RTO', to: '/rto', status: 'ready' },
      { n: 3, title: 'Claims', plain: 'Raise courier / marketplace recovery claims.', menu: 'Claims & Recoveries', to: '/claims', status: 'ready' },
    ],
  },
  {
    id: 'finance-loop',
    title: 'Money in & true cost',
    plain: 'Track what customers owe you, what you paid couriers, and whether each order made profit.',
    department: 'Accounts · Management',
    steps: [
      { n: 1, title: 'Receivables', plain: 'Outstanding amounts to collect.', menu: 'Receivables', to: '/finance/receivables', status: 'ready' },
      { n: 2, title: 'Payments', plain: 'Record incoming settlements.', menu: 'Payments', to: '/finance/payments', status: 'ready' },
      { n: 3, title: 'Courier invoice audit', plain: 'Check courier bills vs shipments.', menu: 'Courier Invoice Audit', to: '/finance/courier-audit', status: 'ready' },
      { n: 4, title: 'Costing & profit', plain: 'True cost of an order and margin.', menu: 'Costing', to: '/finance/costing', status: 'ready' },
    ],
  },
  {
    id: 'saas-platform',
    title: 'SaaS platform (multi-company)',
    plain: 'RugOS is built so many companies (tenants) can buy a plan and run their own data separately.',
    department: 'Super Admin',
    steps: [
      { n: 1, title: 'Plans', plain: 'Define subscription plans (features & price).', menu: 'Super Admin → Plans', to: '/superadmin/plans', status: 'live' },
      { n: 2, title: 'Demo requests', plain: 'Prospects apply from the website; you review them.', menu: 'Demo Requests', to: '/superadmin/demo-requests', status: 'live' },
      { n: 3, title: 'Approve buyers', plain: 'Approve a company and activate their account.', menu: 'Buyers', to: '/superadmin/buyers', status: 'live' },
      { n: 4, title: 'Subscriptions', plain: 'See who is Active / Suspended and on which plan.', menu: 'Subscriptions', to: '/superadmin/subscriptions', status: 'live' },
      { n: 5, title: 'Tenant self-serve portal', plain: 'Company admin upgrades plan, invites users, billing history.', menu: '—', to: null, status: 'planned' },
      { n: 6, title: 'Strict data isolation hardening', plain: 'Every API always scoped by tenant with audit proof.', menu: '—', to: null, status: 'planned' },
    ],
  },
];

/** Who does what — department / role view */
export const DEPARTMENTS = [
  {
    id: 'management',
    role: 'Management',
    color: 'blue',
    plain: 'Sees the full picture. Approves exceptions and watches profit.',
    sees: 'All menus',
    jobs: [
      'Check Dashboard & Command Center every morning',
      'Review profitability and low-stock alerts',
      'Approve big inventory adjustments',
      'Switch into any department view when needed',
    ],
    menus: [
      { label: 'Dashboard', to: '/dashboard' },
      { label: 'Command Center', to: '/command-center' },
      { label: 'Profitability', to: '/finance/profitability' },
      { label: 'Alerts', to: '/alerts' },
    ],
    status: 'ready',
    gap: 'Role-switch demo works; finer button-level permissions still planned.',
  },
  {
    id: 'sales',
    role: 'Sales',
    color: 'sky',
    plain: 'Owns marketplace orders and customer promises.',
    sees: 'Overview, Commerce, Catalog, Inventory, Warehouse, Shipping, Analytics, System',
    jobs: [
      'Import / review marketplace orders',
      'Fix SKU mapping exceptions',
      'Keep product & marketplace mapping clean',
      'Answer “where is my order?” using Tracking',
    ],
    menus: [
      { label: 'Marketplace Imports', to: '/marketplace-imports' },
      { label: 'Orders', to: '/orders' },
      { label: 'SKU Mapping', to: '/sku-mapping' },
      { label: 'Products', to: '/products' },
    ],
    status: 'ready',
    gap: 'Live marketplace API pull (Amazon/Etsy auto-sync) is to be developed.',
  },
  {
    id: 'india-wh',
    role: 'India Warehouse',
    color: 'emerald',
    plain: 'Produces, packs, and ships stock from India (including to USA).',
    sees: 'Overview, Commerce, Catalog, Inventory, Warehouse, Replenishment, Shipping, System',
    jobs: [
      'Run MTO / production jobs',
      'Pick & pack local / export cartons',
      'Dispatch India → USA replenishment',
      'Maintain warehouse locations',
    ],
    menus: [
      { label: 'MTO / Production', to: '/warehouse/mto' },
      { label: 'Pick & Pack', to: '/warehouse/pick-pack' },
      { label: 'India Dispatch', to: '/warehouse/dispatch' },
      { label: 'Replenishment', to: '/replenishment' },
    ],
    status: 'ready',
    gap: 'Handheld barcode scanner app is to be developed.',
  },
  {
    id: 'usa-wh',
    role: 'USA Warehouse',
    color: 'violet',
    plain: 'Receives India stock and fulfils USA marketplace orders.',
    sees: 'Overview, Commerce, Catalog, Inventory, Warehouse, Replenishment, Shipping, Returns, System',
    jobs: [
      'Receive India shipments',
      'Fulfil USA orders (pick / pack / ship)',
      'Process returns into stock',
      'Cycle count USA locations',
    ],
    menus: [
      { label: 'USA Receipts', to: '/warehouse/usa-receipts' },
      { label: 'Pick & Pack', to: '/warehouse/pick-pack' },
      { label: 'Shipments', to: '/shipments' },
      { label: 'Returns', to: '/returns' },
    ],
    status: 'ready',
    gap: 'Carrier label API (UPS/USPS/FedEx auto) is to be developed.',
  },
  {
    id: 'logistics',
    role: 'Logistics',
    color: 'amber',
    plain: 'Owns movement of goods and courier references.',
    sees: 'Overview, Commerce, Catalog, Inventory, Warehouse, Replenishment, Shipping, Export, Returns, System',
    jobs: [
      'Map courier AWB / QR references',
      'Generate internal labels',
      'Clear delivery exceptions',
      'Keep export document set complete',
    ],
    menus: [
      { label: 'Courier References', to: '/courier-references' },
      { label: 'Labels', to: '/labels' },
      { label: 'Delivery Exceptions', to: '/shipping-exceptions' },
      { label: 'Export Documents', to: '/export/documents' },
    ],
    status: 'ready',
    gap: 'Direct courier API booking is planned — today operators paste references from courier portals.',
  },
  {
    id: 'accounts',
    role: 'Accounts',
    color: 'rose',
    plain: 'Looks after money, export banking papers, and true cost.',
    sees: 'Overview, Commerce, Export, Finance, Analytics, System',
    jobs: [
      'Chase receivables & record payments',
      'Maintain EBRC / FIRA',
      'Audit courier invoices',
      'Review costing & profitability',
    ],
    menus: [
      { label: 'Receivables', to: '/finance/receivables' },
      { label: 'Payments', to: '/finance/payments' },
      { label: 'EBRC / BRC', to: '/export/ebrc-brc' },
      { label: 'Costing', to: '/finance/costing' },
    ],
    status: 'ready',
    gap: 'Bank / payment-gateway auto-reconciliation is to be developed.',
  },
  {
    id: 'auditor',
    role: 'Auditor',
    color: 'slate',
    plain: 'Read-mostly view across ops and finance for checks.',
    sees: 'Most menus except Replenishment planning focus; full audit trail',
    jobs: [
      'Review audit logs',
      'Spot-check inventory vs ledger',
      'Validate export & finance documents',
    ],
    menus: [
      { label: 'Audit Logs', to: '/audit-logs' },
      { label: 'Stock Ledger', to: '/inventory/ledger' },
      { label: 'Reports', to: '/reports' },
    ],
    status: 'ready',
    gap: 'Hard “view-only” lock on every action button is to be developed.',
  },
  {
    id: 'super-admin',
    role: 'Super Admin',
    color: 'navy',
    plain: 'Runs the SaaS business — plans, buyers, demos, subscriptions.',
    sees: 'Super Admin console only',
    jobs: [
      'Review Apply-for-Demo forms',
      'Approve or suspend companies',
      'Manage plans & subscriptions',
    ],
    menus: [
      { label: 'Demo Requests', to: '/superadmin/demo-requests' },
      { label: 'Buyers', to: '/superadmin/buyers' },
      { label: 'Plans', to: '/superadmin/plans' },
      { label: 'Subscriptions', to: '/superadmin/subscriptions' },
    ],
    status: 'live',
    gap: 'Self-serve billing portal for each company is to be developed.',
  },
];

/** Plain explanation of each sidebar menu group */
export const MENU_GUIDE = [
  {
    group: 'Overview',
    plain: 'Start-of-day picture for management.',
    items: [
      { label: 'Dashboard', to: '/dashboard', plain: 'Sales, stock, dispatch, and profit numbers on one screen.', status: 'ready' },
      { label: 'Command Center', to: '/command-center', plain: 'Things that need attention right now (exceptions, stuck orders).', status: 'ready' },
    ],
  },
  {
    group: 'Commerce',
    plain: 'Where marketplace demand enters the system.',
    items: [
      { label: 'Marketplace Imports', to: '/marketplace-imports', plain: 'Bring orders from Amazon / Etsy / Walmart into RugOS.', status: 'ready' },
      { label: 'SKU Mapping Exceptions', to: '/sku-mapping', plain: 'Fix unknown marketplace SKUs so orders can proceed.', status: 'ready' },
      { label: 'Orders', to: '/orders', plain: 'Master list of every order and its status.', status: 'live' },
    ],
  },
  {
    group: 'Catalog',
    plain: 'Your product bible.',
    items: [
      { label: 'Products', to: '/products', plain: 'Product master records.', status: 'ready' },
      { label: 'SKU Master', to: '/sku-master', plain: 'Sellable SKU codes and attributes.', status: 'ready' },
      { label: 'Marketplace Mapping', to: '/marketplace-mapping', plain: 'Link external listing IDs to internal SKUs.', status: 'ready' },
    ],
  },
  {
    group: 'Inventory',
    plain: 'How much you have, where it is, and every movement.',
    items: [
      { label: 'Inventory Overview', to: '/inventory', plain: 'USA / India availability and reserved qty.', status: 'live' },
      { label: 'Stock Ledger', to: '/inventory/ledger', plain: 'Movement history (in / out / reserve).', status: 'ready' },
      { label: 'Inventory Transfers', to: '/inventory/transfers', plain: 'Move stock between locations.', status: 'ready' },
      { label: 'Adjustments', to: '/inventory/adjustments', plain: 'Correct system qty after damage / found stock.', status: 'ready' },
      { label: 'Cycle Count', to: '/inventory/cycle-count', plain: 'Physical counting sessions.', status: 'ready' },
    ],
  },
  {
    group: 'Warehouse',
    plain: 'Hands-on warehouse work in India and USA.',
    items: [
      { label: 'Warehouse Locations', to: '/warehouse/locations', plain: 'Bins / zones inside each warehouse.', status: 'ready' },
      { label: 'MTO / Production', to: '/warehouse/mto', plain: 'Make-to-order production queue.', status: 'ready' },
      { label: 'Pick & Pack', to: '/warehouse/pick-pack', plain: 'Pick list and packing for orders.', status: 'ready' },
      { label: 'Packing Queue', to: '/warehouse/packing', plain: 'Orders waiting to be packed.', status: 'ready' },
      { label: 'India Dispatch', to: '/warehouse/dispatch', plain: 'Outgoing India shipments.', status: 'ready' },
      { label: 'USA Receipts', to: '/warehouse/usa-receipts', plain: 'Confirm goods arrived in USA.', status: 'ready' },
    ],
  },
  {
    group: 'Replenishment',
    plain: 'Moving stock from India factory/warehouse to USA warehouse.',
    items: [
      { label: 'India → USA Shipments', to: '/replenishment', plain: 'Replenishment shipment list.', status: 'ready' },
      { label: 'Replenishment Planning', to: '/replenishment/planning', plain: 'What to send next based on demand.', status: 'ready' },
      { label: 'In Transit', to: '/in-transit', plain: 'Shipments currently on the water / air.', status: 'ready' },
      { label: 'Receipt Reconciliation', to: '/receipt-reconciliation', plain: 'Expected vs received qty match.', status: 'ready' },
    ],
  },
  {
    group: 'Shipping',
    plain: 'Last-mile courier to the customer.',
    items: [
      { label: 'Shipments', to: '/shipments', plain: 'Customer shipment records.', status: 'ready' },
      { label: 'Courier References', to: '/courier-references', plain: 'Paste AWB / tracking from courier portal.', status: 'ready' },
      { label: 'Labels', to: '/labels', plain: 'Internal packing / shipping labels.', status: 'ready' },
      { label: 'Tracking', to: '/tracking', plain: 'Delivery status timeline.', status: 'ready' },
      { label: 'Delivery Exceptions', to: '/shipping-exceptions', plain: 'Failed delivery, address issues, etc.', status: 'ready' },
    ],
  },
  {
    group: 'Export',
    plain: 'Papers needed for India export compliance.',
    items: [
      { label: 'Export Documents', to: '/export/documents', plain: 'Document checklist per shipment.', status: 'ready' },
      { label: 'Commercial Invoices', to: '/export/commercial-invoices', plain: 'Customs / buyer invoices.', status: 'ready' },
      { label: 'Packing Lists', to: '/export/packing-lists', plain: 'Carton contents.', status: 'ready' },
      { label: 'Proforma Invoices', to: '/export/proforma', plain: 'Advance invoices.', status: 'ready' },
      { label: 'EBRC / BRC', to: '/export/ebrc-brc', plain: 'Bank realization certificates.', status: 'ready' },
      { label: 'FIRA', to: '/export/fira', plain: 'Foreign inward remittance advice.', status: 'ready' },
    ],
  },
  {
    group: 'Returns',
    plain: 'When goods come back.',
    items: [
      { label: 'Returns', to: '/returns', plain: 'Customer-initiated returns.', status: 'ready' },
      { label: 'RTO', to: '/rto', plain: 'Return to origin from courier.', status: 'ready' },
      { label: 'Claims & Recoveries', to: '/claims', plain: 'Money recovery from courier / marketplace.', status: 'ready' },
    ],
  },
  {
    group: 'Finance',
    plain: 'Cash, cost, and profit.',
    items: [
      { label: 'Receivables', to: '/finance/receivables', plain: 'Money customers still owe.', status: 'ready' },
      { label: 'Payments', to: '/finance/payments', plain: 'Money received.', status: 'ready' },
      { label: 'Courier Invoice Audit', to: '/finance/courier-audit', plain: 'Match courier bills to shipments.', status: 'ready' },
      { label: 'Costing', to: '/finance/costing', plain: 'True landed / fulfilment cost.', status: 'ready' },
      { label: 'Profitability', to: '/finance/profitability', plain: 'Margin by order / channel.', status: 'ready' },
    ],
  },
  {
    group: 'Analytics',
    plain: 'Reports for decisions.',
    items: [
      { label: 'Sales Analytics', to: '/analytics/sales', plain: 'What is selling and where.', status: 'ready' },
      { label: 'Inventory Analytics', to: '/analytics/inventory', plain: 'Stock health and turns.', status: 'ready' },
      { label: 'Logistics Analytics', to: '/analytics/logistics', plain: 'Transit time and exceptions.', status: 'ready' },
      { label: 'Finance Analytics', to: '/analytics/finance', plain: 'Cash and margin trends.', status: 'ready' },
      { label: 'Forecasting', to: '/forecasting', plain: 'Demand forecast for planning.', status: 'ready' },
      { label: 'Reports', to: '/reports', plain: 'Downloadable report set.', status: 'ready' },
    ],
  },
  {
    group: 'System',
    plain: 'Users, integrations, and safety net.',
    items: [
      { label: 'Alerts', to: '/alerts', plain: 'System warnings (low stock, stuck jobs).', status: 'ready' },
      { label: 'Notifications', to: '/notifications', plain: 'User notification inbox.', status: 'ready' },
      { label: 'Users', to: '/users', plain: 'Company user list.', status: 'ready' },
      { label: 'Roles & Permissions', to: '/roles', plain: 'Who can see / do what.', status: 'ready' },
      { label: 'Integrations', to: '/integrations', plain: 'Marketplace & courier connectors.', status: 'ready' },
      { label: 'Job Monitor', to: '/jobs', plain: 'Background jobs status.', status: 'ready' },
      { label: 'Audit Logs', to: '/audit-logs', plain: 'Who changed what, when.', status: 'ready' },
      { label: 'Settings', to: '/settings', plain: 'Company preferences.', status: 'ready' },
    ],
  },
];

/** Explicit roadmap — SaaS + gaps called out for the client */
export const ROADMAP = [
  {
    area: 'SaaS multi-tenant',
    items: [
      { title: 'Plans, buyers, demo requests, subscriptions', status: 'live', note: 'Super Admin console live.' },
      { title: 'Company apply-for-demo from website', status: 'live', note: 'Landing form saves to Atlas.' },
      { title: 'Tenant self-serve: invite users, change plan, invoices', status: 'planned', note: 'Company admin portal.' },
      { title: 'Usage metering & plan feature gates', status: 'planned', note: 'Limit modules by plan automatically.' },
      { title: 'Hard tenant isolation on every API + proof report', status: 'planned', note: 'Security hardening for production SaaS.' },
    ],
  },
  {
    area: 'Department / user permissions',
    items: [
      { title: 'Role-based sidebar (Sales, Warehouse, Accounts…)', status: 'live', note: 'Switch role in header to preview.' },
      { title: 'Button-level allow / deny per role', status: 'planned', note: 'E.g. Auditor cannot edit stock.' },
      { title: 'Per-user custom permission sets', status: 'planned', note: 'Beyond the 7 standard roles.' },
      { title: 'Department dashboards (only their KPIs)', status: 'planned', note: 'Warehouse sees pick queue; Accounts sees cash.' },
    ],
  },
  {
    area: 'Commerce & inventory engine',
    items: [
      { title: 'Orders + stock reserve on place (USA → India → MTO)', status: 'live', note: 'Core fulfilment path.' },
      { title: 'Interactive order workflow stepper', status: 'ready', note: 'Try on demo Order #1001.' },
      { title: 'Live Amazon / Etsy / Walmart API sync', status: 'planned', note: 'Replace manual import files.' },
      { title: 'Release reserved stock on order cancel / delete', status: 'planned', note: 'Inventory hygiene.' },
    ],
  },
  {
    area: 'Logistics & finance automation',
    items: [
      { title: 'Courier reference + label screens', status: 'ready', note: 'Manual AWB mapping today.' },
      { title: 'Courier API auto-booking (UPS / FedEx / DHL)', status: 'planned', note: 'Generate AWB inside RugOS.' },
      { title: 'Bank / payment gateway reconciliation', status: 'planned', note: 'Auto-match settlements.' },
      { title: 'Barcode / handheld warehouse app', status: 'planned', note: 'Scan pick & pack on floor.' },
    ],
  },
];
