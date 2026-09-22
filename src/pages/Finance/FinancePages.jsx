import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';
import PageHeader, { ChartCard, KpiCard } from '../../components/common/PageHeader';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import Modal from '../../components/common/Modal';
import { FilterBar, SelectFilter } from '../../components/common/SearchInput';
import { useDemo } from '../../context/DemoContext';
import { calcProfit, formatCurrency, formatDate, formatPercent, ageingBucket, downloadCsv } from '../../utils/format';

export function ReceivablesPage() {
  const { state, setState, toast } = useDemo();
  const [payOpen, setPayOpen] = useState(null);
  const [amount, setAmount] = useState('');

  return (
    <div>
      <PageHeader title="Receivables" subtitle="B2B outstanding invoices" breadcrumbs={[{ label: 'Finance' }, { label: 'Receivables' }]} />
      <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-5">
        {['Current', '1-30', '31-60', '61-90', '90+'].map((b) => {
          const sum = state.receivables.filter((r) => r.outstanding > 0 && ageingBucket(r.dueDate) === b).reduce((s, r) => s + r.outstanding, 0);
          return <KpiCard key={b} label={b} value={formatCurrency(sum)} accent={b === '90+' || b === '61-90' ? 'red' : 'amber'} />;
        })}
      </div>
      <DataTable columns={[
        { key: 'invoice', label: 'Invoice' }, { key: 'customer', label: 'Customer' },
        { key: 'country', label: 'Country' }, { key: 'currency', label: 'CCY' },
        { key: 'invoiceAmount', label: 'Amount', render: (r) => formatCurrency(r.invoiceAmount) },
        { key: 'paid', label: 'Paid', render: (r) => formatCurrency(r.paid) },
        { key: 'outstanding', label: 'Outstanding', render: (r) => formatCurrency(r.outstanding) },
        { key: 'invoiceDate', label: 'Invoice Date', render: (r) => formatDate(r.invoiceDate) },
        { key: 'dueDate', label: 'Due', render: (r) => formatDate(r.dueDate) },
        { key: 'ageing', label: 'Ageing', render: (r) => ageingBucket(r.dueDate) },
        { key: 'status', label: 'Status', render: (r) => <StatusBadge status={r.status} /> },
        {
          key: 'action', label: 'Action', render: (r) => r.outstanding > 0 ? (
            <button type="button" className="btn-primary text-xs" onClick={() => { setPayOpen(r); setAmount(String(r.outstanding)); }}>Record Payment</button>
          ) : null,
        },
      ]} rows={state.receivables} compact />

      <Modal open={!!payOpen} onClose={() => setPayOpen(null)} title="Record Payment" footer={
        <>
          <button type="button" className="btn-secondary" onClick={() => setPayOpen(null)}>Cancel</button>
          <button type="button" className="btn-primary" onClick={() => {
            const paidAmt = Number(amount);
            setState((prev) => ({
              ...prev,
              receivables: prev.receivables.map((r) => {
                if (r.id !== payOpen.id) return r;
                const paid = r.paid + paidAmt;
                const outstanding = Math.max(0, r.invoiceAmount - paid);
                return {
                  ...r,
                  paid,
                  outstanding,
                  status: outstanding === 0 ? 'Paid' : 'Partially Paid',
                  paymentReference: `PAY-${Date.now()}`,
                  bankReference: `BNK-${Date.now()}`,
                };
              }),
              payments: [{ id: `PAY-${Date.now()}`, invoice: payOpen.invoice, amount: paidAmt, date: new Date().toISOString().slice(0, 10), method: 'Wire', reference: `BNK-${Date.now()}` }, ...prev.payments],
            }));
            toast('Payment recorded');
            setPayOpen(null);
          }}>Record Payment</button>
        </>
      }>
        <p className="mb-2 text-sm">Invoice <strong>{payOpen?.invoice}</strong> · Outstanding {formatCurrency(payOpen?.outstanding)}</p>
        <label className="label-field">Payment Amount</label>
        <input type="number" className="input-field" value={amount} onChange={(e) => setAmount(e.target.value)} />
      </Modal>
    </div>
  );
}

export function PaymentsPage() {
  const { state } = useDemo();
  return (
    <div>
      <PageHeader title="Payments" breadcrumbs={[{ label: 'Finance' }, { label: 'Payments' }]} />
      <DataTable columns={[
        { key: 'id', label: 'Payment ID' }, { key: 'invoice', label: 'Invoice' },
        { key: 'amount', label: 'Amount', render: (r) => formatCurrency(r.amount) },
        { key: 'date', label: 'Date', render: (r) => formatDate(r.date) },
        { key: 'method', label: 'Method' }, { key: 'reference', label: 'Bank Reference' },
      ]} rows={state.payments} />
    </div>
  );
}

export function CourierAuditPage() {
  const { state, toast } = useDemo();
  const expected = state.courierAuditLines.reduce((s, r) => s + r.expectedCharge, 0);
  const billed = state.courierAuditLines.reduce((s, r) => s + r.billedCharge, 0);
  const variance = billed - expected;
  const disputed = state.courierAuditLines.filter((r) => r.disputeStatus === 'Open' || r.disputeStatus === 'Submitted').length;
  const recovered = state.courierAuditLines.filter((r) => r.disputeStatus === 'Recovered').reduce((s, r) => s + r.variance, 0);

  return (
    <div>
      <PageHeader title="Courier Invoice Audit" subtitle="Weight, rate and duplicate AWB exceptions" breadcrumbs={[{ label: 'Finance' }, { label: 'Courier Audit' }]}
        actions={<button type="button" className="btn-secondary" onClick={() => toast('CSV / Excel import simulated')}>Import CSV / Excel</button>}
      />
      <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-6">
        <KpiCard label="Invoices" value={state.courierInvoices.length} />
        <KpiCard label="Expected" value={formatCurrency(expected)} accent="blue" />
        <KpiCard label="Billed" value={formatCurrency(billed)} accent="amber" />
        <KpiCard label="Variance" value={formatCurrency(variance)} accent="red" />
        <KpiCard label="Disputed" value={disputed} accent="red" />
        <KpiCard label="Recovered" value={formatCurrency(recovered)} accent="green" />
      </div>
      <h3 className="mb-2 text-sm font-semibold">Invoices</h3>
      <DataTable columns={[
        { key: 'invoiceNumber', label: 'Invoice #' }, { key: 'courier', label: 'Courier' },
        { key: 'invoiceDate', label: 'Date', render: (r) => formatDate(r.invoiceDate) },
        { key: 'amount', label: 'Amount', render: (r) => formatCurrency(r.amount) },
        { key: 'awbs', label: 'AWBs' },
        { key: 'status', label: 'Status', render: (r) => <StatusBadge status={r.status} /> },
      ]} rows={state.courierInvoices} />
      <h3 className="mb-2 mt-5 text-sm font-semibold">Audit Detail</h3>
      <DataTable columns={[
        { key: 'awb', label: 'AWB' },
        { key: 'systemWeight', label: 'Sys Wt' }, { key: 'billedWeight', label: 'Billed Wt', render: (r) => <span className={r.billedWeight > r.systemWeight ? 'text-danger font-medium' : ''}>{r.billedWeight}</span> },
        { key: 'systemRate', label: 'Sys Rate' }, { key: 'billedRate', label: 'Billed Rate', render: (r) => <span className={r.billedRate > r.systemRate ? 'text-danger font-medium' : ''}>{r.billedRate}</span> },
        { key: 'expectedCharge', label: 'Expected', render: (r) => formatCurrency(r.expectedCharge) },
        { key: 'billedCharge', label: 'Billed', render: (r) => formatCurrency(r.billedCharge) },
        { key: 'variance', label: 'Variance', render: (r) => <span className={r.variance > 0 ? 'text-danger font-medium' : ''}>{formatCurrency(r.variance)}</span> },
        { key: 'duplicate', label: 'Duplicate', render: (r) => r.duplicate ? <StatusBadge status="Duplicate" color="red" /> : '—' },
        { key: 'disputeStatus', label: 'Dispute', render: (r) => <StatusBadge status={r.disputeStatus} /> },
      ]} rows={state.courierAuditLines} compact />
    </div>
  );
}

export function CostingPage() {
  const { state } = useDemo();
  const order = state.orders.find((o) => o.id === '1001');
  const costs = order?.actualCostsReady ? order.costs : order?.estimatedCosts;
  const { totalCost, profit, margin } = calcProfit(order?.sellingPrice, costs || {});

  return (
    <div>
      <PageHeader title="True Cost Calculation" subtitle="Estimated vs actual cost for orders" breadcrumbs={[{ label: 'Finance' }, { label: 'Costing' }]} />
      {order && (
        <div className="mb-5 rounded-lg border border-border bg-panel p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="text-base font-semibold">Order #1001 — Hand Knotted Wool Rug</h3>
              <p className="text-sm text-slate-500">Selling Revenue {formatCurrency(order.sellingPrice)}</p>
            </div>
            <StatusBadge status={order.actualCostsReady ? 'Actual Cost Applied' : 'Estimated Cost'} />
          </div>
          <div className="mt-4 grid gap-6 lg:grid-cols-2">
            <dl className="space-y-1 text-sm">
              <div className="flex justify-between font-semibold"><dt>Revenue</dt><dd>{formatCurrency(20000)}</dd></div>
              {Object.entries(order.costs).filter(([, v]) => v).map(([k, v]) => (
                <div key={k} className="flex justify-between text-slate-600"><dt className="capitalize">{k.replace(/([A-Z])/g, ' $1')}</dt><dd>{formatCurrency(v)}</dd></div>
              ))}
              <div className="flex justify-between border-t border-border pt-2 font-semibold"><dt>Total Cost</dt><dd>{formatCurrency(13650)}</dd></div>
              <div className="flex justify-between text-emerald-700 font-semibold"><dt>Gross Profit</dt><dd>{formatCurrency(6350)}</dd></div>
              <div className="flex justify-between"><dt>Margin</dt><dd>31.75%</dd></div>
            </dl>
            <div className="rounded-md bg-slate-50 p-4 text-sm">
              <p className="font-semibold">Estimated vs Actual</p>
              <p className="mt-2">When actual cost exists, it replaces the estimate visually.</p>
              <p className="mt-3">Current mode: <strong>{order.actualCostsReady ? 'Actual' : 'Estimated'}</strong></p>
              <p className="mt-1">Computed total: {formatCurrency(totalCost)} · Profit {formatCurrency(profit)} ({formatPercent(margin)})</p>
              <Link to="/orders/1001" className="btn-primary mt-4 inline-flex">Open Order Workflow</Link>
            </div>
          </div>
        </div>
      )}
      <DataTable columns={[
        { key: 'orderNumber', label: 'Order', render: (r) => <Link to={`/orders/${r.id}`} className="text-accent hover:underline">{r.orderNumber}</Link> },
        { key: 'sellingPrice', label: 'Revenue', render: (r) => formatCurrency(r.sellingPrice) },
        { key: 'cost', label: 'Total Cost', render: (r) => { const c = calcProfit(r.sellingPrice, r.costs || {}); return formatCurrency(c.totalCost); } },
        { key: 'profit', label: 'Profit', render: (r) => formatCurrency(r.profit ?? calcProfit(r.sellingPrice, r.costs || {}).profit) },
        { key: 'mode', label: 'Cost Mode', render: (r) => r.actualCostsReady ? 'Actual' : 'Estimated' },
      ]} rows={state.orders.filter((o) => o.costs && Object.keys(o.costs).length)} />
    </div>
  );
}

export function ProfitabilityPage() {
  const { state } = useDemo();
  const [marketplace, setMarketplace] = useState('');
  const [country, setCountry] = useState('');

  const rows = useMemo(() => {
    return state.orders
      .filter((o) => o.costs && Object.keys(o.costs).length)
      .filter((o) => !marketplace || o.marketplace === marketplace)
      .filter((o) => !country || o.country === country)
      .map((o) => {
        const c = calcProfit(o.sellingPrice, o.costs);
        return {
          ...o,
          revenue: o.sellingPrice,
          cogs: o.costs.manufacturing || 0,
          packing: o.costs.packing || 0,
          freight: (o.costs.indiaFreight || 0) + (o.costs.landedFreight || 0),
          courier: o.costs.courier || 0,
          fees: o.costs.marketplaceFee || 0,
          warehouse: o.costs.warehouse || 0,
          returns: o.costs.returnRefund || 0,
          claims: o.costs.claimLoss || 0,
          totalCost: c.totalCost,
          profitCalc: o.profit ?? c.profit,
          marginCalc: o.margin ?? c.margin,
        };
      });
  }, [state.orders, marketplace, country]);

  const byMarketplace = useMemo(() => {
    const map = {};
    rows.forEach((r) => {
      map[r.marketplace] = map[r.marketplace] || { name: r.marketplace, revenue: 0, profit: 0 };
      map[r.marketplace].revenue += r.revenue;
      map[r.marketplace].profit += r.profitCalc;
    });
    return Object.values(map);
  }, [rows]);

  const topSkus = useMemo(() => {
    const map = {};
    rows.forEach((r) => {
      if (!r.sku) return;
      map[r.sku] = map[r.sku] || { sku: r.sku, product: r.product, profit: 0, revenue: 0 };
      map[r.sku].profit += r.profitCalc;
      map[r.sku].revenue += r.revenue;
    });
    return Object.values(map).sort((a, b) => b.profit - a.profit).slice(0, 5);
  }, [rows]);

  return (
    <div>
      <PageHeader title="Profitability" subtitle="Order · SKU · Marketplace · Country dimensions" breadcrumbs={[{ label: 'Finance' }, { label: 'Profitability' }]} />
      <FilterBar>
        <SelectFilter label="Marketplace" value={marketplace} onChange={setMarketplace} options={['Amazon', 'Etsy', 'Walmart']} />
        <SelectFilter label="Country" value={country} onChange={setCountry} options={['USA', 'Canada', 'UK', 'Germany', 'Australia']} />
      </FilterBar>
      <div className="mb-4 grid gap-4 lg:grid-cols-2">
        <ChartCard title="Channel Profitability">
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byMarketplace}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v) => formatCurrency(v)} />
                <Legend />
                <Bar dataKey="revenue" fill="#2563eb" name="Revenue" />
                <Bar dataKey="profit" fill="#059669" name="Profit" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
        <ChartCard title="Top Profitable SKUs">
          <ul className="space-y-2 text-sm">
            {topSkus.map((s) => (
              <li key={s.sku} className="flex justify-between border-b border-border pb-1">
                <span>{s.sku} · {s.product}</span>
                <span className="font-medium text-emerald-700">{formatCurrency(s.profit)}</span>
              </li>
            ))}
          </ul>
        </ChartCard>
      </div>
      <h3 className="mb-2 text-sm font-semibold">Low-Margin / All Orders</h3>
      <DataTable columns={[
        { key: 'orderNumber', label: 'Order' }, { key: 'sku', label: 'SKU' },
        { key: 'marketplace', label: 'Marketplace' }, { key: 'country', label: 'Country' },
        { key: 'revenue', label: 'Revenue', render: (r) => formatCurrency(r.revenue) },
        { key: 'cogs', label: 'COGS', render: (r) => formatCurrency(r.cogs) },
        { key: 'packing', label: 'Packing', render: (r) => formatCurrency(r.packing) },
        { key: 'freight', label: 'Freight', render: (r) => formatCurrency(r.freight) },
        { key: 'courier', label: 'Courier', render: (r) => formatCurrency(r.courier) },
        { key: 'fees', label: 'Fees', render: (r) => formatCurrency(r.fees) },
        { key: 'warehouse', label: 'WH', render: (r) => formatCurrency(r.warehouse) },
        { key: 'totalCost', label: 'Total Cost', render: (r) => formatCurrency(r.totalCost) },
        { key: 'profitCalc', label: 'Profit', render: (r) => <span className={r.profitCalc < 0 ? 'text-danger' : 'text-emerald-700'}>{formatCurrency(r.profitCalc)}</span> },
        { key: 'marginCalc', label: 'Margin', render: (r) => formatPercent(r.marginCalc) },
      ]} rows={rows.sort((a, b) => a.marginCalc - b.marginCalc)} compact />
    </div>
  );
}
