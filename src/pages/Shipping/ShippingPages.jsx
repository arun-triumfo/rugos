import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import { TabNavigation, Timeline } from '../../components/common/Misc';
import Modal from '../../components/common/Modal';
import SearchInput, { FilterBar, SelectFilter } from '../../components/common/SearchInput';
import { useDemo } from '../../context/DemoContext';
import { SHIPMENT_STATUSES } from '../../constants';
import { formatCurrency, formatDateTime } from '../../utils/format';

export function ShipmentsPage() {
  const { state } = useDemo();
  const [status, setStatus] = useState('');
  const [q, setQ] = useState('');
  const rows = useMemo(() => state.shipments.filter((s) => {
    if (status && s.status !== status) return false;
    if (q && !`${s.id} ${s.order} ${s.awb || ''}`.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  }), [state.shipments, status, q]);

  return (
    <div>
      <PageHeader title="Shipments" breadcrumbs={[{ label: 'Shipping' }, { label: 'Shipments' }]} />
      <FilterBar>
        <SearchInput value={q} onChange={setQ} className="w-56" />
        <SelectFilter label="Status" value={status} onChange={setStatus} options={SHIPMENT_STATUSES} />
      </FilterBar>
      <DataTable columns={[
        { key: 'id', label: 'Shipment ID', render: (r) => <Link to={`/shipments/${r.id}`} className="text-accent font-medium hover:underline">{r.id}</Link> },
        { key: 'order', label: 'Order' }, { key: 'courier', label: 'Courier', render: (r) => r.courier || '—' },
        { key: 'awb', label: 'AWB', render: (r) => r.awb || '—' },
        { key: 'origin', label: 'Origin' }, { key: 'destination', label: 'Destination' },
        { key: 'weight', label: 'Weight' },
        { key: 'estimatedCost', label: 'Est. Cost', render: (r) => formatCurrency(r.estimatedCost) },
        { key: 'actualCost', label: 'Actual', render: (r) => r.actualCost != null ? formatCurrency(r.actualCost) : '—' },
        { key: 'status', label: 'Status', render: (r) => <StatusBadge status={r.status} /> },
        { key: 'lastUpdate', label: 'Last Update', render: (r) => formatDateTime(r.lastUpdate) },
      ]} rows={rows} compact />
    </div>
  );
}

export function ShipmentDetailPage() {
  const { id } = useParams();
  const { state } = useDemo();
  const shipment = state.shipments.find((s) => s.id === id);
  const [tab, setTab] = useState('overview');
  if (!shipment) return <PageHeader title="Shipment not found" />;

  const variance = shipment.actualCost != null && shipment.estimatedCost != null
    ? shipment.actualCost - shipment.estimatedCost : null;

  return (
    <div>
      <PageHeader title={shipment.id} subtitle={`${shipment.order} · ${shipment.courier || 'Courier pending'}`} badge={<StatusBadge status={shipment.status} />} breadcrumbs={[{ label: 'Shipping' }, { label: 'Shipments', to: '/shipments' }, { label: shipment.id }]} />
      <TabNavigation tabs={[
        { id: 'overview', label: 'Overview' }, { id: 'tracking', label: 'Tracking' }, { id: 'package', label: 'Package' },
        { id: 'cost', label: 'Cost' }, { id: 'documents', label: 'Documents' }, { id: 'timeline', label: 'Timeline' },
      ]} active={tab} onChange={setTab} />
      {tab === 'overview' && (
        <div className="rounded-lg border border-border bg-panel p-4 text-sm grid sm:grid-cols-2 gap-3">
          <p>AWB: <strong>{shipment.awb || '—'}</strong></p>
          <p>Origin: {shipment.origin}</p>
          <p>Destination: {shipment.destination}</p>
          <p>Chargeable Weight: {shipment.chargeableWeight} kg</p>
        </div>
      )}
      {tab === 'tracking' && (
        <Timeline items={(shipment.tracking || []).map((t, i) => ({ id: i, title: `${t.event} · ${t.location}`, at: t.at, status: 'done' }))} />
      )}
      {tab === 'package' && (
        <div className="rounded-lg border border-border bg-panel p-4 text-sm space-y-1">
          <p>Actual Weight: {shipment.weight} kg</p>
          <p>Dimensional Weight: {shipment.dimWeight} kg</p>
          <p>Chargeable Weight: {shipment.chargeableWeight} kg</p>
        </div>
      )}
      {tab === 'cost' && (
        <div className="rounded-lg border border-border bg-panel p-4 text-sm space-y-2">
          <p>Estimated Rate / Cost: {formatCurrency(shipment.estimatedCost)}</p>
          <p>Actual / Billed Cost: {shipment.actualCost != null ? formatCurrency(shipment.actualCost) : 'Pending'}</p>
          {variance != null && <p className={variance > 0 ? 'text-danger font-medium' : 'text-success'}>Variance: {formatCurrency(variance)}</p>}
        </div>
      )}
      {tab === 'documents' && <p className="text-sm text-slate-500">Linked export and label documents appear under Export module.</p>}
      {tab === 'timeline' && <Timeline items={(shipment.tracking || []).map((t, i) => ({ id: i, title: t.event, at: t.at, user: t.location, status: 'done' }))} />}
    </div>
  );
}

export function CourierReferencesPage() {
  const { state, setState, toast, advanceWorkflow } = useDemo();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    order: '#1001', provider: 'Delhivery International', reference: 'DLV-INT-DEMO-1001',
    awb: 'DLV1001DEMO001', qrReference: 'QR-DLV-1001', serviceType: 'Express',
    weight: 28.5, dimensions: '250x180x12 cm', estimatedCost: 1250, notes: '',
  });

  return (
    <div>
      <PageHeader
        title="Courier References"
        subtitle="Manual mapping from India courier portal"
        breadcrumbs={[{ label: 'Shipping' }, { label: 'Courier References' }]}
        actions={<button type="button" className="btn-primary" onClick={() => setOpen(true)}>Record Courier Reference</button>}
      />
      <div className="mb-4 rounded-lg border border-violet-200 bg-violet-50 p-3 text-sm text-violet-900">
        Courier API Automation — Planned / Pending Provider Integration. Current workflow: external portal generates AWB/QR → operator maps reference in RugOS → internal label generated.
      </div>
      <DataTable columns={[
        { key: 'order', label: 'Order' }, { key: 'provider', label: 'Provider', render: (r) => r.provider || '—' },
        { key: 'reference', label: 'Reference', render: (r) => r.reference || '—' },
        { key: 'awb', label: 'AWB', render: (r) => r.awb || '—' },
        { key: 'qrReference', label: 'QR', render: (r) => r.qrReference || '—' },
        { key: 'serviceType', label: 'Service', render: (r) => r.serviceType || '—' },
        { key: 'weight', label: 'Weight' },
        { key: 'estimatedCost', label: 'Est. Cost', render: (r) => formatCurrency(r.estimatedCost) },
        { key: 'status', label: 'Status', render: (r) => <StatusBadge status={r.status} /> },
      ]} rows={state.courierReferences} />

      <Modal open={open} onClose={() => setOpen(false)} title="Record Courier Reference" size="lg" footer={
        <>
          <button type="button" className="btn-secondary" onClick={() => setOpen(false)}>Cancel</button>
          <button type="button" className="btn-primary" onClick={() => {
            if (form.order === '#1001') advanceWorkflow('enterCourier', form);
            setState((prev) => ({
              ...prev,
              courierReferences: prev.courierReferences.map((c) =>
                c.order === form.order ? { ...c, ...form, status: 'Mapped' } : c
              ),
            }));
            toast('Courier reference saved');
            setOpen(false);
          }}>Save Courier Reference</button>
        </>
      }>
        <div className="grid gap-3 sm:grid-cols-2">
          {Object.entries(form).map(([k, v]) => (
            <div key={k}><label className="label-field capitalize">{k.replace(/([A-Z])/g, ' $1')}</label>
              <input className="input-field" value={v} onChange={(e) => setForm({ ...form, [k]: e.target.value })} /></div>
          ))}
        </div>
      </Modal>
    </div>
  );
}

export function LabelsPage() {
  const { state, toast, advanceWorkflow } = useDemo();
  const order = state.orders.find((o) => o.id === '1001');
  const labeled = state.orders.filter((o) => o.awb || o.labelGenerated);

  return (
    <div>
      <PageHeader title="Labels" subtitle="Internal packing / shipping labels" breadcrumbs={[{ label: 'Shipping' }, { label: 'Labels' }]} />
      <div className="mb-4 rounded-lg border border-border bg-panel p-4">
        <p className="text-sm font-semibold">Order #1001 Label</p>
        <p className="text-xs text-slate-500 mt-1">Requires courier reference before generation.</p>
        <div className="mt-3 flex gap-2">
          <button type="button" className="btn-primary" disabled={!order?.awb} onClick={() => { advanceWorkflow('generateLabel'); toast('Shipping label generated'); }}>Generate Label</button>
          <button type="button" className="btn-secondary" disabled={!order?.labelGenerated} onClick={() => { advanceWorkflow('printLabel'); window.print(); toast('Label sent to printer'); }}>Print Label</button>
          <button type="button" className="btn-secondary" onClick={() => toast('PDF download simulated')}>Download PDF</button>
        </div>
      </div>
      <DataTable columns={[
        { key: 'orderNumber', label: 'Order', render: (r) => <Link to={`/orders/${r.id}`} className="text-accent hover:underline">{r.orderNumber}</Link> },
        { key: 'sku', label: 'SKU' }, { key: 'awb', label: 'AWB', render: (r) => r.awb || '—' },
        { key: 'labelGenerated', label: 'Generated', render: (r) => r.labelGenerated ? 'Yes' : (r.awb ? 'Ready' : 'Pending') },
        { key: 'labelPrinted', label: 'Printed', render: (r) => r.labelPrinted ? 'Yes' : 'No' },
      ]} rows={labeled.length ? labeled : state.orders.slice(0, 8)} />
    </div>
  );
}

export function TrackingPage() {
  const { state } = useDemo();
  const withTracking = state.shipments.filter((s) => s.awb);
  return (
    <div>
      <PageHeader title="Tracking" breadcrumbs={[{ label: 'Shipping' }, { label: 'Tracking' }]} />
      <DataTable columns={[
        { key: 'id', label: 'Shipment', render: (r) => <Link to={`/shipments/${r.id}`} className="text-accent hover:underline">{r.id}</Link> },
        { key: 'awb', label: 'AWB' }, { key: 'courier', label: 'Courier' },
        { key: 'status', label: 'Status', render: (r) => <StatusBadge status={r.status} /> },
        { key: 'last', label: 'Last Event', render: (r) => r.tracking?.length ? r.tracking[r.tracking.length - 1].event : '—' },
        { key: 'lastUpdate', label: 'Updated', render: (r) => formatDateTime(r.lastUpdate) },
      ]} rows={withTracking} />
    </div>
  );
}

export function ShippingExceptionsPage() {
  const { state, setState, toast } = useDemo();
  return (
    <div>
      <PageHeader title="Delivery Exceptions" breadcrumbs={[{ label: 'Shipping' }, { label: 'Exceptions' }]} />
      <DataTable columns={[
        { key: 'id', label: 'Exception' }, { key: 'shipment', label: 'Shipment' }, { key: 'order', label: 'Order' },
        { key: 'type', label: 'Type' }, { key: 'courier', label: 'Courier' }, { key: 'awb', label: 'AWB' },
        { key: 'status', label: 'Status', render: (r) => <StatusBadge status={r.status} /> },
        { key: 'age', label: 'Age' }, { key: 'notes', label: 'Notes' },
        {
          key: 'action', label: 'Action', render: (r) => r.status !== 'Resolved' ? (
            <button type="button" className="btn-primary text-xs" onClick={() => {
              setState((prev) => ({ ...prev, exceptions: prev.exceptions.map((e) => e.id === r.id ? { ...e, status: 'Resolved' } : e) }));
              toast('Exception resolved');
            }}>Resolve</button>
          ) : null,
        },
      ]} rows={state.exceptions} />
    </div>
  );
}
