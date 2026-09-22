import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import PageHeader, { KpiCard } from '../../components/common/PageHeader';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import SearchInput, { FilterBar } from '../../components/common/SearchInput';
import Modal from '../../components/common/Modal';
import { useDemo } from '../../context/DemoContext';
import { inventoryHealth, inventoryTotal } from '../../data/mockInventory';
import { formatCurrency, formatDateTime } from '../../utils/format';

export function InventoryOverviewPage() {
  const { state, toast, setState } = useDemo();
  const [q, setQ] = useState('');
  const [transferOpen, setTransferOpen] = useState(false);
  const [adjustOpen, setAdjustOpen] = useState(false);
  const [form, setForm] = useState({ sku: 'RUG-1001', qty: 1, from: 'India Finished Stock', to: 'USA Warehouse', reason: 'Damage' });

  const rows = useMemo(() => state.inventory.filter((r) => !q || `${r.sku} ${r.product}`.toLowerCase().includes(q.toLowerCase())), [state.inventory, q]);
  const rug1001 = state.inventory.find((i) => i.sku === 'RUG-1001');

  const totals = useMemo(() => ({
    skus: state.inventory.length,
    india: state.inventory.reduce((s, r) => s + r.indiaAvailable, 0),
    reserved: state.inventory.reduce((s, r) => s + r.reserved, 0),
    packed: state.inventory.reduce((s, r) => s + r.packed, 0),
    inTransit: state.inventory.reduce((s, r) => s + r.inTransit, 0),
    usa: state.inventory.reduce((s, r) => s + r.usa, 0),
    fba: state.inventory.reduce((s, r) => s + r.fba, 0),
    damaged: state.inventory.reduce((s, r) => s + r.damaged, 0),
  }), [state.inventory]);

  return (
    <div>
      <PageHeader
        title="Inventory Overview"
        subtitle="Multi-location stock across India, transit, USA and FBA"
        breadcrumbs={[{ label: 'Inventory' }, { label: 'Overview' }]}
        actions={
          <>
            <button type="button" className="btn-secondary" onClick={() => setTransferOpen(true)}>Transfer Stock</button>
            <button type="button" className="btn-secondary" onClick={() => setAdjustOpen(true)}>Adjustment</button>
          </>
        }
      />
      <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-8">
        <KpiCard label="Total SKU" value={totals.skus} />
        <KpiCard label="India Available" value={totals.india} accent="blue" />
        <KpiCard label="Reserved" value={totals.reserved} accent="amber" />
        <KpiCard label="Packed" value={totals.packed} accent="green" />
        <KpiCard label="In Transit" value={totals.inTransit} accent="purple" />
        <KpiCard label="USA Available" value={totals.usa} accent="green" />
        <KpiCard label="FBA Available" value={totals.fba} accent="blue" />
        <KpiCard label="Damaged" value={totals.damaged} accent="red" />
      </div>

      {rug1001 && (
        <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-4">
          <p className="text-sm font-semibold text-navy-900">Concurrency / Reservation Demo — RUG-1001</p>
          <div className="mt-2 flex flex-wrap gap-4 text-sm">
            <span>Available: <strong>{rug1001.indiaAvailable}</strong></span>
            <span>Reserved: <strong className="text-amber-700">{rug1001.reserved}</strong></span>
            <span>Free: <strong className="text-emerald-700">{rug1001.indiaAvailable - rug1001.reserved}</strong></span>
          </div>
          <p className="mt-2 text-xs text-slate-600">Reserved inventory cannot be allocated to another active order. This represents future concurrency-safe backend logic.</p>
        </div>
      )}

      <FilterBar><SearchInput value={q} onChange={setQ} className="w-64" /></FilterBar>
      <DataTable
        columns={[
          { key: 'sku', label: 'SKU', render: (r) => <Link to={`/products/${r.sku}`} className="text-accent hover:underline">{r.sku}</Link> },
          { key: 'product', label: 'Product' },
          { key: 'indiaAvailable', label: 'India' },
          { key: 'reserved', label: 'Reserved' },
          { key: 'packed', label: 'Packed' },
          { key: 'inTransit', label: 'In Transit' },
          { key: 'usa', label: 'USA' },
          { key: 'fba', label: 'FBA' },
          { key: 'damaged', label: 'Damaged' },
          { key: 'reorderLevel', label: 'Reorder' },
          { key: 'total', label: 'Total', render: (r) => inventoryTotal(r) },
          { key: 'health', label: 'Health', render: (r) => <StatusBadge status={inventoryHealth(r)} /> },
        ]}
        rows={rows}
        compact
      />

      <Modal open={transferOpen} onClose={() => setTransferOpen(false)} title="Transfer Stock" footer={
        <>
          <button type="button" className="btn-secondary" onClick={() => setTransferOpen(false)}>Cancel</button>
          <button type="button" className="btn-primary" onClick={() => {
            setState((prev) => ({
              ...prev,
              transfers: [{ id: `TRF-${Date.now()}`, date: new Date().toISOString().slice(0, 10), sku: form.sku, qty: Number(form.qty), from: form.from, to: form.to, status: 'Completed', user: 'Demo User' }, ...prev.transfers],
            }));
            toast('Stock transfer recorded');
            setTransferOpen(false);
          }}>Transfer Stock</button>
        </>
      }>
        <div className="space-y-3">
          <div><label className="label-field">SKU</label><input className="input-field" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} /></div>
          <div><label className="label-field">Qty</label><input type="number" className="input-field" value={form.qty} onChange={(e) => setForm({ ...form, qty: e.target.value })} /></div>
          <div><label className="label-field">From</label><input className="input-field" value={form.from} onChange={(e) => setForm({ ...form, from: e.target.value })} /></div>
          <div><label className="label-field">To</label><input className="input-field" value={form.to} onChange={(e) => setForm({ ...form, to: e.target.value })} /></div>
        </div>
      </Modal>

      <Modal open={adjustOpen} onClose={() => setAdjustOpen(false)} title="Stock Adjustment" footer={
        <>
          <button type="button" className="btn-secondary" onClick={() => setAdjustOpen(false)}>Cancel</button>
          <button type="button" className="btn-primary" onClick={() => {
            setState((prev) => ({
              ...prev,
              adjustments: [{ id: `ADJ-${Date.now()}`, date: new Date().toISOString().slice(0, 10), sku: form.sku, qty: -Number(form.qty), reason: form.reason, location: form.from, user: 'Demo User', status: 'Approved' }, ...prev.adjustments],
            }));
            toast('Adjustment recorded');
            setAdjustOpen(false);
          }}>Save Adjustment</button>
        </>
      }>
        <div className="space-y-3">
          <div><label className="label-field">SKU</label><input className="input-field" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} /></div>
          <div><label className="label-field">Qty (absolute)</label><input type="number" className="input-field" value={form.qty} onChange={(e) => setForm({ ...form, qty: e.target.value })} /></div>
          <div><label className="label-field">Reason</label><input className="input-field" value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} /></div>
        </div>
      </Modal>
    </div>
  );
}

export function StockLedgerPage() {
  const { state } = useDemo();
  const [q, setQ] = useState('');
  const rows = state.stockLedger.filter((r) => !q || `${r.sku} ${r.reference}`.toLowerCase().includes(q.toLowerCase()));
  return (
    <div>
      <PageHeader title="Stock Ledger" subtitle="Chronological inventory movements" breadcrumbs={[{ label: 'Inventory' }, { label: 'Stock Ledger' }]} />
      <FilterBar><SearchInput value={q} onChange={setQ} className="w-64" /></FilterBar>
      <DataTable columns={[
        { key: 'date', label: 'Date/Time', render: (r) => formatDateTime(r.date) },
        { key: 'sku', label: 'SKU' }, { key: 'type', label: 'Type' }, { key: 'reference', label: 'Reference' },
        { key: 'from', label: 'From' }, { key: 'to', label: 'To' },
        { key: 'qtyIn', label: 'Qty In' }, { key: 'qtyOut', label: 'Qty Out' }, { key: 'balance', label: 'Balance' },
        { key: 'user', label: 'User' }, { key: 'notes', label: 'Notes' },
      ]} rows={rows} compact />
    </div>
  );
}

export function TransfersPage() {
  const { state } = useDemo();
  return (
    <div>
      <PageHeader title="Inventory Transfers" breadcrumbs={[{ label: 'Inventory' }, { label: 'Transfers' }]} />
      <DataTable columns={[
        { key: 'id', label: 'Transfer ID' }, { key: 'date', label: 'Date' }, { key: 'sku', label: 'SKU' },
        { key: 'qty', label: 'Qty' }, { key: 'from', label: 'From' }, { key: 'to', label: 'To' },
        { key: 'status', label: 'Status', render: (r) => <StatusBadge status={r.status} /> }, { key: 'user', label: 'User' },
      ]} rows={state.transfers} />
    </div>
  );
}

export function AdjustmentsPage() {
  const { state } = useDemo();
  return (
    <div>
      <PageHeader title="Inventory Adjustments" breadcrumbs={[{ label: 'Inventory' }, { label: 'Adjustments' }]} />
      <DataTable columns={[
        { key: 'id', label: 'ID' }, { key: 'date', label: 'Date' }, { key: 'sku', label: 'SKU' },
        { key: 'qty', label: 'Qty' }, { key: 'reason', label: 'Reason' }, { key: 'location', label: 'Location' },
        { key: 'status', label: 'Status', render: (r) => <StatusBadge status={r.status} /> }, { key: 'user', label: 'User' },
      ]} rows={state.adjustments} />
    </div>
  );
}

export function CycleCountPage() {
  const { state } = useDemo();
  return (
    <div>
      <PageHeader title="Cycle Count" breadcrumbs={[{ label: 'Inventory' }, { label: 'Cycle Count' }]} />
      <DataTable columns={[
        { key: 'id', label: 'Count ID' }, { key: 'date', label: 'Date' }, { key: 'warehouse', label: 'Warehouse' },
        { key: 'sku', label: 'SKU' }, { key: 'systemQty', label: 'System' }, { key: 'countedQty', label: 'Counted' },
        { key: 'variance', label: 'Variance' }, { key: 'status', label: 'Status', render: (r) => <StatusBadge status={r.status} /> }, { key: 'user', label: 'User' },
      ]} rows={state.cycleCounts} />
    </div>
  );
}
