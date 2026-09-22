import { mockOrders, baseTimeline1001 } from './mockOrders';
import { mockProducts, mockSkuMappings } from './mockProducts';
import { mockInventory, mockStockLedger, mockTransfers, mockAdjustments, mockCycleCounts, mockLocations } from './mockInventory';
import { mockShipments, mockCourierReferences, mockExceptions, mockReplenishments, mockUsaReceipts } from './mockShipments';
import { mockReceivables, mockCourierInvoices, mockCourierAuditLines, mockEbrc, mockFira, mockExportDocuments, mockPayments } from './mockFinance';
import { mockReturns, mockClaims, mockMto, mockPickPack, mockPackingQueue } from './mockWarehouse';
import {
  mockUsers, mockAlerts, mockAuditLogs, mockJobs, mockIntegrations,
  mockImportLogs, mockMarketplaceSync, ROLE_PERMISSIONS,
} from './mockSystem';
import {
  mockDashboardKpis, mockSalesTrend, mockSalesByMarketplace, mockSalesByCountry,
  mockInventoryByLocation, mockOrderStatusDist, mockProfitTrend, mockReceivableAgeing,
  mockCourierExceptionsChart, mockTopSkus, mockLowStock, mockCriticalAttention,
  mockCommandCenter, mockForecast, mockNotifications,
} from './mockAnalytics';

function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

export function createSeedState() {
  return deepClone({
    orders: mockOrders,
    products: mockProducts,
    skuMappings: mockSkuMappings,
    inventory: mockInventory,
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
    toasts: [],
  });
}

export { baseTimeline1001 };
