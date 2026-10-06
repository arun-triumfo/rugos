import {
  LayoutDashboard, Command, ShoppingCart, Download, Link2, Package, Tags,
  Boxes, BookOpen, ArrowLeftRight, SlidersHorizontal, ClipboardCheck,
  Factory, ScanLine, PackageCheck, Truck, PackageOpen, MapPin,
  Ship, Route, PackageSearch, FileText, Plane, RotateCcw, ShieldAlert,
  Wallet, CreditCard, FileSpreadsheet, Calculator, PieChart,
  BarChart3, TrendingUp, LineChart, Bell, Users, KeyRound, Plug,
  Activity, ScrollText, Settings, ChevronDown, ChevronRight,
} from 'lucide-react';

export const NAV_GROUPS = [
  {
    label: 'Overview',
    items: [
      { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      // Show modules one-by-one during demos — uncomment when ready:
      // { to: '/command-center', label: 'Command Center', icon: Command },
    ],
  },
  /*
  {
    label: 'Commerce',
    items: [
      { to: '/orders', label: 'Orders', icon: ShoppingCart },
      { to: '/marketplace-imports', label: 'Marketplace Imports', icon: Download },
      { to: '/sku-mapping', label: 'SKU Mapping Exceptions', icon: Link2 },
    ],
  },
  {
    label: 'Catalog',
    items: [
      { to: '/products', label: 'Products', icon: Package },
      { to: '/sku-master', label: 'SKU Master', icon: Tags },
      { to: '/marketplace-mapping', label: 'Marketplace Mapping', icon: Link2 },
    ],
  },
  {
    label: 'Inventory',
    items: [
      { to: '/inventory', label: 'Inventory Overview', icon: Boxes },
      { to: '/inventory/ledger', label: 'Stock Ledger', icon: BookOpen },
      { to: '/inventory/transfers', label: 'Inventory Transfers', icon: ArrowLeftRight },
      { to: '/inventory/adjustments', label: 'Adjustments', icon: SlidersHorizontal },
      { to: '/inventory/cycle-count', label: 'Cycle Count', icon: ClipboardCheck },
    ],
  },
  {
    label: 'Warehouse',
    items: [
      { to: '/warehouse/mto', label: 'MTO / Production', icon: Factory },
      { to: '/warehouse/pick-pack', label: 'Pick & Pack', icon: ScanLine },
      { to: '/warehouse/packing', label: 'Packing Queue', icon: PackageCheck },
      { to: '/warehouse/dispatch', label: 'India Dispatch', icon: Truck },
      { to: '/warehouse/usa-receipts', label: 'USA Receipts', icon: PackageOpen },
      { to: '/warehouse/locations', label: 'Warehouse Locations', icon: MapPin },
    ],
  },
  {
    label: 'Replenishment',
    items: [
      { to: '/replenishment', label: 'India → USA Shipments', icon: Ship },
      { to: '/replenishment/planning', label: 'Replenishment Planning', icon: Route },
      { to: '/in-transit', label: 'In Transit', icon: Plane },
      { to: '/receipt-reconciliation', label: 'Receipt Reconciliation', icon: ClipboardCheck },
    ],
  },
  {
    label: 'Shipping',
    items: [
      { to: '/shipments', label: 'Shipments', icon: Truck },
      { to: '/courier-references', label: 'Courier References', icon: PackageSearch },
      { to: '/labels', label: 'Labels', icon: FileText },
      { to: '/tracking', label: 'Tracking', icon: Route },
      { to: '/shipping-exceptions', label: 'Delivery Exceptions', icon: ShieldAlert },
    ],
  },
  {
    label: 'Export',
    items: [
      { to: '/export/documents', label: 'Export Documents', icon: FileText },
      { to: '/export/commercial-invoices', label: 'Commercial Invoices', icon: FileSpreadsheet },
      { to: '/export/packing-lists', label: 'Packing Lists', icon: ClipboardCheck },
      { to: '/export/proforma', label: 'Proforma Invoices', icon: FileText },
      { to: '/export/ebrc-brc', label: 'EBRC / BRC', icon: Wallet },
      { to: '/export/fira', label: 'FIRA', icon: CreditCard },
    ],
  },
  {
    label: 'Returns',
    items: [
      { to: '/returns', label: 'Returns', icon: RotateCcw },
      { to: '/rto', label: 'RTO', icon: RotateCcw },
      { to: '/claims', label: 'Claims & Recoveries', icon: ShieldAlert },
    ],
  },
  {
    label: 'Finance',
    items: [
      { to: '/finance/receivables', label: 'Receivables', icon: Wallet },
      { to: '/finance/payments', label: 'Payments', icon: CreditCard },
      { to: '/finance/courier-audit', label: 'Courier Invoice Audit', icon: FileSpreadsheet },
      { to: '/finance/costing', label: 'Costing', icon: Calculator },
      { to: '/finance/profitability', label: 'Profitability', icon: PieChart },
    ],
  },
  {
    label: 'Analytics',
    items: [
      { to: '/analytics/sales', label: 'Sales Analytics', icon: BarChart3 },
      { to: '/analytics/inventory', label: 'Inventory Analytics', icon: Boxes },
      { to: '/analytics/logistics', label: 'Logistics Analytics', icon: Truck },
      { to: '/analytics/finance', label: 'Finance Analytics', icon: TrendingUp },
      { to: '/forecasting', label: 'Forecasting', icon: LineChart },
      { to: '/reports', label: 'Reports', icon: FileSpreadsheet },
    ],
  },
  {
    label: 'System',
    items: [
      { to: '/alerts', label: 'Alerts', icon: Bell },
      { to: '/notifications', label: 'Notifications', icon: Bell },
      { to: '/users', label: 'Users', icon: Users },
      { to: '/roles', label: 'Roles & Permissions', icon: KeyRound },
      { to: '/integrations', label: 'Integrations', icon: Plug },
      { to: '/jobs', label: 'Job Monitor', icon: Activity },
      { to: '/audit-logs', label: 'Audit Logs', icon: ScrollText },
      { to: '/settings', label: 'Settings', icon: Settings },
    ],
  },
  */
];

export { ChevronDown, ChevronRight };
