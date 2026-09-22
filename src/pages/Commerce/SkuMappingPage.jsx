import { useMemo, useState } from 'react';
import PageHeader from '../../components/common/PageHeader';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import SearchInput, { FilterBar, SelectFilter } from '../../components/common/SearchInput';
import Modal from '../../components/common/Modal';
import { useDemo } from '../../context/DemoContext';
import { MARKETPLACES } from '../../constants';

export default function SkuMappingPage() {
  const { state, mapSku } = useDemo();
  const [q, setQ] = useState('');
  const [marketplace, setMarketplace] = useState('');
  const [status, setStatus] = useState('Mapping Required');
  const [modal, setModal] = useState(null);
  const [selectedSku, setSelectedSku] = useState('');
  const [skuSearch, setSkuSearch] = useState('');

  const rows = useMemo(() => {
    return state.skuMappings.filter((m) => {
      if (marketplace && m.marketplace !== marketplace) return false;
      if (status && m.status !== status) return false;
      if (q && !`${m.marketplaceSku} ${m.product}`.toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
  }, [state.skuMappings, marketplace, status, q]);

  const skuOptions = state.products.filter((p) =>
    !skuSearch || `${p.sku} ${p.name}`.toLowerCase().includes(skuSearch.toLowerCase())
  );

  return (
    <div>
      <PageHeader title="SKU Mapping Exceptions" subtitle="Map marketplace SKUs to internal RugOS SKUs" breadcrumbs={[{ label: 'Commerce' }, { label: 'SKU Mapping' }]} />
      <FilterBar>
        <SearchInput value={q} onChange={setQ} className="w-56" placeholder="Marketplace SKU…" />
        <SelectFilter label="Marketplace" value={marketplace} onChange={setMarketplace} options={MARKETPLACES} />
        <SelectFilter label="Status" value={status} onChange={setStatus} options={['Mapping Required', 'Mapped']} />
      </FilterBar>
      <DataTable
        columns={[
          { key: 'marketplaceSku', label: 'Marketplace SKU' },
          { key: 'marketplace', label: 'Marketplace' },
          { key: 'product', label: 'Listing' },
          { key: 'internalSku', label: 'Internal SKU', render: (r) => r.internalSku || '—' },
          { key: 'status', label: 'Status', render: (r) => <StatusBadge status={r.status} /> },
          {
            key: 'action',
            label: 'Action',
            render: (r) =>
              r.status === 'Mapping Required' ? (
                <button type="button" className="btn-primary text-xs" onClick={() => { setModal(r); setSelectedSku(''); setSkuSearch(''); }}>Map to Internal SKU</button>
              ) : (
                <span className="text-xs text-slate-400">Mapped</span>
              ),
          },
        ]}
        rows={rows}
      />

      <Modal
        open={!!modal}
        onClose={() => setModal(null)}
        title="Map to Internal SKU"
        footer={
          <>
            <button type="button" className="btn-secondary" onClick={() => setModal(null)}>Cancel</button>
            <button
              type="button"
              className="btn-primary"
              disabled={!selectedSku}
              onClick={() => { mapSku(modal.id, selectedSku); setModal(null); }}
            >
              Save Mapping
            </button>
          </>
        }
      >
        <p className="mb-2 text-sm text-slate-600">Marketplace SKU: <strong>{modal?.marketplaceSku}</strong></p>
        <SearchInput value={skuSearch} onChange={setSkuSearch} placeholder="Search internal SKUs…" className="mb-3" />
        <div className="max-h-56 space-y-1 overflow-y-auto">
          {skuOptions.map((p) => (
            <button
              key={p.sku}
              type="button"
              className={`flex w-full items-center justify-between rounded-md border px-3 py-2 text-left text-sm ${selectedSku === p.sku ? 'border-accent bg-blue-50' : 'border-border hover:bg-slate-50'}`}
              onClick={() => setSelectedSku(p.sku)}
            >
              <span><strong>{p.sku}</strong> · {p.name}</span>
              <span className="text-xs text-slate-500">{p.size}</span>
            </button>
          ))}
        </div>
      </Modal>
    </div>
  );
}
