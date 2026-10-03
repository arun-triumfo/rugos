import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Legend, Line, LineChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';
import PageHeader, { ChartCard, KpiCard } from '../../components/common/PageHeader';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import SearchInput, { FilterBar, SelectFilter } from '../../components/common/SearchInput';
import { useDemo } from '../../context/DemoContext';
import { useAuth } from '../../context/AuthContext';
import { downloadCsv, formatCurrency, formatDateTime, formatNumber, formatPercent } from '../../utils/format';
import { PERMISSION_ACTIONS, PERMISSION_MODULES } from '../../data/mockSystem';
import { ROLE_LIST } from '../../constants';

export function SalesAnalyticsPage() {
  const { state } = useDemo();
  return (
    <div>
      <PageHeader title="Sales Analytics" breadcrumbs={[{ label: 'Analytics' }, { label: 'Sales' }]} />
      <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-4">
        <KpiCard label="Revenue" value="₹1.28 Cr" accent="green" />
        <KpiCard label="Orders" value={formatNumber(state.kpis.totalOrders)} />
        <KpiCard label="AOV" value={formatCurrency(51613)} />
        <KpiCard label="Units" value="1,842" />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="Revenue Trend">
          <div className="h-56"><ResponsiveContainer width="100%" height="100%"><AreaChart data={state.salesTrend.monthly}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="label" /><YAxis tickFormatter={(v) => `${v / 100000}L`} /><Tooltip formatter={(v) => formatCurrency(v)} /><Area dataKey="sales" stroke="#2563eb" fill="#93c5fd" /></AreaChart></ResponsiveContainer></div>
        </ChartCard>
        <ChartCard title="By Marketplace">
          <div className="h-56"><ResponsiveContainer width="100%" height="100%"><BarChart data={state.salesByMarketplace}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis tickFormatter={(v) => `${v / 100000}L`} /><Tooltip formatter={(v) => formatCurrency(v)} /><Bar dataKey="value" fill="#059669" /></BarChart></ResponsiveContainer></div>
        </ChartCard>
      </div>
    </div>
  );
}

export function InventoryAnalyticsPage() {
  const { state } = useDemo();
  return (
    <div>
      <PageHeader title="Inventory Analytics" breadcrumbs={[{ label: 'Analytics' }, { label: 'Inventory' }]} />
      <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-4">
        <KpiCard label="India Value" value={formatCurrency(state.kpis.indiaStockValue)} />
        <KpiCard label="USA Value" value={formatCurrency(state.kpis.usaStockValue)} />
        <KpiCard label="In Transit" value={formatNumber(state.kpis.inTransitUnits)} accent="purple" />
        <KpiCard label="Low Stock" value={state.lowStock.length} accent="amber" />
      </div>
      <ChartCard title="Inventory by Location">
        <div className="h-56"><ResponsiveContainer width="100%" height="100%"><BarChart data={state.inventoryByLocation}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis /><Tooltip /><Bar dataKey="value" fill="#7c3aed" /></BarChart></ResponsiveContainer></div>
      </ChartCard>
    </div>
  );
}

export function LogisticsAnalyticsPage() {
  const { state } = useDemo();
  return (
    <div>
      <PageHeader title="Logistics Analytics" breadcrumbs={[{ label: 'Analytics' }, { label: 'Logistics' }]} />
      <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-4">
        <KpiCard label="Pending Dispatch" value={state.kpis.pendingDispatch} accent="amber" />
        <KpiCard label="Avg Transit (days)" value="9.2" />
        <KpiCard label="Delivery Success" value="94.2%" accent="green" />
        <KpiCard label="RTO Rate" value="3.1%" accent="red" />
      </div>
      <ChartCard title="Courier Exceptions">
        <div className="h-56"><ResponsiveContainer width="100%" height="100%"><BarChart data={state.courierExceptionsChart}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 10 }} /><YAxis /><Tooltip /><Bar dataKey="value" fill="#dc2626" /></BarChart></ResponsiveContainer></div>
      </ChartCard>
    </div>
  );
}

export function FinanceAnalyticsPage() {
  const { state } = useDemo();
  return (
    <div>
      <PageHeader title="Finance Analytics" breadcrumbs={[{ label: 'Analytics' }, { label: 'Finance' }]} />
      <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-4">
        <KpiCard label="Gross Margin" value={formatPercent(state.kpis.grossMargin)} accent="green" />
        <KpiCard label="Receivables" value={formatCurrency(state.kpis.outstandingReceivables)} accent="amber" />
        <KpiCard label="Courier Disputes" value={formatCurrency(state.kpis.courierDisputes)} accent="red" />
        <KpiCard label="Net Profit" value={formatCurrency(state.kpis.netProfit)} accent="green" />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="Margin Trend">
          <div className="h-56"><ResponsiveContainer width="100%" height="100%"><LineChart data={state.profitTrend}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="label" /><YAxis /><Tooltip /><Legend /><Line dataKey="gross" stroke="#059669" /><Line dataKey="net" stroke="#2563eb" /></LineChart></ResponsiveContainer></div>
        </ChartCard>
        <ChartCard title="Receivable Ageing">
          <div className="h-56"><ResponsiveContainer width="100%" height="100%"><BarChart data={state.receivableAgeing}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis tickFormatter={(v) => `${v / 1000}k`} /><Tooltip formatter={(v) => formatCurrency(v)} /><Bar dataKey="value" fill="#d97706" /></BarChart></ResponsiveContainer></div>
        </ChartCard>
      </div>
    </div>
  );
}

export function ForecastingPage() {
  const { state } = useDemo();
  const f = state.forecast;
  return (
    <div>
      <PageHeader title="Forecasting" subtitle={f.badge} badge={<StatusBadge status={f.badge} color="blue" />} breadcrumbs={[{ label: 'Analytics' }, { label: 'Forecasting' }]} />
      <div className="mb-4"><StatusBadge status="Forecast based on available historical data" color="blue" /></div>
      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="30-day Sales Forecast">
          <div className="h-56"><ResponsiveContainer width="100%" height="100%"><LineChart data={f.sales30Day}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="label" /><YAxis tickFormatter={(v) => `${v / 1000}k`} /><Tooltip /><Legend /><Line dataKey="actual" stroke="#2563eb" /><Line dataKey="forecast" stroke="#059669" strokeDasharray="4 4" /></LineChart></ResponsiveContainer></div>
        </ChartCard>
        <ChartCard title="Expected USA Inventory">
          <div className="h-56"><ResponsiveContainer width="100%" height="100%"><AreaChart data={f.usaInventoryProjection}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="label" /><YAxis /><Tooltip /><Area dataKey="units" stroke="#7c3aed" fill="#ddd6fe" /></AreaChart></ResponsiveContainer></div>
        </ChartCard>
      </div>
      <h3 className="mb-2 mt-5 text-sm font-semibold">Demand by SKU · Replenishment Suggestion</h3>
      <DataTable columns={[
        { key: 'sku', label: 'SKU' }, { key: 'demand', label: '30d Demand' }, { key: 'available', label: 'Available' },
        { key: 'suggestion', label: 'Suggestion' },
      ]} rows={f.demandBySku} />
    </div>
  );
}

const REPORT_CARDS = [
  'Sales Report', 'Margin Report', 'Inventory Valuation', 'Inventory Movement', 'Receivable Ageing',
  'Courier Payable', 'Courier Variance', 'Return / Refund', 'Claims', 'Shipment Performance',
  'Export Realization', 'Marketplace Performance', 'Country Performance', 'SKU Performance',
];

export function ReportsPage() {
  const { state, toast } = useDemo();
  const [active, setActive] = useState('Sales Report');
  const [marketplace, setMarketplace] = useState('');

  const exportCsv = () => {
    const rows = state.orders.slice(0, 20).map((o) => ({
      order: o.orderNumber, marketplace: o.marketplace, country: o.country, sku: o.sku,
      revenue: o.sellingPrice, status: o.status, profit: o.profit,
    }));
    downloadCsv(`${active.replace(/\s+/g, '_').toLowerCase()}.csv`, rows);
    toast('CSV exported');
  };

  return (
    <div>
      <PageHeader title="Reports" breadcrumbs={[{ label: 'Analytics' }, { label: 'Reports' }]}
        actions={
          <>
            <button type="button" className="btn-primary" onClick={exportCsv}>Export CSV</button>
            <button type="button" className="btn-secondary" onClick={() => toast('Excel export simulated')}>Excel</button>
            <button type="button" className="btn-secondary" onClick={() => toast('PDF export simulated')}>PDF</button>
          </>
        }
      />
      <div className="mb-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {REPORT_CARDS.map((r) => (
          <button key={r} type="button" onClick={() => setActive(r)} className={`rounded-lg border p-3 text-left text-sm font-medium ${active === r ? 'border-accent bg-blue-50 text-accent' : 'border-border bg-panel hover:bg-slate-50'}`}>{r}</button>
        ))}
      </div>
      <FilterBar>
        <SelectFilter label="Marketplace" value={marketplace} onChange={setMarketplace} options={['Amazon', 'Etsy', 'Walmart']} />
        <SelectFilter label="Country" value="" onChange={() => {}} options={['USA', 'Canada', 'UK', 'Germany', 'Australia']} />
        <SelectFilter label="Warehouse" value="" onChange={() => {}} options={['India Main Warehouse', 'USA East Warehouse', 'Amazon FBA']} />
      </FilterBar>
      <ChartCard title={active}>
        <div className="mb-3 grid grid-cols-3 gap-3">
          <KpiCard label="Records" value={state.orders.length} />
          <KpiCard label="Revenue" value={formatCurrency(state.kpis.monthlySales)} accent="green" />
          <KpiCard label="Margin" value={formatPercent(state.kpis.grossMargin)} accent="green" />
        </div>
        <div className="mb-4 h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={state.salesByCountry}>
              <CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis tickFormatter={(v) => `${v / 100000}L`} /><Tooltip formatter={(v) => formatCurrency(v)} /><Bar dataKey="value" fill="#2563eb" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <DataTable columns={[
          { key: 'orderNumber', label: 'Order' }, { key: 'marketplace', label: 'Marketplace' },
          { key: 'country', label: 'Country' }, { key: 'sku', label: 'SKU' },
          { key: 'sellingPrice', label: 'Revenue', render: (r) => formatCurrency(r.sellingPrice) },
          { key: 'status', label: 'Status', render: (r) => <StatusBadge status={r.status} /> },
        ]} rows={state.orders.filter((o) => !marketplace || o.marketplace === marketplace).slice(0, 15)} compact />
      </ChartCard>
    </div>
  );
}

export function AlertsPage() {
  const { state, setState, toast } = useDemo();
  const update = (id, patch) => {
    setState((prev) => ({ ...prev, alerts: prev.alerts.map((a) => a.id === id ? { ...a, ...patch } : a) }));
  };
  return (
    <div>
      <PageHeader title="Alert Center" breadcrumbs={[{ label: 'System' }, { label: 'Alerts' }]} />
      <DataTable columns={[
        { key: 'priority', label: 'Priority', render: (r) => <StatusBadge status={r.priority} /> },
        { key: 'type', label: 'Type' }, { key: 'title', label: 'Alert' },
        { key: 'module', label: 'Module' },
        { key: 'createdAt', label: 'Created', render: (r) => formatDateTime(r.createdAt) },
        {
          key: 'actions', label: 'Actions', render: (r) => (
            <div className="flex flex-wrap gap-1">
              <Link to={r.link} className="btn-secondary text-xs">Open</Link>
              {!r.read && <button type="button" className="btn-secondary text-xs" onClick={() => { update(r.id, { read: true }); toast('Marked read'); }}>Mark Read</button>}
              {!r.acknowledged && <button type="button" className="btn-secondary text-xs" onClick={() => { update(r.id, { acknowledged: true, read: true }); toast('Acknowledged'); }}>Acknowledge</button>}
              {!r.resolved && <button type="button" className="btn-primary text-xs" onClick={() => { update(r.id, { resolved: true, acknowledged: true, read: true }); toast('Resolved'); }}>Resolve</button>}
            </div>
          ),
        },
      ]} rows={state.alerts} compact />
    </div>
  );
}

export function NotificationsPage() {
  const { state } = useDemo();
  return (
    <div>
      <PageHeader title="Notifications" breadcrumbs={[{ label: 'System' }, { label: 'Notifications' }]} />
      <div className="space-y-2">
        {state.notifications.map((n) => (
          <div key={n.id} className={`rounded-lg border border-border bg-panel p-3 ${n.read ? '' : 'border-l-4 border-l-accent'}`}>
            <p className="text-sm font-medium">{n.title}</p>
            <p className="text-xs text-slate-500">{n.time}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function UsersPage() {
  const { state } = useDemo();
  return (
    <div>
      <PageHeader title="Users" breadcrumbs={[{ label: 'System' }, { label: 'Users' }]} />
      <DataTable columns={[
        { key: 'name', label: 'Name' }, { key: 'email', label: 'Email' },
        { key: 'role', label: 'Role', render: (r) => <StatusBadge status={r.role} color="blue" /> },
        { key: 'department', label: 'Department' }, { key: 'location', label: 'Location' },
        { key: 'status', label: 'Status', render: (r) => <StatusBadge status={r.status} /> },
        { key: 'lastLogin', label: 'Last Login', render: (r) => formatDateTime(r.lastLogin) },
      ]} rows={state.users} />
    </div>
  );
}

export function RolesPage() {
  const { state } = useDemo();
  const [role, setRole] = useState('Management');
  const perms = state.rolePermissions[role] || {};

  return (
    <div>
      <PageHeader title="Roles & Permissions" breadcrumbs={[{ label: 'System' }, { label: 'Roles' }]} />
      <FilterBar>
        <SelectFilter label="Role" value={role} onChange={setRole} options={ROLE_LIST} />
      </FilterBar>
      <div className="overflow-x-auto rounded-lg border border-border bg-panel">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-[11px] uppercase text-slate-500">
            <tr>
              <th className="px-3 py-2 text-left">Module</th>
              {PERMISSION_ACTIONS.map((a) => <th key={a} className="px-2 py-2 text-center">{a}</th>)}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {PERMISSION_MODULES.map((mod) => (
              <tr key={mod}>
                <td className="px-3 py-2 font-medium">{mod}</td>
                {PERMISSION_ACTIONS.map((a) => (
                  <td key={a} className="px-2 py-2 text-center">
                    <input type="checkbox" checked={(perms[mod] || []).includes(a)} readOnly className="accent-accent" aria-label={`${mod} ${a}`} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-xs text-slate-500">Static permission matrix for demo — changes are visual only.</p>
    </div>
  );
}

export function IntegrationsPage() {
  const { state } = useDemo();
  return (
    <div>
      <PageHeader title="Integrations" breadcrumbs={[{ label: 'System' }, { label: 'Integrations' }]} />
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {state.integrations.map((i) => (
          <div key={i.id} className="rounded-lg border border-border bg-panel p-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-semibold text-navy-900">{i.name}</p>
                <p className="text-xs text-slate-500">{i.category}</p>
              </div>
              <StatusBadge status={i.status} />
            </div>
            <p className="mt-3 text-sm text-slate-600">{i.note}</p>
            {i.lastSync && <p className="mt-2 text-xs text-slate-400">Last sync {formatDateTime(i.lastSync)}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}

export function JobsPage() {
  const { state, setState, toast } = useDemo();
  return (
    <div>
      <PageHeader title="Job Monitor" breadcrumbs={[{ label: 'System' }, { label: 'Jobs' }]} />
      <DataTable columns={[
        { key: 'job', label: 'Job' },
        { key: 'lastRun', label: 'Last Run', render: (r) => formatDateTime(r.lastRun) },
        { key: 'duration', label: 'Duration' }, { key: 'records', label: 'Records' },
        { key: 'status', label: 'Status', render: (r) => <StatusBadge status={r.status} /> },
        { key: 'nextRun', label: 'Next Run', render: (r) => formatDateTime(r.nextRun) },
        {
          key: 'action', label: 'Action', render: (r) => (
            <button type="button" className="btn-secondary text-xs" onClick={() => {
              setState((prev) => ({
                ...prev,
                jobs: prev.jobs.map((j) => j.id === r.id ? { ...j, status: 'Success', lastRun: new Date().toISOString() } : j),
              }));
              toast(`${r.job} retried successfully`);
            }}>Retry</button>
          ),
        },
      ]} rows={state.jobs} />
    </div>
  );
}

export function AuditLogsPage() {
  const { state } = useDemo();
  const [q, setQ] = useState('');
  const rows = state.auditLogs.filter((a) => !q || `${a.reference} ${a.action} ${a.user}`.toLowerCase().includes(q.toLowerCase()));
  return (
    <div>
      <PageHeader title="Audit Logs" breadcrumbs={[{ label: 'System' }, { label: 'Audit Logs' }]} />
      <FilterBar><SearchInput value={q} onChange={setQ} className="w-64" placeholder="Search reference, action, user…" /></FilterBar>
      <DataTable columns={[
        { key: 'timestamp', label: 'Timestamp', render: (r) => formatDateTime(r.timestamp) },
        { key: 'user', label: 'User' }, { key: 'module', label: 'Module' },
        { key: 'action', label: 'Action' }, { key: 'reference', label: 'Reference' },
        { key: 'oldValue', label: 'Old', render: (r) => r.oldValue ?? '—' },
        { key: 'newValue', label: 'New', render: (r) => r.newValue ?? '—' },
        { key: 'ip', label: 'IP' },
        { key: 'status', label: 'Status', render: (r) => <StatusBadge status={r.status} /> },
      ]} rows={rows} compact />
    </div>
  );
}

export function SettingsPage() {
  const { resetDemoData, toast } = useDemo();
  const { user, modeLabel } = useAuth();
  return (
    <div>
      <PageHeader title="Settings" breadcrumbs={[{ label: 'System' }, { label: 'Settings' }]} />
      <div className="max-w-xl space-y-4">
        <div className="rounded-lg border border-border bg-panel p-4 text-sm">
          <h3 className="text-sm font-semibold">Tenant mode</h3>
          <p className="mt-1 text-slate-600">
            Company: <strong>{user?.companyName || '—'}</strong><br />
            Business mode: <strong>{modeLabel || '—'}</strong> (set by Superadmin — Import or Export, not both)
          </p>
        </div>
        <div className="rounded-lg border border-border bg-panel p-4">
          <h3 className="text-sm font-semibold">Demo Environment</h3>
          <p className="mt-1 text-sm text-slate-600">Reset all localStorage demo mutations back to the initial seed dataset.</p>
          <button type="button" className="btn-danger mt-3" onClick={() => {
            if (window.confirm('Reset all demo data to initial seed?')) resetDemoData();
          }}>Reset Demo Data</button>
        </div>
        <div className="rounded-lg border border-border bg-panel p-4 text-sm text-slate-600">
          <h3 className="font-semibold text-navy-900">Future Backend</h3>
          <p className="mt-1">Services in <code className="text-xs bg-slate-100 px-1 rounded">src/services/</code> return mock Promises today. Point <code className="text-xs bg-slate-100 px-1 rounded">VITE_API_BASE_URL</code> and swap adapters to real REST without rewriting pages.</p>
          <button type="button" className="btn-secondary mt-3" onClick={() => toast('Settings saved (demo)')}>Save Settings</button>
        </div>
      </div>
    </div>
  );
}
