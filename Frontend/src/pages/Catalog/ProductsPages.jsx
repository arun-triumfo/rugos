import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import { TabNavigation } from '../../components/common/Misc';
import CrudListPage from '../../components/common/CrudListPage';
import { useDemo } from '../../context/DemoContext';
import { formatCurrency, formatDateTime } from '../../utils/format';

const PRODUCT_FIELDS = [
  { key: 'sku', label: 'SKU', required: true, disabledOnEdit: true },
  { key: 'name', label: 'Name', required: true },
  { key: 'category', label: 'Category', required: true },
  { key: 'material', label: 'Material' },
  { key: 'size', label: 'Size' },
  { key: 'sellingPrice', label: 'Selling Price', type: 'number', required: true },
  { key: 'standardCost', label: 'Standard Cost', type: 'number' },
  { key: 'status', label: 'Status', type: 'select', options: ['Active', 'Inactive', 'Discontinued'] },
  { key: 'countryOfOrigin', label: 'Origin' },
  { key: 'weight', label: 'Weight (kg)', type: 'number' },
];

export function ProductsPage() {
  return (
    <CrudListPage
      title="Products"
      breadcrumbs={[{ label: 'Catalog' }, { label: 'Products' }]}
      collection="products"
      idField="id"
      newIdPrefix="PRD"
      searchKeys={['sku', 'name', 'category']}
      defaults={{ status: 'Active', currency: 'INR', sellingPrice: 0, standardCost: 0 }}
      buildItem={(form, id) => ({
        id,
        barcode: form.barcode || `BC-${form.sku}`,
        qr: form.qr || `QR-${form.sku}`,
        gsm: form.gsm || null,
        amazonSku: form.amazonSku || null,
        etsySku: form.etsySku || null,
        walmartSku: form.walmartSku || null,
        ...form,
      })}
      fields={PRODUCT_FIELDS}
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
    />
  );
}

export function SkuMasterPage() {
  return (
    <CrudListPage
      title="SKU Master"
      breadcrumbs={[{ label: 'Catalog' }, { label: 'SKU Master' }]}
      collection="products"
      idField="id"
      newIdPrefix="PRD"
      searchKeys={['sku', 'name', 'barcode']}
      defaults={{ status: 'Active', weight: 0 }}
      fields={[
        { key: 'sku', label: 'Internal SKU', required: true, disabledOnEdit: true },
        { key: 'name', label: 'Name', required: true },
        { key: 'barcode', label: 'Barcode' },
        { key: 'qr', label: 'QR' },
        { key: 'countryOfOrigin', label: 'Origin' },
        { key: 'weight', label: 'Weight (kg)', type: 'number' },
        { key: 'gsm', label: 'GSM', type: 'number' },
        { key: 'status', label: 'Status', type: 'select', options: ['Active', 'Inactive'] },
      ]}
      buildItem={(form, id) => ({
        id,
        category: form.category || 'General',
        material: form.material || '—',
        size: form.size || '—',
        sellingPrice: Number(form.sellingPrice) || 0,
        standardCost: Number(form.standardCost) || 0,
        ...form,
      })}
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
    />
  );
}

export function MarketplaceMappingPage() {
  return (
    <CrudListPage
      title="Marketplace Mapping"
      breadcrumbs={[{ label: 'Catalog' }, { label: 'Marketplace Mapping' }]}
      collection="products"
      idField="id"
      searchKeys={['sku', 'name', 'amazonSku', 'etsySku', 'walmartSku']}
      fields={[
        { key: 'sku', label: 'Internal SKU', required: true, disabledOnEdit: true },
        { key: 'name', label: 'Product', required: true },
        { key: 'amazonSku', label: 'Amazon SKU' },
        { key: 'etsySku', label: 'Etsy SKU' },
        { key: 'walmartSku', label: 'Walmart SKU' },
      ]}
      defaults={{ status: 'Active' }}
      buildItem={(form, id) => ({ id, category: 'Mapped', sellingPrice: 0, standardCost: 0, status: 'Active', ...form })}
      columns={[
        { key: 'sku', label: 'Internal SKU' },
        { key: 'amazonSku', label: 'Amazon SKU', render: (r) => r.amazonSku || '—' },
        { key: 'etsySku', label: 'Etsy SKU', render: (r) => r.etsySku || '—' },
        { key: 'walmartSku', label: 'Walmart SKU', render: (r) => r.walmartSku || '—' },
        { key: 'name', label: 'Product' },
      ]}
    />
  );
}

export function ProductDetailPage() {
  const { id } = useParams();
  const { state, updateEntity, toast } = useDemo();
  const product = state.products.find((p) => p.sku === id || p.id === id);
  const inv = state.inventory.find((i) => i.sku === product?.sku);
  const ledger = state.stockLedger.filter((l) => l.sku === product?.sku);
  const [tab, setTab] = useState('overview');
  const [name, setName] = useState(product?.name || '');
  const [price, setPrice] = useState(product?.sellingPrice || 0);

  if (!product) return <PageHeader title="Product not found" />;

  const saveDetail = () => {
    updateEntity('products', 'id', product.id, { name, sellingPrice: Number(price) });
    toast('Product updated in database');
  };

  return (
    <div>
      <PageHeader
        title={product.name}
        subtitle={`${product.sku} · ${product.category} · ${formatCurrency(product.sellingPrice)}`}
        breadcrumbs={[{ label: 'Catalog' }, { label: 'Products', to: '/products' }, { label: product.sku }]}
        badge={<StatusBadge status={product.status} />}
        actions={<button type="button" className="btn-primary" onClick={saveDetail}>Save Changes</button>}
      />
      <TabNavigation
        tabs={[
          { id: 'overview', label: 'Overview' },
          { id: 'inventory', label: 'Inventory' },
          { id: 'ledger', label: 'Stock Ledger' },
        ]}
        active={tab}
        onChange={setTab}
      />
      {tab === 'overview' && (
        <div className="mt-4 grid max-w-xl gap-3 rounded-lg border border-border bg-panel p-4">
          <label className="text-sm">
            <span className="label-field">Name</span>
            <input className="input-field" value={name} onChange={(e) => setName(e.target.value)} />
          </label>
          <label className="text-sm">
            <span className="label-field">Selling Price</span>
            <input type="number" className="input-field" value={price} onChange={(e) => setPrice(e.target.value)} />
          </label>
          <p className="text-xs text-slate-500">Changes save to MongoDB for this tenant.</p>
        </div>
      )}
      {tab === 'inventory' && (
        <div className="mt-4">
          {inv ? (
            <DataTable
              columns={[
                { key: 'indiaAvailable', label: 'India' },
                { key: 'reserved', label: 'Reserved' },
                { key: 'usa', label: 'USA' },
                { key: 'fba', label: 'FBA' },
                { key: 'inTransit', label: 'In Transit' },
              ]}
              rows={[inv]}
              rowKey="sku"
            />
          ) : <p className="text-sm text-slate-500">No inventory row</p>}
        </div>
      )}
      {tab === 'ledger' && (
        <div className="mt-4">
          <DataTable
            columns={[
              { key: 'date', label: 'Date', render: (r) => formatDateTime(r.date) },
              { key: 'type', label: 'Type' },
              { key: 'reference', label: 'Reference' },
              { key: 'qtyIn', label: 'In' },
              { key: 'qtyOut', label: 'Out' },
              { key: 'balance', label: 'Balance' },
            ]}
            rows={ledger}
          />
        </div>
      )}
    </div>
  );
}
