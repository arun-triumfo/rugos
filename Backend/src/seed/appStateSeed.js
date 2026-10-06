import { mockProducts, mockSkuMappings } from '../../../Frontend/src/data/mockProducts.js';
import { mockStockLedger, mockTransfers, mockAdjustments, mockCycleCounts, mockLocations } from '../../../Frontend/src/data/mockInventory.js';
import { mockShipments, mockCourierReferences, mockExceptions, mockReplenishments, mockUsaReceipts } from '../../../Frontend/src/data/mockShipments.js';
import { mockReceivables, mockCourierInvoices, mockCourierAuditLines, mockEbrc, mockFira, mockExportDocuments, mockPayments } from '../../../Frontend/src/data/mockFinance.js';
import { mockReturns, mockClaims, mockMto, mockPickPack, mockPackingQueue } from '../../../Frontend/src/data/mockWarehouse.js';
import {
  mockUsers, mockAlerts, mockAuditLogs, mockJobs, mockIntegrations,
  mockImportLogs, mockMarketplaceSync, ROLE_PERMISSIONS,
} from '../../../Frontend/src/data/mockSystem.js';
import {
  mockDashboardKpis, mockSalesTrend, mockSalesByMarketplace, mockSalesByCountry,
  mockInventoryByLocation, mockOrderStatusDist, mockProfitTrend, mockReceivableAgeing,
  mockCourierExceptionsChart, mockTopSkus, mockLowStock, mockCriticalAttention,
  mockCommandCenter, mockForecast, mockNotifications,
} from '../../../Frontend/src/data/mockAnalytics.js';

function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

export function buildAppStateData() {
  return clone({
    products: mockProducts,
    skuMappings: mockSkuMappings,
    stockLedger: mockStockLedger,
    transfers: mockTransfers,
    adjustments: mockAdjustments,
    cycleCounts: mockCycleCounts,
    locations: mockLocations,
    shipments: mockShipments,
    courierReferences: mockCourierReferences,
    exceptions: mockExceptions,
    replenishments: mockReplenishments,
    usaReceipts: mockUsaReceipts,
    receivables: mockReceivables,
    courierInvoices: mockCourierInvoices,
    courierAuditLines: mockCourierAuditLines,
    ebrc: mockEbrc,
    fira: mockFira,
    exportDocuments: mockExportDocuments,
    payments: mockPayments,
    returns: mockReturns,
    claims: mockClaims,
    mto: mockMto,
    pickPack: mockPickPack,
    packingQueue: mockPackingQueue,
    users: mockUsers,
    alerts: mockAlerts,
    auditLogs: mockAuditLogs,
    jobs: mockJobs,
    integrations: mockIntegrations,
    importLogs: mockImportLogs,
    marketplaceSync: mockMarketplaceSync,
    rolePermissions: ROLE_PERMISSIONS,
    kpis: mockDashboardKpis,
    salesTrend: mockSalesTrend,
    salesByMarketplace: mockSalesByMarketplace,
    salesByCountry: mockSalesByCountry,
    inventoryByLocation: mockInventoryByLocation,
    orderStatusDist: mockOrderStatusDist,
    profitTrend: mockProfitTrend,
    receivableAgeing: mockReceivableAgeing,
    courierExceptionsChart: mockCourierExceptionsChart,
    topSkus: mockTopSkus,
    lowStock: mockLowStock,
    criticalAttention: mockCriticalAttention,
    commandCenter: mockCommandCenter,
    forecast: mockForecast,
    notifications: mockNotifications,
    demoWorkflowStep: 1,
  });
}
