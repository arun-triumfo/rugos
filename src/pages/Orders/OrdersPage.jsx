import { useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import SearchInput, { FilterBar, SelectFilter } from '../../components/common/SearchInput';
import { useDemo } from '../../context/DemoContext';
import { MARKETPLACES, COUNTRIES, ORDER_STATUSES, WAREHOUSES } from '../../constants';
import { formatCurrency, formatDate } from '../../utils/format';

export default function OrdersPage() {
  const { state } = useDemo();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [q, setQ] = useState('');
  const [marketplace, setMarketplace] = useState('');
  const [status, setStatus] = useState(params.get('status') || '');
  const [country, setCountry] = useState('');
  const [warehouse, setWarehouse] = useState('');

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
    { key: 'fulfilmentLocation', label: 'Fulfilment', render: (r) => r.fulfilmentLocation || '—' },
    { key: 'inventoryStatus', label: 'Inventory' },
    { key: 'shipmentStatus', label: 'Shipment' },
    { key: 'paymentStatus', label: 'Payment' },
    { key: 'profit', label: 'Profit', render: (r) => (r.profit != null ? formatCurrency(r.profit) : '—') },
    { key: 'status', label: 'Status', render: (r) => <StatusBadge status={r.status} /> },
    { key: 'action', label: 'Action', render: (r) => <Link to={`/orders/${r.id}`} className="text-xs font-medium text-accent">Open</Link> },
  ];

  return (
    <div>
      <PageHeader
        title="Orders"
        subtitle={`${rows.length} orders · Demo focus: Amazon Order #1001`}
        breadcrumbs={[{ label: 'Commerce' }, { label: 'Orders' }]}
        actions={<Link to="/orders/1001" className="btn-primary">Open #1001 Workflow</Link>}
      />
      <FilterBar>
        <SearchInput value={q} onChange={setQ} placeholder="Order, SKU, customer…" className="w-56" />
        <SelectFilter label="Marketplace" value={marketplace} onChange={setMarketplace} options={MARKETPLACES} />
        <SelectFilter label="Status" value={status} onChange={setStatus} options={ORDER_STATUSES} />
        <SelectFilter label="Country" value={country} onChange={setCountry} options={COUNTRIES} />
        <SelectFilter label="Warehouse" value={warehouse} onChange={setWarehouse} options={WAREHOUSES} />
      </FilterBar>
      <DataTable columns={columns} rows={rows} onRowClick={(r) => navigate(`/orders/${r.id}`)} compact />
    </div>
  );
}
