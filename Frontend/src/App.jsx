import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DemoProvider } from './context/DemoContext';
import { SaasProvider } from './context/SaasContext';
import AppLayout from './layouts/AppLayout';
import SuperAdminLayout from './layouts/SuperAdminLayout';
import ProtectedRoute from './routes/ProtectedRoute';
import LandingPage from './pages/Landing/LandingPage';
import LoginPage from './pages/Login/LoginPage';
import DashboardPage from './pages/Dashboard/DashboardPage';
import CommandCenterPage from './pages/CommandCenter/CommandCenterPage';
import OrdersPage from './pages/Orders/OrdersPage';
import OrderDetailPage from './pages/Orders/OrderDetailPage';
import MarketplaceImportsPage from './pages/Commerce/MarketplaceImportsPage';
import SkuMappingPage from './pages/Commerce/SkuMappingPage';
import { ProductsPage, SkuMasterPage, MarketplaceMappingPage, ProductDetailPage } from './pages/Catalog/ProductsPages';
import {
  InventoryOverviewPage, StockLedgerPage, TransfersPage, AdjustmentsPage, CycleCountPage,
} from './pages/Inventory/InventoryPages';
import {
  MtoPage, PickPackPage, PackingQueuePage, DispatchPage, UsaReceiptsPage, LocationsPage,
} from './pages/Warehouse/WarehousePages';
import {
  ReplenishmentListPage, ReplenishmentDetailPage, ReplenishmentPlanningPage,
  InTransitPage, ReceiptReconciliationPage,
} from './pages/Replenishment/ReplenishmentPages';
import {
  ShipmentsPage, ShipmentDetailPage, CourierReferencesPage, LabelsPage,
  TrackingPage, ShippingExceptionsPage,
} from './pages/Shipping/ShippingPages';
import {
  ExportDocumentsPage, CommercialInvoicesPage, PackingListsPage, ProformaPage,
  EbrcBrcPage, FiraPage, ReturnsPage, RtoPage, ClaimsPage,
} from './pages/ExportReturns/ExportReturnsPages';
import {
  ReceivablesPage, PaymentsPage, CourierAuditPage, CostingPage, ProfitabilityPage,
} from './pages/Finance/FinancePages';
import {
  SalesAnalyticsPage, InventoryAnalyticsPage, LogisticsAnalyticsPage, FinanceAnalyticsPage,
  ForecastingPage, ReportsPage, AlertsPage, NotificationsPage, UsersPage, RolesPage,
  IntegrationsPage, JobsPage, AuditLogsPage, SettingsPage,
} from './pages/AnalyticsAdmin/AnalyticsAdminPages';
import {
  SuperAdminPlansPage, SuperAdminSubscriptionsPage, SuperAdminBuyersPage, SuperAdminDemoRequestsPage,
} from './pages/SuperAdmin/SuperAdminPages';

function TenantAppGuard() {
  const { isPlatformAdmin } = useAuth();
  if (isPlatformAdmin) return <Navigate to="/superadmin/buyers" replace />;
  return <AppLayout />;
}

export default function App() {
  return (
    <AuthProvider>
      <SaasProvider>
        <DemoProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />

              <Route element={<ProtectedRoute />}>
                <Route path="/superadmin" element={<SuperAdminLayout />}>
                  <Route index element={<Navigate to="/superadmin/buyers" replace />} />
                  <Route path="plans" element={<SuperAdminPlansPage />} />
                  <Route path="buyers" element={<SuperAdminBuyersPage />} />
                  <Route path="subscriptions" element={<SuperAdminSubscriptionsPage />} />
                  <Route path="demo-requests" element={<SuperAdminDemoRequestsPage />} />
                </Route>

                <Route element={<TenantAppGuard />}>
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/command-center" element={<CommandCenterPage />} />
                  <Route path="/orders" element={<OrdersPage />} />
                  <Route path="/orders/:id" element={<OrderDetailPage />} />
                  <Route path="/marketplace-imports" element={<MarketplaceImportsPage />} />
                  <Route path="/sku-mapping" element={<SkuMappingPage />} />
                  <Route path="/products" element={<ProductsPage />} />
                  <Route path="/products/:id" element={<ProductDetailPage />} />
                  <Route path="/sku-master" element={<SkuMasterPage />} />
                  <Route path="/marketplace-mapping" element={<MarketplaceMappingPage />} />
                  <Route path="/inventory" element={<InventoryOverviewPage />} />
                  <Route path="/inventory/ledger" element={<StockLedgerPage />} />
                  <Route path="/inventory/transfers" element={<TransfersPage />} />
                  <Route path="/inventory/adjustments" element={<AdjustmentsPage />} />
                  <Route path="/inventory/cycle-count" element={<CycleCountPage />} />
                  <Route path="/warehouse/mto" element={<MtoPage />} />
                  <Route path="/warehouse/pick-pack" element={<PickPackPage />} />
                  <Route path="/warehouse/packing" element={<PackingQueuePage />} />
                  <Route path="/warehouse/dispatch" element={<DispatchPage />} />
                  <Route path="/warehouse/usa-receipts" element={<UsaReceiptsPage />} />
                  <Route path="/warehouse/locations" element={<LocationsPage />} />
                  <Route path="/replenishment" element={<ReplenishmentListPage />} />
                  <Route path="/replenishment/planning" element={<ReplenishmentPlanningPage />} />
                  <Route path="/replenishment/:id" element={<ReplenishmentDetailPage />} />
                  <Route path="/in-transit" element={<InTransitPage />} />
                  <Route path="/receipt-reconciliation" element={<ReceiptReconciliationPage />} />
                  <Route path="/shipments" element={<ShipmentsPage />} />
                  <Route path="/shipments/:id" element={<ShipmentDetailPage />} />
                  <Route path="/courier-references" element={<CourierReferencesPage />} />
                  <Route path="/labels" element={<LabelsPage />} />
                  <Route path="/tracking" element={<TrackingPage />} />
                  <Route path="/shipping-exceptions" element={<ShippingExceptionsPage />} />
                  <Route path="/export/documents" element={<ExportDocumentsPage />} />
                  <Route path="/export/commercial-invoices" element={<CommercialInvoicesPage />} />
                  <Route path="/export/packing-lists" element={<PackingListsPage />} />
                  <Route path="/export/proforma" element={<ProformaPage />} />
                  <Route path="/export/ebrc-brc" element={<EbrcBrcPage />} />
                  <Route path="/export/fira" element={<FiraPage />} />
                  <Route path="/returns" element={<ReturnsPage />} />
                  <Route path="/rto" element={<RtoPage />} />
                  <Route path="/claims" element={<ClaimsPage />} />
                  <Route path="/finance/receivables" element={<ReceivablesPage />} />
                  <Route path="/finance/payments" element={<PaymentsPage />} />
                  <Route path="/finance/courier-audit" element={<CourierAuditPage />} />
                  <Route path="/finance/costing" element={<CostingPage />} />
                  <Route path="/finance/profitability" element={<ProfitabilityPage />} />
                  <Route path="/analytics/sales" element={<SalesAnalyticsPage />} />
                  <Route path="/analytics/inventory" element={<InventoryAnalyticsPage />} />
                  <Route path="/analytics/logistics" element={<LogisticsAnalyticsPage />} />
                  <Route path="/analytics/finance" element={<FinanceAnalyticsPage />} />
                  <Route path="/forecasting" element={<ForecastingPage />} />
                  <Route path="/reports" element={<ReportsPage />} />
                  <Route path="/alerts" element={<AlertsPage />} />
                  <Route path="/notifications" element={<NotificationsPage />} />
                  <Route path="/users" element={<UsersPage />} />
                  <Route path="/roles" element={<RolesPage />} />
                  <Route path="/integrations" element={<IntegrationsPage />} />
                  <Route path="/jobs" element={<JobsPage />} />
                  <Route path="/audit-logs" element={<AuditLogsPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                </Route>
              </Route>

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </DemoProvider>
      </SaasProvider>
    </AuthProvider>
  );
}
