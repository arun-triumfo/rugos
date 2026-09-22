import { useState } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import Modal from '../../components/common/Modal';
import { useDemo } from '../../context/DemoContext';
import { formatDate } from '../../utils/format';

const MTO_STAGES = ['To Make', 'Production', 'QC Ready', 'Pack'];

export function MtoPage() {
  const { state, setState, toast } = useDemo();
  const [view, setView] = useState('kanban');

  const advance = (id) => {
    setState((prev) => ({
      ...prev,
      mto: prev.mto.map((m) => {
        if (m.id !== id) return m;
        const idx = MTO_STAGES.indexOf(m.stage);
        const next = MTO_STAGES[Math.min(idx + 1, MTO_STAGES.length - 1)];
        return { ...m, stage: next, pendingQty: next === 'Pack' || next === 'QC Ready' ? 0 : m.pendingQty };
      }),
    }));
    toast('MTO stage advanced');
  };

  return (
    <div>
      <PageHeader
        title="MTO / Production"
        subtitle="Made-to-order workflow"
        breadcrumbs={[{ label: 'Warehouse' }, { label: 'MTO' }]}
        actions={
          <div className="flex gap-1">
            <button type="button" className={view === 'kanban' ? 'btn-primary' : 'btn-secondary'} onClick={() => setView('kanban')}>Kanban</button>
            <button type="button" className={view === 'table' ? 'btn-primary' : 'btn-secondary'} onClick={() => setView('table')}>Table</button>
          </div>
        }
      />
      {view === 'kanban' ? (
        <div className="grid gap-3 md:grid-cols-4">
          {MTO_STAGES.map((stage) => (
            <div key={stage} className="rounded-lg border border-border bg-slate-50 p-2">
              <p className="mb-2 px-1 text-xs font-semibold uppercase text-slate-500">{stage}</p>
              <div className="space-y-2">
                {state.mto.filter((m) => m.stage === stage).map((m) => (
                  <div key={m.id} className="rounded-md border border-border bg-white p-3 shadow-sm">
                    <p className="text-sm font-semibold">{m.id}</p>
                    <p className="text-xs text-slate-500">{m.sku} · Qty {m.qty}</p>
                    <p className="text-xs">{m.product}</p>
                    <p className="mt-1 text-[11px] text-slate-400">Ready {formatDate(m.expectedReady)}</p>
                    {stage !== 'Pack' && (
                      <button type="button" className="btn-primary mt-2 w-full justify-center text-xs" onClick={() => advance(m.id)}>Advance Stage</button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <DataTable columns={[
          { key: 'id', label: 'MTO #' }, { key: 'order', label: 'Order' }, { key: 'sku', label: 'SKU' },
          { key: 'product', label: 'Product' }, { key: 'qty', label: 'Qty' }, { key: 'customer', label: 'Customer' },
          { key: 'expectedReady', label: 'Expected', render: (r) => formatDate(r.expectedReady) },
          { key: 'stage', label: 'Stage', render: (r) => <StatusBadge status={r.stage} /> },
          { key: 'pendingQty', label: 'Pending' }, { key: 'notes', label: 'Notes' },
        ]} rows={state.mto} />
      )}
    </div>
  );
}

export function PickPackPage() {
  const { state, setState, toast, advanceWorkflow } = useDemo();
  const [scan, setScan] = useState('');

  const updateTask = (id, patch) => {
    setState((prev) => ({
      ...prev,
      pickPack: prev.pickPack.map((p) => (p.id === id ? { ...p, ...patch } : p)),
    }));
  };

  return (
    <div>
      <PageHeader title="Pick & Pack" subtitle="Warehouse fulfilment tasks" breadcrumbs={[{ label: 'Warehouse' }, { label: 'Pick & Pack' }]} />
      <div className="mb-4 flex flex-wrap items-end gap-2 rounded-lg border border-border bg-panel p-3">
        <div className="flex-1">
          <label className="label-field">Scan Barcode (simulation)</label>
          <input className="input-field" value={scan} onChange={(e) => setScan(e.target.value)} placeholder="Enter or paste barcode…" />
        </div>
        <button type="button" className="btn-primary" onClick={() => {
          const task = state.pickPack.find((p) => p.barcode === scan || p.order.replace('#', '') === scan);
          if (task) { toast(`Scanned ${task.order} · ${task.sku}`); setScan(''); }
          else toast('Barcode not found', 'error');
        }}>Scan Barcode</button>
      </div>
      <DataTable columns={[
        { key: 'order', label: 'Order', render: (r) => <Link to={`/orders/${r.order.replace('#', '')}`} className="text-accent hover:underline">{r.order}</Link> },
        { key: 'sku', label: 'SKU' }, { key: 'product', label: 'Product' }, { key: 'bin', label: 'Bin' },
        { key: 'orderedQty', label: 'Ordered' }, { key: 'pickQty', label: 'Pick Qty' }, { key: 'packedQty', label: 'Packed' },
        { key: 'barcode', label: 'Barcode' }, { key: 'operator', label: 'Operator' },
        { key: 'status', label: 'Status', render: (r) => <StatusBadge status={r.status} /> },
        {
          key: 'actions', label: 'Actions', render: (r) => (
            <div className="flex flex-wrap gap-1">
              {r.status === 'Awaiting Pick' && <button type="button" className="btn-primary text-xs" onClick={() => { updateTask(r.id, { status: 'Picking', operator: 'Amit Singh' }); if (r.order === '#1001') advanceWorkflow('startPicking'); toast('Picking started'); }}>Start Pick</button>}
              {r.status === 'Picking' && <button type="button" className="btn-success text-xs" onClick={() => { updateTask(r.id, { status: 'Picked', pickQty: r.orderedQty }); if (r.order === '#1001') advanceWorkflow('markPicked'); toast('Pick confirmed'); }}>Confirm Pick</button>}
              {r.status === 'Picked' && <button type="button" className="btn-primary text-xs" onClick={() => { updateTask(r.id, { status: 'Packing' }); toast('Packing started'); }}>Start Packing</button>}
              {r.status === 'Packing' && <button type="button" className="btn-success text-xs" onClick={() => { updateTask(r.id, { status: 'Packed', packedQty: r.orderedQty }); if (r.order === '#1001') advanceWorkflow('markPacked'); toast('Packing completed'); }}>Complete Packing</button>}
            </div>
          ),
        },
      ]} rows={state.pickPack} compact />
    </div>
  );
}

export function PackingQueuePage() {
  const { state, toast, setState } = useDemo();
  const [proofOpen, setProofOpen] = useState(null);
  const [preview, setPreview] = useState(null);

  return (
    <div>
      <PageHeader title="Packing Queue" breadcrumbs={[{ label: 'Warehouse' }, { label: 'Packing' }]} />
      <DataTable columns={[
        { key: 'order', label: 'Order' }, { key: 'sku', label: 'SKU' },
        { key: 'status', label: 'Status', render: (r) => <StatusBadge status={r.status} /> },
        { key: 'cartons', label: 'Cartons' }, { key: 'proof', label: 'Proof', render: (r) => r.proof || '—' },
        {
          key: 'actions', label: 'Actions', render: (r) => (
            <div className="flex gap-1">
              <button type="button" className="btn-secondary text-xs" onClick={() => {
                setState((prev) => ({ ...prev, packingQueue: prev.packingQueue.map((p) => p.id === r.id ? { ...p, cartons: p.cartons + 1 } : p) }));
                toast('Carton added');
              }}>Add Carton</button>
              <button type="button" className="btn-primary text-xs" onClick={() => setProofOpen(r)}>Upload Packing Proof</button>
            </div>
          ),
        },
      ]} rows={state.packingQueue} />

      <Modal open={!!proofOpen} onClose={() => setProofOpen(null)} title="Upload Packing Proof" footer={
        <>
          <button type="button" className="btn-secondary" onClick={() => setProofOpen(null)}>Cancel</button>
          <button type="button" className="btn-primary" onClick={() => {
            setState((prev) => ({
              ...prev,
              packingQueue: prev.packingQueue.map((p) => p.id === proofOpen.id ? { ...p, proof: preview?.name || 'packing-proof.jpg', status: 'Ready for Dispatch' } : p),
            }));
            toast('Packing proof uploaded (browser preview only)');
            setProofOpen(null);
            setPreview(null);
          }}>Save Proof</button>
        </>
      }>
        <p className="mb-2 text-xs text-slate-500">Browser file preview only — nothing is uploaded to a server.</p>
        <input type="file" accept="image/*" onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) setPreview({ name: f.name, url: URL.createObjectURL(f) });
        }} />
        {preview && <img src={preview.url} alt="Proof preview" className="mt-3 max-h-48 rounded border border-border" />}
      </Modal>
    </div>
  );
}

export function DispatchPage() {
  const { state, toast, advanceWorkflow, setState } = useDemo();
  const ready = state.orders.filter((o) => ['Packed', 'Ready for Dispatch'].includes(o.status));

  return (
    <div>
      <PageHeader title="India Dispatch" subtitle="Orders ready to leave India warehouse" breadcrumbs={[{ label: 'Warehouse' }, { label: 'Dispatch' }]} />
      <DataTable columns={[
        { key: 'orderNumber', label: 'Order', render: (r) => <Link to={`/orders/${r.id}`} className="text-accent hover:underline">{r.orderNumber}</Link> },
        { key: 'sku', label: 'SKU' }, { key: 'product', label: 'Product' },
        { key: 'awb', label: 'AWB', render: (r) => r.awb || '—' },
        { key: 'status', label: 'Status', render: (r) => <StatusBadge status={r.status} /> },
        {
          key: 'action', label: 'Action', render: (r) => (
            <button type="button" className="btn-primary text-xs" onClick={() => {
              if (r.id === '1001') {
                advanceWorkflow('dispatchIndia');
                setTimeout(() => advanceWorkflow('markInTransit'), 100);
              } else {
                setState((prev) => ({
                  ...prev,
                  orders: prev.orders.map((o) => o.id === r.id ? { ...o, status: 'Dispatched', shipmentStatus: 'Dispatched', inventoryStatus: 'In Transit' } : o),
                }));
              }
              toast(`${r.orderNumber} dispatched from India`);
            }}>Dispatch from India</button>
          ),
        },
      ]} rows={ready} emptyMessage="No orders ready for dispatch" />
    </div>
  );
}

export function UsaReceiptsPage() {
  const { state, toast, advanceWorkflow, setState } = useDemo();

  return (
    <div>
      <PageHeader title="USA Receipts" subtitle="Physical receipt confirmation before USA stock is available" breadcrumbs={[{ label: 'Warehouse' }, { label: 'USA Receipts' }]} />
      <div className="mb-4 rounded-lg border border-violet-200 bg-violet-50 p-3 text-sm text-violet-900">
        USA inventory is NOT available until physical USA receipt is confirmed.
      </div>
      <DataTable columns={[
        { key: 'id', label: 'Receipt ID' },
        { key: 'replenishment', label: 'Reference', render: (r) => r.replenishment || r.order || '—' },
        { key: 'date', label: 'Date', render: (r) => r.date || '—' },
        { key: 'sku', label: 'SKU' },
        { key: 'expected', label: 'Expected' },
        { key: 'received', label: 'Received', render: (r) => r.received ?? '—' },
        { key: 'difference', label: 'Diff', render: (r) => r.difference ?? '—' },
        { key: 'condition', label: 'Condition', render: (r) => r.condition || '—' },
        { key: 'status', label: 'Status', render: (r) => <StatusBadge status={r.status} /> },
        {
          key: 'action', label: 'Action', render: (r) => (
            r.status === 'Pending' || r.status === 'Awaiting Dispatch' ? (
              <div className="flex gap-1">
                <button type="button" className="btn-primary text-xs" onClick={() => {
                  if (r.order === '#1001' || r.id === 'RCP-USA-046') advanceWorkflow('confirmUsaReceipt', { receivedQty: 1, condition: 'Good' });
                  else setState((prev) => ({
                    ...prev,
                    usaReceipts: prev.usaReceipts.map((x) => x.id === r.id ? { ...x, received: x.expected, difference: 0, condition: 'Good', status: 'Matched', date: new Date().toISOString().slice(0, 10) } : x),
                  }));
                  toast('USA receipt confirmed');
                }}>Confirm Receipt</button>
                <button type="button" className="btn-secondary text-xs" onClick={() => toast('Discrepancy created (demo)')}>Create Discrepancy</button>
              </div>
            ) : r.status === 'Short' ? (
              <button type="button" className="btn-secondary text-xs" onClick={() => toast('Discrepancy claim linked')}>Create Discrepancy</button>
            ) : null
          ),
        },
      ]} rows={state.usaReceipts} />
    </div>
  );
}

export function LocationsPage() {
  const { state } = useDemo();
  return (
    <div>
      <PageHeader title="Warehouse Locations" breadcrumbs={[{ label: 'Warehouse' }, { label: 'Locations' }]} />
      <DataTable columns={[
        { key: 'location', label: 'Location' }, { key: 'warehouse', label: 'Warehouse' },
        { key: 'skus', label: 'SKUs', render: (r) => r.skus.join(', ') },
        { key: 'occupied', label: 'Occupied' }, { key: 'capacity', label: 'Capacity' },
        { key: 'util', label: 'Utilization', render: (r) => `${Math.round((r.occupied / r.capacity) * 100)}%` },
      ]} rows={state.locations} />
    </div>
  );
}
