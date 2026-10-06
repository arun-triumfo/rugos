import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart,
  Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';
import { AlertTriangle, IndianRupee, Package, ShoppingCart, Truck } from 'lucide-react';
import PageHeader, { ChartCard, KpiCard } from '../../components/common/PageHeader';
import StatusBadge from '../../components/common/StatusBadge';
import { LoadingSkeleton } from '../../components/common/Misc';
import { useDemo } from '../../context/DemoContext';
import { getDashboardData } from '../../services';
import { formatCurrency, formatNumber, formatPercent } from '../../utils/format';

const PIE_COLORS = ['#2563eb', '#059669', '#d97706', '#7c3aed', '#dc2626', '#64748b'];

export default function DashboardPage() {
  const { state } = useDemo();
  const [data, setData] = useState(null);
  const [trendTab, setTrendTab] = useState('daily');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getDashboardData(state)
      .then((d) => {
        if (!cancelled) {
          setData(d);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [state.orders, state.inventory, state.kpis]);

  if (loading || !data) {
    return (
      <div>
        <PageHeader title="Dashboard" subtitle="Management operations overview" />
        <LoadingSkeleton rows={8} />
      </div>
    );
  }

  const { kpis } = data;

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle="Commerce · Inventory · Logistics · Finance snapshot"
        breadcrumbs={[{ label: 'Overview' }, { label: 'Dashboard' }]}
        actions={
          <Link to="/orders/1001" className="btn-primary">Open Order #1001 Demo</Link>
        }
      />

      <div className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-7">
        <KpiCard label="Today's Sales" value={formatCurrency(kpis.todaysSales)} icon={IndianRupee} accent="blue" />
        <KpiCard label="Monthly Sales" value={formatCurrency(kpis.monthlySales)} icon={IndianRupee} accent="green" />
        <KpiCard label="Orders Today" value={formatNumber(kpis.ordersToday)} sub={`${kpis.pendingOrders} pending`} icon={ShoppingCart} accent="blue" />
        <KpiCard label="Pending Dispatch" value={formatNumber(kpis.pendingDispatch)} icon={Truck} accent="amber" />
        <KpiCard label="In Transit" value={`${formatNumber(kpis.inTransitUnits)} units`} icon={Truck} accent="purple" />
        <KpiCard label="USA Inventory" value={`${formatNumber(kpis.usaInventoryUnits)} units`} sub={formatCurrency(kpis.usaStockValue)} icon={Package} accent="green" />
        <KpiCard label="India Inventory" value={`${formatNumber(kpis.indiaInventoryUnits)} units`} sub={formatCurrency(kpis.indiaStockValue)} icon={Package} accent="blue" />
        <KpiCard label="Receivables" value={formatCurrency(kpis.outstandingReceivables)} accent="amber" />
        <KpiCard label="Gross Margin" value={formatPercent(kpis.grossMargin)} sub={`GP ${formatCurrency(kpis.grossProfit)}`} accent="green" />
        <KpiCard label="Net Profit" value={formatCurrency(kpis.netProfit)} accent="green" />
        <KpiCard label="Returns" value={formatNumber(kpis.returns)} accent="red" />
        <KpiCard label="Courier Disputes" value={formatCurrency(kpis.courierDisputes)} accent="red" />
        <KpiCard label="Low Stock SKUs" value={formatNumber(kpis.lowStockSkus)} accent="amber" />
        <KpiCard label="Total Orders" value={formatNumber(kpis.totalOrders)} accent="blue" />
      </div>

      <div className="mb-5 grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        <ChartCard
          title="Sales Trend"
          className="xl:col-span-2"
          actions={
            <div className="flex gap-1">
              {['daily', 'weekly', 'monthly'].map((t) => (
                <button key={t} type="button" onClick={() => setTrendTab(t)} className={`rounded px-2 py-0.5 text-xs capitalize ${trendTab === t ? 'bg-accent text-white' : 'bg-slate-100 text-slate-600'}`}>
                  {t}
                </button>
              ))}
            </div>
          }
        >
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.salesTrend[trendTab]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${(v / 100000).toFixed(0)}L`} />
                <Tooltip formatter={(v) => formatCurrency(v)} />
                <Area type="monotone" dataKey="sales" stroke="#2563eb" fill="#93c5fd" fillOpacity={0.4} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Sales By Marketplace">
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data.salesByMarketplace} dataKey="value" nameKey="name" innerRadius={45} outerRadius={75} paddingAngle={2}>
                  {data.salesByMarketplace.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v) => formatCurrency(v)} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Sales By Country">
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.salesByCountry} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="name" width={70} tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v) => formatCurrency(v)} />
                <Bar dataKey="value" fill="#2563eb" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Inventory By Location">
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.inventoryByLocation}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="value" fill="#7c3aed" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Order Status Distribution">
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data.orderStatusDist} dataKey="value" nameKey="name" outerRadius={75}>
                  {data.orderStatusDist.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Profitability Trend (%)">
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.profitTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="gross" stroke="#059669" strokeWidth={2} />
                <Line type="monotone" dataKey="net" stroke="#2563eb" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Receivable Ageing">
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.receivableAgeing}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${v / 1000}k`} />
                <Tooltip formatter={(v) => formatCurrency(v)} />
                <Bar dataKey="value" fill="#d97706" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Courier Exceptions">
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.courierExceptionsChart}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="value" fill="#dc2626" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      <div className="mb-5 grid gap-4 lg:grid-cols-2">
        <ChartCard title="Top Selling SKUs">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="text-[11px] uppercase text-slate-500">
                <tr><th className="py-1 text-left">SKU</th><th className="text-left">Product</th><th className="text-right">Units</th><th className="text-right">Revenue</th></tr>
              </thead>
              <tbody className="divide-y divide-border">
                {data.topSkus.map((r) => (
                  <tr key={r.sku}>
                    <td className="py-2"><Link to={`/products/${r.sku}`} className="text-accent hover:underline">{r.sku}</Link></td>
                    <td>{r.name}</td>
                    <td className="text-right tabular-nums">{r.units}</td>
                    <td className="text-right tabular-nums">{formatCurrency(r.revenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ChartCard>
        <ChartCard title="Low Stock SKUs">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="text-[11px] uppercase text-slate-500">
                <tr><th className="py-1 text-left">SKU</th><th className="text-left">Product</th><th className="text-right">Free</th><th className="text-right">Reorder</th></tr>
              </thead>
              <tbody className="divide-y divide-border">
                {data.lowStock.map((r) => (
                  <tr key={r.sku}>
                    <td className="py-2"><Link to={`/products/${r.sku}`} className="text-accent hover:underline">{r.sku}</Link></td>
                    <td>{r.name}</td>
                    <td className="text-right tabular-nums">{r.free}</td>
                    <td className="text-right tabular-nums">{r.reorder}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ChartCard>
      </div>

      <ChartCard title="Critical Attention">
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
          {data.criticalAttention.map((item) => (
            <Link
              key={item.id}
              to={item.link}
              className="flex items-start gap-2 rounded-md border border-border p-3 hover:border-accent/40 hover:bg-slate-50"
            >
              <AlertTriangle size={16} className={item.severity === 'Critical' ? 'text-danger' : item.severity === 'High' ? 'text-warning' : 'text-accent'} />
              <div>
                <p className="text-sm font-medium text-navy-900">{item.title}</p>
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-lg font-semibold tabular-nums">{item.count}</span>
                  <StatusBadge status={item.severity} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </ChartCard>
    </div>
  );
}
