export const mockUsers = [
  { id: 'USR-001', name: 'Arjun Mehta', email: 'admin@rugos.demo', role: 'Super Admin', department: 'Administration', location: 'Jaipur HQ', status: 'Active', lastLogin: '2026-09-22T08:15:00' },
  { id: 'USR-002', name: 'Priya Sharma', email: 'priya@rugos.demo', role: 'Management', department: 'Operations', location: 'Jaipur HQ', status: 'Active', lastLogin: '2026-09-22T07:50:00' },
  { id: 'USR-003', name: 'Amit Singh', email: 'amit@rugos.demo', role: 'India Warehouse', department: 'Warehouse', location: 'India Main Warehouse', status: 'Active', lastLogin: '2026-09-22T06:30:00' },
  { id: 'USR-004', name: 'Ravi Kumar', email: 'ravi@rugos.demo', role: 'India Warehouse', department: 'Warehouse', location: 'India Main Warehouse', status: 'Active', lastLogin: '2026-09-21T18:00:00' },
  { id: 'USR-005', name: 'Mike Johnson', email: 'mike@rugos.demo', role: 'USA Warehouse', department: 'Warehouse', location: 'USA East Warehouse', status: 'Active', lastLogin: '2026-09-22T01:10:00' },
  { id: 'USR-006', name: 'Neha Gupta', email: 'neha@rugos.demo', role: 'Accounts', department: 'Finance', location: 'Jaipur HQ', status: 'Active', lastLogin: '2026-09-22T09:00:00' },
  { id: 'USR-007', name: 'Sanjay Verma', email: 'sanjay@rugos.demo', role: 'Sales', department: 'Sales', location: 'Jaipur HQ', status: 'Active', lastLogin: '2026-09-21T16:40:00' },
  { id: 'USR-008', name: 'Anita Desai', email: 'anita@rugos.demo', role: 'Logistics', department: 'Logistics', location: 'Jaipur HQ', status: 'Active', lastLogin: '2026-09-22T08:45:00' },
  { id: 'USR-009', name: 'Vikram Rao', email: 'vikram@rugos.demo', role: 'Auditor', department: 'Compliance', location: 'Jaipur HQ', status: 'Active', lastLogin: '2026-09-20T11:00:00' },
];

export const mockAlerts = [
  { id: 'ALT-001', type: 'Mapping Missing', title: 'SKU mapping required for ETS-HK-WOOL-NEW', priority: 'Critical', module: 'SKU Mapping', link: '/sku-mapping', read: false, acknowledged: false, resolved: false, createdAt: '2026-09-22T08:10:00' },
  { id: 'ALT-002', type: 'Overdue Order', title: 'Order #1010 awaiting inventory allocation', priority: 'High', module: 'Orders', link: '/orders/1010', read: false, acknowledged: false, resolved: false, createdAt: '2026-09-22T07:00:00' },
  { id: 'ALT-003', type: 'Shipment Delay', title: 'Delayed India dispatch for Order #1009', priority: 'High', module: 'Warehouse', link: '/warehouse/dispatch', read: false, acknowledged: false, resolved: false, createdAt: '2026-09-21T16:00:00' },
  { id: 'ALT-004', type: 'USA Receipt Discrepancy', title: 'Short receipt on REP-2026-001 / RUG-1006', priority: 'Critical', module: 'Replenishment', link: '/warehouse/usa-receipts', read: false, acknowledged: true, resolved: false, createdAt: '2026-09-18T14:00:00' },
  { id: 'ALT-005', type: 'Courier Exception', title: 'Delivery exception on SHP-1013', priority: 'High', module: 'Shipping', link: '/shipping-exceptions', read: true, acknowledged: true, resolved: false, createdAt: '2026-09-21T09:00:00' },
  { id: 'ALT-006', type: 'Overdue Receivable', title: 'INV-B2B-001 overdue — HomeStyle Distributors', priority: 'Critical', module: 'Finance', link: '/finance/receivables', read: false, acknowledged: false, resolved: false, createdAt: '2026-09-15T09:00:00' },
  { id: 'ALT-007', type: 'Courier Variance', title: 'Courier invoice variance ₹82,450 open disputes', priority: 'High', module: 'Finance', link: '/finance/courier-audit', read: false, acknowledged: false, resolved: false, createdAt: '2026-09-20T11:00:00' },
  { id: 'ALT-008', type: 'Pending Export Realization', title: 'EBRC pending for INV-EXP-8901', priority: 'Medium', module: 'Export', link: '/export/ebrc-brc', read: false, acknowledged: false, resolved: false, createdAt: '2026-09-19T10:00:00' },
  { id: 'ALT-009', type: 'Low Stock', title: 'RUG-1013 below reorder level', priority: 'High', module: 'Inventory', link: '/inventory', read: false, acknowledged: false, resolved: false, createdAt: '2026-09-21T08:00:00' },
  { id: 'ALT-010', type: 'Low Stock', title: 'RUG-1017 out of stock in India', priority: 'Critical', module: 'Inventory', link: '/inventory', read: true, acknowledged: true, resolved: false, createdAt: '2026-09-18T12:00:00' },
  { id: 'ALT-011', type: 'Replenishment Required', title: 'USA low stock projected for RUG-1004', priority: 'Medium', module: 'Replenishment', link: '/replenishment', read: false, acknowledged: false, resolved: false, createdAt: '2026-09-22T06:00:00' },
  { id: 'ALT-012', type: 'Return Received', title: 'RET-007 received at USA warehouse', priority: 'Medium', module: 'Returns', link: '/returns', read: false, acknowledged: false, resolved: false, createdAt: '2026-09-21T15:00:00' },
  { id: 'ALT-013', type: 'Failed Sync', title: 'Walmart order import — 2 failed records', priority: 'Medium', module: 'Integrations', link: '/marketplace-imports', read: true, acknowledged: false, resolved: false, createdAt: '2026-09-22T05:30:00' },
  { id: 'ALT-014', type: 'Mapping Missing', title: 'AMZ-RUG-NEW-BLUE needs internal SKU', priority: 'High', module: 'SKU Mapping', link: '/sku-mapping', read: false, acknowledged: false, resolved: false, createdAt: '2026-09-22T08:05:00' },
  { id: 'ALT-015', type: 'Overdue Receivable', title: 'INV-B2B-005 overdue — Britannia Home Ltd', priority: 'High', module: 'Finance', link: '/finance/receivables', read: false, acknowledged: false, resolved: false, createdAt: '2026-09-10T09:00:00' },
  { id: 'ALT-016', type: 'Shipment Delay', title: 'SHP-1005 transit delay at CVG hub', priority: 'Medium', module: 'Shipping', link: '/shipments/SHP-1005', read: false, acknowledged: false, resolved: false, createdAt: '2026-09-20T08:00:00' },
];

export const mockAuditLogs = [
  { id: 'AUD-001', timestamp: '2026-09-18T09:05:00', user: 'System Sync', module: 'Orders', action: 'Import', reference: 'Order #1001', oldValue: null, newValue: 'Imported', ip: '10.0.0.1', status: 'Success' },
  { id: 'AUD-002', timestamp: '2026-09-18T09:06:00', user: 'System', module: 'Orders', action: 'Normalize', reference: 'Order #1001', oldValue: 'Imported', newValue: 'Mapping Required', ip: '10.0.0.1', status: 'Success' },
  { id: 'AUD-003', timestamp: '2026-09-17T14:30:00', user: 'Priya Sharma', module: 'Inventory', action: 'Reserve', reference: 'Order #1002', oldValue: 'Available 20', newValue: 'Reserved +2', ip: '10.0.1.12', status: 'Success' },
  { id: 'AUD-004', timestamp: '2026-09-17T15:00:00', user: 'Amit Singh', module: 'Warehouse', action: 'Start Pick', reference: 'Order #1003', oldValue: 'Awaiting Pick', newValue: 'Picking', ip: '10.0.2.5', status: 'Success' },
  { id: 'AUD-005', timestamp: '2026-09-17T16:20:00', user: 'Amit Singh', module: 'Shipping', action: 'AWB Updated', reference: 'SHP-1003', oldValue: null, newValue: 'DLV88321001', ip: '10.0.2.5', status: 'Success' },
  { id: 'AUD-006', timestamp: '2026-09-18T14:00:00', user: 'Mike Johnson', module: 'Warehouse', action: 'USA Receipt Confirmed', reference: 'RCP-USA-041', oldValue: 'Pending', newValue: 'Matched', ip: '10.0.3.8', status: 'Success' },
  { id: 'AUD-007', timestamp: '2026-09-18T14:05:00', user: 'Mike Johnson', module: 'Warehouse', action: 'Create Discrepancy', reference: 'RCP-USA-043', oldValue: 'Expected 10', newValue: 'Received 9', ip: '10.0.3.8', status: 'Success' },
  { id: 'AUD-008', timestamp: '2026-09-20T11:30:00', user: 'Neha Gupta', module: 'Finance', action: 'Courier Invoice Disputed', reference: 'CI-002', oldValue: 'Pending Audit', newValue: 'Disputed', ip: '10.0.1.20', status: 'Success' },
  { id: 'AUD-009', timestamp: '2026-09-18T10:00:00', user: 'Neha Gupta', module: 'Finance', action: 'Payment Recorded', reference: 'INV-B2B-006', oldValue: 'Open', newValue: 'Partially Paid', ip: '10.0.1.20', status: 'Success' },
  { id: 'AUD-010', timestamp: '2026-09-15T09:00:00', user: 'Neha Gupta', module: 'Products', action: 'Product Cost Changed', reference: 'RUG-1001', oldValue: '8200', newValue: '8500', ip: '10.0.1.20', status: 'Success' },
  { id: 'AUD-011', timestamp: '2026-09-19T08:00:00', user: 'Anita Desai', module: 'Replenishment', action: 'Approve', reference: 'REP-2026-003', oldValue: 'Draft', newValue: 'Approved', ip: '10.0.1.15', status: 'Success' },
  { id: 'AUD-012', timestamp: '2026-09-21T09:00:00', user: 'System', module: 'Shipping', action: 'Exception Raised', reference: 'SHP-1013', oldValue: 'In Transit', newValue: 'Exception', ip: '10.0.0.1', status: 'Success' },
  { id: 'AUD-013', timestamp: '2026-09-12T10:00:00', user: 'Sanjay Verma', module: 'SKU Mapping', action: 'Map SKU', reference: 'AMZ-PERS-912', oldValue: null, newValue: 'RUG-1004', ip: '10.0.1.18', status: 'Success' },
  { id: 'AUD-014', timestamp: '2026-09-16T12:00:00', user: 'Ravi Kumar', module: 'Warehouse', action: 'Mark Packed', reference: 'Order #1006', oldValue: 'Packing', newValue: 'Packed', ip: '10.0.2.6', status: 'Success' },
  { id: 'AUD-015', timestamp: '2026-09-08T16:00:00', user: 'Anita Desai', module: 'Replenishment', action: 'Dispatch India', reference: 'REP-2026-001', oldValue: 'Packing', newValue: 'Dispatched India', ip: '10.0.1.15', status: 'Success' },
  { id: 'AUD-016', timestamp: '2026-09-22T05:30:00', user: 'System Sync', module: 'Integrations', action: 'Import Failed', reference: 'Walmart Sync', oldValue: null, newValue: '2 failed', ip: '10.0.0.1', status: 'Failed' },
  { id: 'AUD-017', timestamp: '2026-09-21T11:00:00', user: 'Vikram Rao', module: 'Inventory', action: 'Cycle Count', reference: 'CC-012', oldValue: '3', newValue: '2', ip: '10.0.1.30', status: 'Success' },
  { id: 'AUD-018', timestamp: '2026-09-20T14:00:00', user: 'Neha Gupta', module: 'Export', action: 'EBRC Submit', reference: 'EBRC-004', oldValue: 'Pending', newValue: 'Submitted', ip: '10.0.1.20', status: 'Success' },
  { id: 'AUD-019', timestamp: '2026-09-19T16:00:00', user: 'Mike Johnson', module: 'Returns', action: 'Inspect Return', reference: 'RET-004', oldValue: 'Received', newValue: 'Inspected', ip: '10.0.3.8', status: 'Success' },
  { id: 'AUD-020', timestamp: '2026-09-18T17:00:00', user: 'Anita Desai', module: 'Claims', action: 'Submit Claim', reference: 'CLM-001', oldValue: 'Draft', newValue: 'Submitted', ip: '10.0.1.15', status: 'Success' },
  { id: 'AUD-021', timestamp: '2026-09-17T09:00:00', user: 'Priya Sharma', module: 'Orders', action: 'Allocate Inventory', reference: 'Order #1014', oldValue: 'Awaiting Inventory', newValue: 'Reserved', ip: '10.0.1.12', status: 'Success' },
  { id: 'AUD-022', timestamp: '2026-09-16T08:00:00', user: 'System', module: 'Finance', action: 'Cost Recalculation', reference: 'Batch', oldValue: null, newValue: '48 orders', ip: '10.0.0.1', status: 'Success' },
  { id: 'AUD-023', timestamp: '2026-09-15T14:00:00', user: 'Amit Singh', module: 'Shipping', action: 'Generate Label', reference: 'Order #1003', oldValue: null, newValue: 'Label Generated', ip: '10.0.2.5', status: 'Success' },
  { id: 'AUD-024', timestamp: '2026-09-14T10:00:00', user: 'Ravi Kumar', module: 'Warehouse', action: 'Dispatch', reference: 'Order #1012', oldValue: 'Ready for Dispatch', newValue: 'Dispatched', ip: '10.0.2.6', status: 'Success' },
  { id: 'AUD-025', timestamp: '2026-09-13T11:00:00', user: 'Sanjay Verma', module: 'Products', action: 'Create Product', reference: 'RUG-1016', oldValue: null, newValue: 'Active', ip: '10.0.1.18', status: 'Success' },
  { id: 'AUD-026', timestamp: '2026-09-12T15:00:00', user: 'Neha Gupta', module: 'Finance', action: 'Approve Document', reference: 'DOC-011', oldValue: 'Generated', newValue: 'Approved', ip: '10.0.1.20', status: 'Success' },
  { id: 'AUD-027', timestamp: '2026-09-11T09:00:00', user: 'Arjun Mehta', module: 'Users', action: 'Role Update', reference: 'USR-008', oldValue: 'Sales', newValue: 'Logistics', ip: '10.0.1.1', status: 'Success' },
  { id: 'AUD-028', timestamp: '2026-09-10T13:00:00', user: 'System', module: 'Alerts', action: 'Create Alert', reference: 'ALT-006', oldValue: null, newValue: 'Overdue Receivable', ip: '10.0.0.1', status: 'Success' },
  { id: 'AUD-029', timestamp: '2026-09-09T10:00:00', user: 'Anita Desai', module: 'Integrations', action: 'Manual Sync', reference: 'Amazon', oldValue: null, newValue: 'Success', ip: '10.0.1.15', status: 'Success' },
  { id: 'AUD-030', timestamp: '2026-09-08T12:00:00', user: 'Mike Johnson', module: 'Inventory', action: 'Transfer', reference: 'TRF-091', oldValue: 'USA Warehouse', newValue: 'Amazon FBA', ip: '10.0.3.8', status: 'Success' },
  { id: 'AUD-031', timestamp: '2026-09-22T08:00:00', user: 'Priya Sharma', module: 'Orders', action: 'View Demo Workflow', reference: 'Order #1001', oldValue: null, newValue: 'Opened', ip: '10.0.1.12', status: 'Success' },
];

export const mockJobs = [
  { id: 'JOB-001', job: 'Amazon Order Import', lastRun: '2026-09-22T05:00:00', duration: '42s', records: 36, status: 'Success', nextRun: '2026-09-22T11:00:00' },
  { id: 'JOB-002', job: 'Etsy Order Import', lastRun: '2026-09-22T05:05:00', duration: '28s', records: 12, status: 'Success', nextRun: '2026-09-22T11:05:00' },
  { id: 'JOB-003', job: 'Walmart Order Import', lastRun: '2026-09-22T05:10:00', duration: '35s', records: 8, status: 'Failed', nextRun: '2026-09-22T11:10:00' },
  { id: 'JOB-004', job: 'Inventory Sync', lastRun: '2026-09-22T04:00:00', duration: '1m 12s', records: 20, status: 'Success', nextRun: '2026-09-22T10:00:00' },
  { id: 'JOB-005', job: 'Tracking Sync', lastRun: '2026-09-22T06:00:00', duration: '55s', records: 15, status: 'Running', nextRun: '2026-09-22T12:00:00' },
  { id: 'JOB-006', job: 'Cost Recalculation', lastRun: '2026-09-22T03:00:00', duration: '2m 05s', records: 48, status: 'Success', nextRun: '2026-09-23T03:00:00' },
  { id: 'JOB-007', job: 'Receivable Ageing', lastRun: '2026-09-22T02:00:00', duration: '18s', records: 11, status: 'Success', nextRun: '2026-09-23T02:00:00' },
  { id: 'JOB-008', job: 'Forecast Refresh', lastRun: '2026-09-21T22:00:00', duration: '1m 40s', records: 16, status: 'Queued', nextRun: '2026-09-22T22:00:00' },
];

export const mockIntegrations = [
  { id: 'INT-001', name: 'Amazon', category: 'Marketplace', status: 'Demo Connected', note: 'Demo data only — live API requires credentials', lastSync: '2026-09-22T05:00:00' },
  { id: 'INT-002', name: 'Etsy', category: 'Marketplace', status: 'Demo Connected', note: 'Demo data only — live API requires credentials', lastSync: '2026-09-22T05:05:00' },
  { id: 'INT-003', name: 'Walmart', category: 'Marketplace', status: 'Demo Connected', note: 'Demo data only — live API requires credentials', lastSync: '2026-09-22T05:10:00' },
  { id: 'INT-004', name: 'India Courier Portal', category: 'Courier', status: 'Manual Process', note: 'Interim manual/reference workflow — operator maps AWB/QR from external portal', lastSync: null },
  { id: 'INT-005', name: 'Future USA Courier', category: 'Courier', status: 'Pending API', note: 'Future / pending provider integration — not live', lastSync: null },
  { id: 'INT-006', name: 'Email', category: 'Communication', status: 'Demo Connected', note: 'Demo notifications only', lastSync: '2026-09-22T08:00:00' },
  { id: 'INT-007', name: 'SMS', category: 'Communication', status: 'Not Configured', note: 'Requires external provider/account', lastSync: null },
  { id: 'INT-008', name: 'WhatsApp', category: 'Communication', status: 'Not Configured', note: 'Requires external provider/account', lastSync: null },
];

export const mockImportLogs = [
  { id: 'IMP-001', source: 'Amazon', startedAt: '2026-09-22T05:00:00', completedAt: '2026-09-22T05:00:42', recordsReceived: 36, created: 4, updated: 30, skipped: 2, failed: 0 },
  { id: 'IMP-002', source: 'Etsy', startedAt: '2026-09-22T05:05:00', completedAt: '2026-09-22T05:05:28', recordsReceived: 12, created: 2, updated: 9, skipped: 1, failed: 0 },
  { id: 'IMP-003', source: 'Walmart', startedAt: '2026-09-22T05:10:00', completedAt: '2026-09-22T05:10:35', recordsReceived: 10, created: 1, updated: 7, skipped: 0, failed: 2 },
  { id: 'IMP-004', source: 'Amazon', startedAt: '2026-09-21T17:00:00', completedAt: '2026-09-21T17:00:38', recordsReceived: 28, created: 3, updated: 24, skipped: 1, failed: 0 },
  { id: 'IMP-005', source: 'Etsy', startedAt: '2026-09-21T17:05:00', completedAt: '2026-09-21T17:05:22', recordsReceived: 9, created: 1, updated: 8, skipped: 0, failed: 0 },
];

export const mockMarketplaceSync = [
  { marketplace: 'Amazon', status: 'Connected', lastSync: '2026-09-22T05:00:00', ordersImported: 156, failedImports: 0, syncStatus: 'Healthy', nextSync: '2026-09-22T11:00:00' },
  { marketplace: 'Etsy', status: 'Connected', lastSync: '2026-09-22T05:05:00', ordersImported: 64, failedImports: 0, syncStatus: 'Healthy', nextSync: '2026-09-22T11:05:00' },
  { marketplace: 'Walmart', status: 'Connected', lastSync: '2026-09-22T05:10:00', ordersImported: 42, failedImports: 2, syncStatus: 'Warning', nextSync: '2026-09-22T11:10:00' },
];

export const ROLE_PERMISSIONS = {
  Management: { Orders: ['View', 'Create', 'Edit', 'Approve', 'Export'], Products: ['View', 'Create', 'Edit', 'Export'], Inventory: ['View', 'Edit', 'Approve', 'Export'], Warehouse: ['View', 'Approve'], Shipping: ['View', 'Approve'], Export: ['View', 'Approve'], Returns: ['View', 'Approve'], Finance: ['View', 'Approve', 'Export'], Reports: ['View', 'Export'], Users: ['View'], Settings: ['View'] },
  'India Warehouse': { Orders: ['View', 'Process'], Products: ['View'], Inventory: ['View', 'Edit', 'Process'], Warehouse: ['View', 'Create', 'Edit', 'Process'], Shipping: ['View', 'Edit', 'Process'], Export: ['View'], Returns: ['View'], Finance: [], Reports: ['View'], Users: [], Settings: [] },
  'USA Warehouse': { Orders: ['View', 'Process'], Products: ['View'], Inventory: ['View', 'Edit', 'Process'], Warehouse: ['View', 'Create', 'Edit', 'Process'], Shipping: ['View', 'Edit', 'Process'], Export: [], Returns: ['View', 'Edit', 'Process'], Finance: [], Reports: ['View'], Users: [], Settings: [] },
  Accounts: { Orders: ['View'], Products: ['View'], Inventory: ['View'], Warehouse: ['View'], Shipping: ['View'], Export: ['View', 'Create', 'Edit', 'Approve', 'Export'], Returns: ['View'], Finance: ['View', 'Create', 'Edit', 'Approve', 'Import', 'Export'], Reports: ['View', 'Export'], Users: [], Settings: ['View'] },
  Sales: { Orders: ['View', 'Create', 'Edit'], Products: ['View', 'Create', 'Edit'], Inventory: ['View'], Warehouse: ['View'], Shipping: ['View'], Export: ['View'], Returns: ['View'], Finance: ['View'], Reports: ['View', 'Export'], Users: [], Settings: [] },
  Logistics: { Orders: ['View'], Products: ['View'], Inventory: ['View'], Warehouse: ['View', 'Process'], Shipping: ['View', 'Create', 'Edit', 'Process'], Export: ['View', 'Create', 'Edit'], Returns: ['View', 'Edit'], Finance: ['View'], Reports: ['View', 'Export'], Users: [], Settings: [] },
  Auditor: { Orders: ['View', 'Export'], Products: ['View', 'Export'], Inventory: ['View', 'Export'], Warehouse: ['View', 'Export'], Shipping: ['View', 'Export'], Export: ['View', 'Export'], Returns: ['View', 'Export'], Finance: ['View', 'Export'], Reports: ['View', 'Export'], Users: ['View'], Settings: ['View'] },
  'Super Admin': { Orders: ['View', 'Create', 'Edit', 'Delete', 'Approve', 'Import', 'Export', 'Process'], Products: ['View', 'Create', 'Edit', 'Delete', 'Approve', 'Import', 'Export'], Inventory: ['View', 'Create', 'Edit', 'Delete', 'Approve', 'Import', 'Export', 'Process'], Warehouse: ['View', 'Create', 'Edit', 'Delete', 'Approve', 'Process'], Shipping: ['View', 'Create', 'Edit', 'Delete', 'Approve', 'Process'], Export: ['View', 'Create', 'Edit', 'Delete', 'Approve', 'Export'], Returns: ['View', 'Create', 'Edit', 'Delete', 'Approve', 'Process'], Finance: ['View', 'Create', 'Edit', 'Delete', 'Approve', 'Import', 'Export'], Reports: ['View', 'Export'], Users: ['View', 'Create', 'Edit', 'Delete'], Settings: ['View', 'Create', 'Edit', 'Delete'] },
};

export const PERMISSION_MODULES = ['Orders', 'Products', 'Inventory', 'Warehouse', 'Shipping', 'Export', 'Returns', 'Finance', 'Reports', 'Users', 'Settings'];
export const PERMISSION_ACTIONS = ['View', 'Create', 'Edit', 'Delete', 'Approve', 'Import', 'Export', 'Process'];
