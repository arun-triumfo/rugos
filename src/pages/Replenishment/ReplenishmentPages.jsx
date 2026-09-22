import { Link, useParams } from 'react-router-dom';
import { useState } from 'react';
import PageHeader from '../../components/common/PageHeader';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import { TabNavigation, Timeline } from '../../components/common/Misc';
import Modal from '../../components/common/Modal';
import { useDemo } from '../../context/DemoContext';
import { formatCurrency, formatDate } from '../../utils/format';

export function ReplenishmentListPage() {
  const { state } = useDemo();
  return (
    <div>
      <PageHeader title="India → USA Shipments" subtitle="Replenishment consignments" breadcrumbs={[{ label: 'Replenishment' }, { label: 'Shipments' }]} />
      <DataTable columns={[
        { key: 'id', label: 'ID', render: (r) => <Link to={`/replenishment/${r.id}`} className="text-accent font-medium hover:underline">{r.id}</Link> },
        { key: 'createdDate', label: 'Created', render: (r) => formatDate(r.createdDate) },
        { key: 'indiaWarehouse', label: 'India WH' }, { key: 'usaWarehouse', label: 'USA WH' },
        { key: 'totalUnits', label: 'Units' }, { key: 'cartons', label: 'Cartons' },
        { key: 'grossWeight', label: 'Weight (kg)' },
        { key: 'freightCost', label: 'Freight', render: (r) => formatCurrency(r.freightCost) },
        { key: 'etd', label: 'ETD', render: (r) => formatDate(r.etd) },
        { key: 'eta', label: 'ETA', render: (r) => formatDate(r.eta) },
        { key: 'status', label: 'Status', render: (r) => <StatusBadge status={r.status} /> },
      ]} rows={state.replenishments} />
    </div>
  );
}

export function ReplenishmentDetailPage() {
  const { id } = useParams();
  const { state } = useDemo();
  const item = state.replenishments.find((r) => r.id === id);
  const [tab, setTab] = useState('items');
  if (!item) return <PageHeader title="Not found" />;

  return (
    <div>
      <PageHeader title={item.id} subtitle={`${item.indiaWarehouse} → ${item.usaWarehouse}`} badge={<StatusBadge status={item.status} />} breadcrumbs={[{ label: 'Replenishment' }, { label: 'Shipments', to: '/replenishment' }, { label: item.id }]} />
      <TabNavigation tabs={[
        { id: 'items', label: 'Items' }, { id: 'packing', label: 'Packing' }, { id: 'freight', label: 'Freight' },
        { id: 'documents', label: 'Documents' }, { id: 'dispatch', label: 'Dispatch' }, { id: 'receipt', label: 'USA Receipt' },
        { id: 'cost', label: 'Cost Allocation' }, { id: 'timeline', label: 'Timeline' },
      ]} active={tab} onChange={setTab} />
      {tab === 'items' && (
        <DataTable columns={[
          { key: 'sku', label: 'SKU' }, { key: 'product', label: 'Product' }, { key: 'qty', label: 'Qty' },
        ]} rows={item.skus} />
      )}
      {tab === 'packing' && <div className="rounded-lg border border-border bg-panel p-4 text-sm"><p>Cartons: {item.cartons}</p><p>Gross Weight: {item.grossWeight} kg</p></div>}
      {tab === 'freight' && <div className="rounded-lg border border-border bg-panel p-4 text-sm"><p>Freight Cost: {formatCurrency(item.freightCost)}</p><p>ETD: {formatDate(item.etd)}</p><p>ETA: {formatDate(item.eta)}</p></div>}
      {tab === 'documents' && (
        <div className="grid gap-2 sm:grid-cols-3">
          {state.exportDocuments.filter((d) => d.shipment === item.id).map((d) => (
            <div key={d.id} className="rounded-lg border border-border bg-panel p-3 text-sm"><p className="font-medium">{d.type}</p><p className="text-xs text-slate-500">{d.documentNumber}</p><StatusBadge status={d.status} className="mt-1" /></div>
          ))}
        </div>
      )}
      {tab === 'dispatch' && <p className="text-sm">Status: {item.status}. Dispatch recorded when status reaches Dispatched India.</p>}
      {tab === 'receipt' && (
        <DataTable columns={[
          { key: 'id', label: 'Receipt' }, { key: 'sku', label: 'SKU' }, { key: 'expected', label: 'Expected' },
          { key: 'received', label: 'Received' }, { key: 'status', label: 'Status', render: (r) => <StatusBadge status={r.status} /> },
        ]} rows={state.usaReceipts.filter((r) => r.replenishment === item.id)} />
      )}
      {tab === 'cost' && <p className="text-sm">Freight {formatCurrency(item.freightCost)} allocated across {item.totalUnits} units ≈ {formatCurrency(item.freightCost / item.totalUnits)} per unit.</p>}
      {tab === 'timeline' && <Timeline items={(item.timeline || []).map((t, i) => ({ ...t, id: i, status: 'done' }))} />}
    </div>
  );
}

export function ReplenishmentPlanningPage() {
  const { state, setState, toast } = useDemo();
  return (
    <div>
      <PageHeader title="Replenishment Planning" subtitle="Draft and approve India → USA moves" breadcrumbs={[{ label: 'Replenishment' }, { label: 'Planning' }]}
        actions={<button type="button" className="btn-primary" onClick={() => {
          setState((prev) => ({
            ...prev,
            replenishments: [{
              id: `REP-2026-00${prev.replenishments.length + 1}`,
              createdDate: new Date().toISOString().slice(0, 10),
              indiaWarehouse: 'India Main Warehouse',
              usaWarehouse: 'USA East Warehouse',
              skus: [{ sku: 'RUG-1013', product: 'Moroccan Trellis Rug', qty: 10 }],
              totalUnits: 10, cartons: 5, grossWeight: 80, freightCost: 45000, etd: null, eta: null, status: 'Draft',
              timeline: [{ at: new Date().toISOString().slice(0, 10), title: 'Draft created' }],
            }, ...prev.replenishments],
          }));
          toast('Draft replenishment created');
        }}>Create Draft</button>}
      />
      <DataTable columns={[
        { key: 'id', label: 'ID', render: (r) => <Link to={`/replenishment/${r.id}`} className="text-accent hover:underline">{r.id}</Link> },
        { key: 'status', label: 'Status', render: (r) => <StatusBadge status={r.status} /> },
        { key: 'totalUnits', label: 'Units' }, { key: 'usaWarehouse', label: 'Destination' },
        {
          key: 'action', label: 'Action', render: (r) => r.status === 'Draft' ? (
            <button type="button" className="btn-primary text-xs" onClick={() => {
              setState((prev) => ({ ...prev, replenishments: prev.replenishments.map((x) => x.id === r.id ? { ...x, status: 'Approved' } : x) }));
              toast(`${r.id} approved`);
            }}>Approve</button>
          ) : null,
        },
      ]} rows={state.replenishments} />
    </div>
  );
}

export function InTransitPage() {
  const { state } = useDemo();
  const rows = [
    ...state.shipments.filter((s) => s.status === 'In Transit'),
    ...state.replenishments.filter((r) => r.status === 'In Transit').map((r) => ({
      id: r.id, order: 'Replenishment', courier: 'Ocean/Air Freight', awb: r.id, origin: r.indiaWarehouse,
      destination: r.usaWarehouse, status: 'In Transit', lastUpdate: r.etd,
    })),
  ];
  return (
    <div>
      <PageHeader title="In Transit" breadcrumbs={[{ label: 'Replenishment' }, { label: 'In Transit' }]} />
      <DataTable columns={[
        { key: 'id', label: 'Reference' }, { key: 'order', label: 'Order/Type' },
        { key: 'courier', label: 'Courier' }, { key: 'awb', label: 'AWB' },
        { key: 'origin', label: 'Origin' }, { key: 'destination', label: 'Destination' },
        { key: 'status', label: 'Status', render: (r) => <StatusBadge status={r.status} /> },
      ]} rows={rows} />
    </div>
  );
}

export function ReceiptReconciliationPage() {
  const { state } = useDemo();
  return (
    <div>
      <PageHeader title="Receipt Reconciliation" breadcrumbs={[{ label: 'Replenishment' }, { label: 'Receipt Reconciliation' }]} />
      <DataTable columns={[
        { key: 'id', label: 'Receipt' }, { key: 'replenishment', label: 'Replenishment' },
        { key: 'sku', label: 'SKU' }, { key: 'expected', label: 'Expected' },
        { key: 'received', label: 'Received', render: (r) => r.received ?? '—' },
        { key: 'difference', label: 'Difference', render: (r) => r.difference ?? '—' },
        { key: 'status', label: 'Status', render: (r) => <StatusBadge status={r.status} /> },
      ]} rows={state.usaReceipts.filter((r) => r.replenishment)} />
    </div>
  );
}
