import { useState } from 'react';
import PageHeader from '../../components/common/PageHeader';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import { useDemo } from '../../context/DemoContext';
import { formatDateTime } from '../../utils/format';

export default function MarketplaceImportsPage() {
  const { state, toast, setState } = useDemo();
  const [syncing, setSyncing] = useState(null);

  const syncNow = (marketplace) => {
    setSyncing(marketplace);
    setTimeout(() => {
      setState((prev) => ({
        ...prev,
        marketplaceSync: prev.marketplaceSync.map((m) =>
          m.marketplace === marketplace
            ? { ...m, lastSync: new Date().toISOString(), ordersImported: m.ordersImported + 1 }
            : m
        ),
        importLogs: [
          {
            id: `IMP-${Date.now()}`,
            source: marketplace,
            startedAt: new Date().toISOString(),
            completedAt: new Date().toISOString(),
            recordsReceived: 5,
            created: 1,
            updated: 4,
            skipped: 0,
            failed: 0,
          },
          ...prev.importLogs,
        ],
      }));
      setSyncing(null);
      toast(`${marketplace} sync completed (demo)`);
    }, 800);
  };

  return (
    <div>
      <PageHeader title="Marketplace Imports" subtitle="Demo connected marketplaces — no live API credentials" breadcrumbs={[{ label: 'Commerce' }, { label: 'Marketplace Imports' }]} />
      <div className="mb-5 grid gap-4 md:grid-cols-3">
        {state.marketplaceSync.map((m) => (
          <div key={m.marketplace} className="rounded-lg border border-border bg-panel p-4 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-navy-900">{m.marketplace}</h3>
                <StatusBadge status={m.status} className="mt-1" />
              </div>
              <StatusBadge status={m.syncStatus} />
            </div>
            <dl className="mt-3 space-y-1 text-sm text-slate-600">
              <div className="flex justify-between"><dt>Last Sync</dt><dd>{formatDateTime(m.lastSync)}</dd></div>
              <div className="flex justify-between"><dt>Orders Imported</dt><dd>{m.ordersImported}</dd></div>
              <div className="flex justify-between"><dt>Failed Imports</dt><dd>{m.failedImports}</dd></div>
              <div className="flex justify-between"><dt>Next Sync</dt><dd>{formatDateTime(m.nextSync)}</dd></div>
            </dl>
            <div className="mt-3 flex gap-2">
              <button type="button" className="btn-primary" disabled={!!syncing} onClick={() => syncNow(m.marketplace)}>
                {syncing === m.marketplace ? 'Syncing…' : 'Sync Now'}
              </button>
            </div>
            <p className="mt-2 text-[11px] text-slate-400">Demo data only — live API requires credentials</p>
          </div>
        ))}
      </div>
      <h3 className="mb-2 text-sm font-semibold">Import History</h3>
      <DataTable
        columns={[
          { key: 'source', label: 'Source' },
          { key: 'startedAt', label: 'Started', render: (r) => formatDateTime(r.startedAt) },
          { key: 'completedAt', label: 'Completed', render: (r) => formatDateTime(r.completedAt) },
          { key: 'recordsReceived', label: 'Received' },
          { key: 'created', label: 'Created' },
          { key: 'updated', label: 'Updated' },
          { key: 'skipped', label: 'Skipped' },
          { key: 'failed', label: 'Failed', render: (r) => <span className={r.failed ? 'text-danger font-medium' : ''}>{r.failed}</span> },
        ]}
        rows={state.importLogs}
      />
    </div>
  );
}
