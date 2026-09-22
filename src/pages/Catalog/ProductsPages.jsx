import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import SearchInput, { FilterBar } from '../../components/common/SearchInput';
import { TabNavigation } from '../../components/common/Misc';
import { useDemo } from '../../context/DemoContext';
import { formatCurrency, formatDateTime } from '../../utils/format';

export function ProductsPage() {
  const { state } = useDemo();
  const navigate = useNavigate();
  const [q, setQ] = useState('');
  const rows = useMemo(() => state.products.filter((p) => !q || `${p.sku} ${p.name}`.toLowerCase().includes(q.toLowerCase())), [state.products, q]);

  return (
    <div>
      <PageHeader title="Products" subtitle={`${rows.length} active catalog items`} breadcrumbs={[{ label: 'Catalog' }, { label: 'Products' }]} />
      <FilterBar><SearchInput value={q} onChange={setQ} className="w-64" placeholder="SKU or product…" /></FilterBar>
      <DataTable
        columns={[
          { key: 'sku', label: 'SKU', render: (r) => <Link to={`/products/${r.sku}`} className="text-accent font-medium hover:underline">{r.sku}</Link> },
          { key: 'name', label: 'Product' },
          { key: 'category', label: 'Category' },
          { key: 'material', label: 'Material' },
          { key: 'size', label: 'Size' },
          { key: 'sellingPrice', label: 'Price', render: (r) => formatCurrency(r.sellingPrice) },
          { key: 'standardCost', label: 'Cost', render: (r) => formatCurrency(r.standardCost) },
          { key: 'status', label: 'Status', render: (r) => <StatusBadge status={r.status} /> },
        ]}
        rows={rows}
        onRowClick={(r) => navigate(`/products/${r.sku}`)}
      />
    </div>
  );
}

export function SkuMasterPage() {
  const { state } = useDemo();
  return (
    <div>
      <PageHeader title="SKU Master" subtitle="Internal SKU registry" breadcrumbs={[{ label: 'Catalog' }, { label: 'SKU Master' }]} />
      <DataTable
        columns={[
          { key: 'sku', label: 'Internal SKU', render: (r) => <Link to={`/products/${r.sku}`} className="text-accent hover:underline">{r.sku}</Link> },
          { key: 'name', label: 'Name' },
          { key: 'barcode', label: 'Barcode' },
          { key: 'qr', label: 'QR' },
          { key: 'countryOfOrigin', label: 'Origin' },
          { key: 'weight', label: 'Weight (kg)' },
          { key: 'gsm', label: 'GSM' },
          { key: 'status', label: 'Status', render: (r) => <StatusBadge status={r.status} /> },
        ]}
        rows={state.products}
      />
    </div>
  );
}

export function MarketplaceMappingPage() {
  const { state } = useDemo();
  return (
    <div>
      <PageHeader title="Marketplace Mapping" subtitle="Internal SKU ↔ marketplace channel SKUs" breadcrumbs={[{ label: 'Catalog' }, { label: 'Marketplace Mapping' }]} />
      <DataTable
        columns={[
          { key: 'sku', label: 'Internal SKU' },
          { key: 'amazonSku', label: 'Amazon SKU', render: (r) => r.amazonSku || '—' },
          { key: 'etsySku', label: 'Etsy SKU', render: (r) => r.etsySku || '—' },
          { key: 'walmartSku', label: 'Walmart SKU', render: (r) => r.walmartSku || '—' },
          { key: 'name', label: 'Product' },
        ]}
        rows={state.products}
      />
    </div>
  );
}

export function ProductDetailPage() {
  const { id } = useParams();
  const { state } = useDemo();
  const product = state.products.find((p) => p.sku === id || p.id === id);
  const inv = state.inventory.find((i) => i.sku === product?.sku);
  const ledger = state.stockLedger.filter((l) => l.sku === product?.sku);
  const [tab, setTab] = useState('overview');

  if (!product) return <PageHeader title="Product not found" />;

  return (
    <div>
      <PageHeader
        title={product.name}
        subtitle={`${product.sku} · ${product.category} · ${formatCurrency(product.sellingPrice)}`}
        breadcrumbs={[{ label: 'Catalog' }, { label: 'Products', to: '/products' }, { label: product.sku }]}
        badge={<StatusBadge status={product.status} />}
      />
      <TabNavigation
        tabs={[
          { id: 'overview', label: 'Overview' },
          { id: 'listings', label: 'Marketplace Listings' },
          { id: 'inventory', label: 'Inventory' },
          { id: 'history', label: 'Transaction History' },
          { id: 'cost', label: 'Cost' },
          { id: 'documents', label: 'Documents' },
          { id: 'images', label: 'Images' },
        ]}
        active={tab}
        onChange={setTab}
      />
      {tab === 'overview' && (
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-lg border border-border bg-panel p-4 text-sm space-y-2">
            {[
              ['Material', product.material], ['Construction', product.construction], ['Size', product.size],
              ['Shape', product.shape], ['Weight', `${product.weight} kg`], ['GSM', product.gsm],
              ['Origin', product.countryOfOrigin], ['Barcode', product.barcode],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between border-b border-border/60 py-1"><span className="text-slate-500">{k}</span><span className="font-medium">{v}</span></div>
            ))}
            <p className="pt-2 text-slate-600">{product.description}</p>
          </div>
          <div className="flex h-48 items-center justify-center rounded-lg border border-dashed border-border bg-slate-50 text-sm text-slate-400">
            Product image placeholder · {product.sku}
          </div>
        </div>
      )}
      {tab === 'listings' && (
        <div className="rounded-lg border border-border bg-panel p-4 text-sm space-y-2">
          <p>Amazon: {product.amazonSku || 'Not listed'}</p>
          <p>Etsy: {product.etsySku || 'Not listed'}</p>
          <p>Walmart: {product.walmartSku || 'Not listed'}</p>
        </div>
      )}
      {tab === 'inventory' && inv && (
        <div className="grid gap-3 sm:grid-cols-4">
          {['indiaAvailable', 'reserved', 'inTransit', 'usa', 'fba', 'packed', 'damaged'].map((k) => (
            <div key={k} className="rounded-lg border border-border bg-panel p-3">
              <p className="text-xs capitalize text-slate-500">{k.replace(/([A-Z])/g, ' $1')}</p>
              <p className="text-xl font-semibold">{inv[k]}</p>
            </div>
          ))}
        </div>
      )}
      {tab === 'history' && (
        <DataTable
          columns={[
            { key: 'date', label: 'Date/Time', render: (r) => formatDateTime(r.date) },
            { key: 'type', label: 'Type' },
            { key: 'reference', label: 'Reference' },
            { key: 'from', label: 'From' },
            { key: 'to', label: 'To' },
            { key: 'qtyIn', label: 'Qty In' },
            { key: 'qtyOut', label: 'Qty Out' },
            { key: 'balance', label: 'Balance' },
            { key: 'user', label: 'User' },
            { key: 'notes', label: 'Notes' },
          ]}
          rows={ledger}
          emptyMessage="No transactions for this SKU yet"
        />
      )}
      {tab === 'cost' && (
        <div className="rounded-lg border border-border bg-panel p-4 text-sm space-y-2">
          <p>Standard Cost: <strong>{formatCurrency(product.standardCost)}</strong></p>
          <p>Selling Price: <strong>{formatCurrency(product.sellingPrice)}</strong></p>
          <p>Gross Unit Margin: <strong>{formatCurrency(product.sellingPrice - product.standardCost)}</strong></p>
        </div>
      )}
      {tab === 'documents' && <p className="text-sm text-slate-500">Product specification sheets and certificates appear here when attached.</p>}
      {tab === 'images' && <div className="rounded-lg border border-dashed border-border bg-slate-50 p-12 text-center text-sm text-slate-400">No product images uploaded in demo</div>}
    </div>
  );
}
