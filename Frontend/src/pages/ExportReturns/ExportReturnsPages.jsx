import { useState } from 'react';
import PageHeader from '../../components/common/PageHeader';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import Modal from '../../components/common/Modal';
import CrudListPage from '../../components/common/CrudListPage';
import { useDemo } from '../../context/DemoContext';
import { formatCurrency, formatDate, ageingBucket } from '../../utils/format';

export function ExportDocumentsPage() {
  const { state, toast } = useDemo();
  return (
    <div>
      <PageHeader title="Export Documents" subtitle="Formats depend on final approved business process" breadcrumbs={[{ label: 'Export' }, { label: 'Documents' }]} />
      <div className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {['Commercial Invoice', 'Packing List', 'Proforma Invoice', 'Shipping Bill', 'AWB / BL', 'Certificate / Origin Reference', 'HS Codes', 'Supporting Documents'].map((t) => (
          <div key={t} className="rounded-lg border border-border bg-panel p-3">
            <p className="text-sm font-medium">{t}</p>
            <p className="text-xs text-slate-500">{state.exportDocuments.filter((d) => d.type === t).length} documents</p>
          </div>
        ))}
      </div>
      <DataTable columns={[
        { key: 'documentNumber', label: 'Document #' }, { key: 'shipment', label: 'Shipment' },
        { key: 'type', label: 'Type' }, { key: 'version', label: 'Ver' },
        { key: 'createdDate', label: 'Created', render: (r) => formatDate(r.createdDate) },
        { key: 'status', label: 'Status', render: (r) => <StatusBadge status={r.status} /> },
        { key: 'createdBy', label: 'By' },
        {
          key: 'actions', label: 'Actions', render: () => (
            <div className="flex gap-1">
              <button type="button" className="btn-secondary text-xs" onClick={() => toast('Document preview opened')}>Generate Preview</button>
              <button type="button" className="btn-secondary text-xs" onClick={() => toast('Download simulated')}>Download</button>
            </div>
          ),
        },
      ]} rows={state.exportDocuments} compact />
    </div>
  );
}

export function CommercialInvoicesPage() {
  const { state } = useDemo();
  return (
    <div>
      <PageHeader title="Commercial Invoices" breadcrumbs={[{ label: 'Export' }, { label: 'Commercial Invoices' }]} />
      <DataTable columns={[
        { key: 'documentNumber', label: 'Number' }, { key: 'shipment', label: 'Shipment' },
        { key: 'version', label: 'Version' }, { key: 'createdDate', label: 'Date', render: (r) => formatDate(r.createdDate) },
        { key: 'status', label: 'Status', render: (r) => <StatusBadge status={r.status} /> },
      ]} rows={state.exportDocuments.filter((d) => d.type === 'Commercial Invoice')} />
    </div>
  );
}

export function PackingListsPage() {
  const { state } = useDemo();
  return (
    <div>
      <PageHeader title="Packing Lists" breadcrumbs={[{ label: 'Export' }, { label: 'Packing Lists' }]} />
      <DataTable columns={[
        { key: 'documentNumber', label: 'Number' }, { key: 'shipment', label: 'Shipment' },
        { key: 'status', label: 'Status', render: (r) => <StatusBadge status={r.status} /> },
        { key: 'createdDate', label: 'Date', render: (r) => formatDate(r.createdDate) },
      ]} rows={state.exportDocuments.filter((d) => d.type === 'Packing List')} />
    </div>
  );
}

export function ProformaPage() {
  const { state } = useDemo();
  return (
    <div>
      <PageHeader title="Proforma Invoices" breadcrumbs={[{ label: 'Export' }, { label: 'Proforma' }]} />
      <DataTable columns={[
        { key: 'documentNumber', label: 'Number' }, { key: 'shipment', label: 'Shipment' },
        { key: 'status', label: 'Status', render: (r) => <StatusBadge status={r.status} /> },
      ]} rows={state.exportDocuments.filter((d) => d.type === 'Proforma Invoice')} />
    </div>
  );
}

export function EbrcBrcPage() {
  const { state, setState, toast } = useDemo();
  return (
    <div>
      <PageHeader title="EBRC / BRC" subtitle="Export realization" breadcrumbs={[{ label: 'Export' }, { label: 'EBRC / BRC' }]} />
      <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
        Workflow depends on final approved banking process.
      </div>
      <DataTable columns={[
        { key: 'invoice', label: 'Invoice' }, { key: 'customer', label: 'Customer' },
        { key: 'currency', label: 'CCY' }, { key: 'invoiceAmount', label: 'Amount', render: (r) => formatCurrency(r.invoiceAmount) },
        { key: 'realizedAmount', label: 'Realized', render: (r) => formatCurrency(r.realizedAmount) },
        { key: 'bankReference', label: 'Bank Ref', render: (r) => r.bankReference || '—' },
        { key: 'ebrcStatus', label: 'EBRC', render: (r) => <StatusBadge status={r.ebrcStatus} /> },
        { key: 'brcStatus', label: 'BRC', render: (r) => <StatusBadge status={r.brcStatus} /> },
        {
          key: 'action', label: 'Action', render: (r) => r.ebrcStatus === 'Pending' ? (
            <button type="button" className="btn-primary text-xs" onClick={() => {
              setState((prev) => ({ ...prev, ebrc: prev.ebrc.map((e) => e.id === r.id ? { ...e, ebrcStatus: 'Submitted' } : e) }));
              toast('EBRC submitted (demo)');
            }}>Submit</button>
          ) : null,
        },
      ]} rows={state.ebrc} />
    </div>
  );
}

export function FiraPage() {
  const { state, toast } = useDemo();
  return (
    <div>
      <PageHeader title="FIRA" subtitle="Foreign inward remittance advice" breadcrumbs={[{ label: 'Export' }, { label: 'FIRA' }]}
        actions={<button type="button" className="btn-primary" onClick={() => toast('Bank submission package preview generated')}>Generate Bank Submission Package</button>}
      />
      <DataTable columns={[
        { key: 'invoice', label: 'Invoice' }, { key: 'customer', label: 'Customer' },
        { key: 'foreignCurrency', label: 'CCY' }, { key: 'amount', label: 'Amount', render: (r) => formatCurrency(r.amount) },
        { key: 'receiptDate', label: 'Receipt', render: (r) => formatDate(r.receiptDate) },
        { key: 'bank', label: 'Bank' }, { key: 'transactionReference', label: 'Txn Ref', render: (r) => r.transactionReference || '—' },
        { key: 'firaStatus', label: 'Status', render: (r) => <StatusBadge status={r.firaStatus} /> },
      ]} rows={state.fira} />
    </div>
  );
}

export function ReturnsPage() {
  const { updateEntity, toast } = useDemo();
  return (
    <CrudListPage
      title="Returns"
      breadcrumbs={[{ label: 'Returns' }, { label: 'Returns' }]}
      collection="returns"
      idField="id"
      newIdPrefix="RET"
      searchKeys={['id', 'originalOrder', 'customer', 'sku']}
      defaults={{ qty: 1, status: 'Requested', condition: 'Good', refundStatus: 'Pending', returnDestination: 'USA Warehouse' }}
      fields={[
        { key: 'originalOrder', label: 'Order', required: true },
        { key: 'originalShipment', label: 'Shipment' },
        { key: 'customer', label: 'Customer', required: true },
        { key: 'sku', label: 'SKU', required: true },
        { key: 'qty', label: 'Qty', type: 'number' },
        { key: 'reason', label: 'Reason', required: true },
        { key: 'returnDestination', label: 'Destination' },
        { key: 'condition', label: 'Condition', type: 'select', options: ['Good', 'Damaged', 'Opened'] },
        { key: 'refundStatus', label: 'Refund' },
        { key: 'status', label: 'Status', type: 'select', options: ['Requested', 'Approved', 'Received', 'Closed', 'In Transit'] },
      ]}
      columns={[
        { key: 'id', label: 'Return ID' }, { key: 'originalOrder', label: 'Order' },
        { key: 'customer', label: 'Customer' }, { key: 'sku', label: 'SKU' }, { key: 'qty', label: 'Qty' },
        { key: 'reason', label: 'Reason' },
        { key: 'condition', label: 'Condition', render: (r) => <StatusBadge status={r.condition} /> },
        { key: 'status', label: 'Status', render: (r) => <StatusBadge status={r.status} /> },
        {
          key: 'approve',
          label: 'Quick',
          render: (r) => r.status === 'Requested' ? (
            <button type="button" className="btn-primary text-xs" onClick={() => { updateEntity('returns', 'id', r.id, { status: 'Approved' }); toast('Return approved'); }}>Approve</button>
          ) : null,
        },
      ]}
    />
  );
}

export function RtoPage() {
  const { state } = useDemo();
  const rows = state.returns.filter((r) => r.reason.toLowerCase().includes('rto') || r.status.includes('Transit'));
  return (
    <div>
      <PageHeader title="RTO" subtitle="Return to origin cases" breadcrumbs={[{ label: 'Returns' }, { label: 'RTO' }]} />
      <DataTable columns={[
        { key: 'id', label: 'ID' }, { key: 'originalOrder', label: 'Order' }, { key: 'sku', label: 'SKU' },
        { key: 'reason', label: 'Reason' }, { key: 'status', label: 'Status', render: (r) => <StatusBadge status={r.status} /> },
      ]} rows={rows.length ? rows : state.returns.filter((r) => r.id === 'RET-001')} />
    </div>
  );
}

export function ClaimsPage() {
  const { updateEntity, toast } = useDemo();
  return (
    <div>
      <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-amber-800">
        Tentative Workflow — final claims business rules are not fixed
      </div>
      <CrudListPage
        title="Claims"
        breadcrumbs={[{ label: 'Returns' }, { label: 'Claims' }]}
        collection="claims"
        idField="id"
        newIdPrefix="CLM"
        searchKeys={['id', 'shipment', 'order', 'courier']}
        defaults={{ status: 'Draft', claimAmount: 0, approvedAmount: 0, claimType: 'Damage' }}
        fields={[
          { key: 'shipment', label: 'Shipment', required: true },
          { key: 'order', label: 'Order' },
          { key: 'courier', label: 'Courier' },
          { key: 'claimType', label: 'Type', required: true },
          { key: 'claimAmount', label: 'Claim Amount', type: 'number', required: true },
          { key: 'approvedAmount', label: 'Approved Amount', type: 'number' },
          { key: 'status', label: 'Status', type: 'select', options: ['Draft', 'Submitted', 'Approved', 'Partially Approved', 'Recovered', 'Rejected'] },
          { key: 'notes', label: 'Notes', type: 'textarea', full: true },
        ]}
        columns={[
          { key: 'id', label: 'Claim ID' }, { key: 'shipment', label: 'Shipment' },
          { key: 'order', label: 'Order', render: (r) => r.order || '—' },
          { key: 'courier', label: 'Courier' }, { key: 'claimType', label: 'Type' },
          { key: 'claimAmount', label: 'Claim', render: (r) => formatCurrency(r.claimAmount) },
          { key: 'status', label: 'Status', render: (r) => <StatusBadge status={r.status} /> },
          {
            key: 'quick',
            label: 'Quick',
            render: (r) => r.status === 'Approved' || r.status === 'Partially Approved' ? (
              <button type="button" className="btn-success text-xs" onClick={() => { updateEntity('claims', 'id', r.id, { status: 'Recovered' }); toast('Claim recovered'); }}>Recover</button>
            ) : r.status === 'Draft' ? (
              <button type="button" className="btn-primary text-xs" onClick={() => { updateEntity('claims', 'id', r.id, { status: 'Submitted' }); toast('Claim submitted'); }}>Submit</button>
            ) : null,
          },
        ]}
      />
    </div>
  );
}
