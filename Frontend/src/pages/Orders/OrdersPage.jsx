import { useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import SearchInput, { FilterBar, SelectFilter } from '../../components/common/SearchInput';
import Modal from '../../components/common/Modal';
import { useDemo } from '../../context/DemoContext';
import { MARKETPLACES, COUNTRIES, ORDER_STATUSES, WAREHOUSES } from '../../constants';
import { formatCurrency, formatDate } from '../../utils/format';

const EMPTY = {
  marketplace: 'Amazon',
  customer: '',
  country: 'USA',
  sku: '',
  product: '',
  qty: 1,
  sellingPrice: 0,
  status: 'Imported',
  paymentStatus: 'Paid',
  warehouse: 'India Main Warehouse',
};

export default function OrdersPage() {
  const { state, addEntity, updateEntity, removeEntity, toast } = useDemo();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [q, setQ] = useState('');
  const [marketplace, setMarketplace] = useState('');
  const [status, setStatus] = useState(params.get('status') || '');
  const [country, setCountry] = useState('');
  const [warehouse, setWarehouse] = useState('');
  const [edit, setEdit] = useState(null);

  const rows = useMemo(() => {
    return state.orders.filter((o) => {
      if (marketplace && o.marketplace !== marketplace) return false;
      if (status && o.status !== status) return false;
      if (country && o.country !== country) return false;
      if (warehouse && o.warehouse !== warehouse) return false;
      if (q) {
        const s = q.toLowerCase();
        if (
          !o.orderNumber.toLowerCase().includes(s) &&
          !(o.sku || '').toLowerCase().includes(s) &&
          !(o.customer || '').toLowerCase().includes(s) &&
          !(o.product || '').toLowerCase().includes(s)
        ) return false;
      }
      return true;
    });
  }, [state.orders, marketplace, status, country, warehouse, q]);

  const save = () => {
    const form = edit.form;
    if (!form.customer || !form.product) {
      toast('Customer and product are required', 'error');
      return;
    }
    if (edit.mode === 'create') {
      const id = String(Date.now()).slice(-6);
      addEntity('orders', {
        ...EMPTY,
        ...form,
        id,
        key: id,
        orderNumber: `#${id}`,
        marketplaceOrderId: `${form.marketplace?.slice(0, 3).toUpperCase()}-${id}`,
        date: new Date().toISOString(),
        qty: Number(form.qty) || 1,
        sellingPrice: Number(form.sellingPrice) || 0,
        currency: 'INR',
        inventoryStatus: 'Pending',
        shipmentStatus: 'Not Created',
        demoWorkflow: false,
        workflowStep: 1,
        timeline: [],
        auditLog: [],
        costs: {},
      });
      toast('Order created in database');
    } else {
      updateEntity('orders', 'id', edit.id, {
        ...form,
        qty: Number(form.qty) || 1,
        sellingPrice: Number(form.sellingPrice) || 0,
      });
      toast('Order updated in database');
    }
    setEdit(null);
  };

  const columns = [
    { key: 'orderNumber', label: 'Order', render: (r) => <Link to={`/orders/${r.id}`} className="font-medium text-accent hover:underline">{r.orderNumber}</Link> },
    { key: 'marketplace', label: 'Marketplace', render: (r) => <StatusBadge status={r.marketplace} color="blue" /> },
    { key: 'date', label: 'Date', render: (r) => formatDate(r.date) },
    { key: 'customer', label: 'Customer' },
    { key: 'country', label: 'Country' },
    { key: 'sku', label: 'SKU', render: (r) => r.sku || '—' },
    { key: 'product', label: 'Product', render: (r) => <span className="max-w-[160px] truncate block">{r.product}</span> },
    { key: 'qty', label: 'Qty' },
    { key: 'sellingPrice', label: 'Price', render: (r) => formatCurrency(r.sellingPrice) },
    { key: 'status', label: 'Status', render: (r) => <StatusBadge status={r.status} /> },
    {
      key: '_actions',
      label: 'Actions',
      render: (r) => (
        <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
          <Link to={`/orders/${r.id}`} className="btn-secondary text-xs">Open</Link>
          <button type="button" className="btn-secondary text-xs" onClick={() => setEdit({ mode: 'edit', id: r.id, form: { ...EMPTY, ...r } })}>Edit</button>
          <button
            type="button"
            className="btn-danger text-xs"
            onClick={() => {
              if (window.confirm(`Delete ${r.orderNumber}?`)) {
                removeEntity('orders', 'id', r.id);
                toast('Order deleted from database');
              }
            }}
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Orders"
        subtitle={`${rows.length} orders · CRUD synced to MongoDB`}
        breadcrumbs={[{ label: 'Commerce' }, { label: 'Orders' }]}
        actions={
          <div className="flex gap-2">
            <button type="button" className="btn-primary" onClick={() => setEdit({ mode: 'create', form: { ...EMPTY } })}>Add Order</button>
            <Link to="/orders/1001" className="btn-secondary">Open #1001 Workflow</Link>
          </div>
        }
      />
      <FilterBar>
        <SearchInput value={q} onChange={setQ} placeholder="Order, SKU, customer…" className="w-56" />
        <SelectFilter label="Marketplace" value={marketplace} onChange={setMarketplace} options={MARKETPLACES} />
        <SelectFilter label="Status" value={status} onChange={setStatus} options={ORDER_STATUSES} />
        <SelectFilter label="Country" value={country} onChange={setCountry} options={COUNTRIES} />
        <SelectFilter label="Warehouse" value={warehouse} onChange={setWarehouse} options={WAREHOUSES} />
      </FilterBar>
      <DataTable columns={columns} rows={rows} onRowClick={(r) => navigate(`/orders/${r.id}`)} compact />

      <Modal
        open={!!edit}
        onClose={() => setEdit(null)}
        title={edit?.mode === 'create' ? 'Add Order' : 'Edit Order'}
        footer={
          <>
            <button type="button" className="btn-secondary" onClick={() => setEdit(null)}>Cancel</button>
            <button type="button" className="btn-primary" onClick={save}>Save</button>
          </>
        }
      >
        {edit && (
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              ['marketplace', 'Marketplace', 'select', MARKETPLACES],
              ['customer', 'Customer', 'text'],
              ['country', 'Country', 'select', COUNTRIES],
              ['sku', 'SKU', 'text'],
              ['product', 'Product', 'text'],
              ['qty', 'Qty', 'number'],
              ['sellingPrice', 'Price', 'number'],
              ['status', 'Status', 'select', ORDER_STATUSES],
              ['warehouse', 'Warehouse', 'select', WAREHOUSES],
              ['paymentStatus', 'Payment', 'text'],
            ].map(([key, label, type, options]) => (
              <label key={key} className="block text-sm">
                <span className="mb-1 block text-xs font-medium text-slate-600">{label}</span>
                {type === 'select' ? (
                  <select
                    className="input-field"
                    value={edit.form[key] || ''}
                    onChange={(e) => setEdit((p) => ({ ...p, form: { ...p.form, [key]: e.target.value } }))}
                  >
                    {options.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                ) : (
                  <input
                    type={type}
                    className="input-field"
                    value={edit.form[key] ?? ''}
                    onChange={(e) => setEdit((p) => ({ ...p, form: { ...p.form, [key]: e.target.value } }))}
                  />
                )}
              </label>
            ))}
          </div>
        )}
      </Modal>
    </div>
  );
}
