import mongoose from 'mongoose';

/**
 * Holds all tenant operational modules (except orders/inventory which have own collections).
 * Shape mirrors Frontend createSeedState() keys.
 */
const tenantAppStateSchema = new mongoose.Schema(
  {
    tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true, unique: true },
    data: { type: mongoose.Schema.Types.Mixed, required: true },
  },
  { timestamps: true }
);

export const TenantAppState = mongoose.model('TenantAppState', tenantAppStateSchema);

/** Keys stored inside data (orders + inventory live elsewhere) */
export const APP_STATE_KEYS = [
  'products', 'skuMappings', 'stockLedger', 'transfers', 'adjustments', 'cycleCounts', 'locations',
  'shipments', 'courierReferences', 'exceptions', 'replenishments', 'usaReceipts',
  'receivables', 'courierInvoices', 'courierAuditLines', 'ebrc', 'fira', 'exportDocuments', 'payments',
  'returns', 'claims', 'mto', 'pickPack', 'packingQueue',
  'users', 'alerts', 'auditLogs', 'jobs', 'integrations', 'importLogs', 'marketplaceSync',
  'rolePermissions', 'kpis', 'salesTrend', 'salesByMarketplace', 'salesByCountry',
  'inventoryByLocation', 'orderStatusDist', 'profitTrend', 'receivableAgeing',
  'courierExceptionsChart', 'topSkus', 'lowStock', 'criticalAttention',
  'commandCenter', 'forecast', 'notifications', 'demoWorkflowStep',
];
