export const ROLES = {
  MANAGEMENT: 'Management',
  INDIA_WAREHOUSE: 'India Warehouse',
  USA_WAREHOUSE: 'USA Warehouse',
  ACCOUNTS: 'Accounts',
  SALES: 'Sales',
  LOGISTICS: 'Logistics',
  AUDITOR: 'Auditor',
  SUPER_ADMIN: 'Super Admin',
};

export const ROLE_LIST = Object.values(ROLES);

export const MARKETPLACES = ['Amazon', 'Etsy', 'Walmart'];
export const COUNTRIES = ['USA', 'Canada', 'UK', 'Germany', 'Australia'];
export const WAREHOUSES = [
  'India Main Warehouse',
  'USA East Warehouse',
  'Amazon FBA',
];

export const ORDER_STATUSES = [
  'Imported',
  'Mapping Required',
  'Awaiting Inventory',
  'Reserved',
  'Processing',
  'Picking',
  'Picked',
  'Packing',
  'Packed',
  'Ready for Dispatch',
  'Dispatched',
  'In Transit',
  'Received USA',
  'Fulfilment Ready',
  'Shipped',
  'Delivered',
  'RTO',
  'Returned',
  'Cancelled',
];

export const SHIPMENT_STATUSES = [
  'Created',
  'Ready',
  'Dispatched',
  'In Transit',
  'Out for Delivery',
  'Delivered',
  'Exception',
  'RTO',
  'Returned',
];

export const REPLENISHMENT_STATUSES = [
  'Draft',
  'Approved',
  'Packing',
  'Dispatched India',
  'In Transit',
  'USA Received',
  'Closed',
];

export const INVENTORY_LOCATIONS = [
  'India Finished Stock',
  'India Reserved',
  'Packed / Ready',
  'India Dispatch',
  'In Transit',
  'USA Warehouse',
  'Amazon FBA',
  'Merchant Fulfilment',
  'Returned',
  'Damaged',
];

export const CURRENCY = 'INR';

export const DEMO_CREDENTIALS = {
  email: 'admin@rugos.demo',
  password: 'demo123',
};

export const STATUS_COLORS = {
  Imported: 'blue',
  'Mapping Required': 'amber',
  'Awaiting Inventory': 'amber',
  Reserved: 'blue',
  Processing: 'blue',
  Picking: 'blue',
  Picked: 'blue',
  Packing: 'blue',
  Packed: 'green',
  'Ready for Dispatch': 'green',
  Dispatched: 'purple',
  'In Transit': 'purple',
  'Received USA': 'green',
  'Fulfilment Ready': 'blue',
  Shipped: 'purple',
  Delivered: 'green',
  RTO: 'red',
  Returned: 'red',
  Cancelled: 'red',
  Success: 'green',
  Failed: 'red',
  Running: 'blue',
  Queued: 'amber',
  Open: 'amber',
  Paid: 'green',
  Overdue: 'red',
  'Partially Paid': 'amber',
  Critical: 'red',
  High: 'amber',
  Medium: 'blue',
  Low: 'gray',
  Healthy: 'green',
  'Low Stock': 'amber',
  'Out of Stock': 'red',
  Matched: 'green',
  Short: 'amber',
  Excess: 'amber',
  Damaged: 'red',
  Draft: 'gray',
  Generated: 'blue',
  Approved: 'green',
  Submitted: 'blue',
  Final: 'green',
  Pending: 'amber',
  Verified: 'blue',
  Completed: 'green',
  Exception: 'red',
};
