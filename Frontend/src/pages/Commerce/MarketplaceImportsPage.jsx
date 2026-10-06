import { useMemo, useState } from 'react';
import PageHeader from '../../components/common/PageHeader';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import Modal from '../../components/common/Modal';
import { useDemo } from '../../context/DemoContext';
import { MARKETPLACES } from '../../constants';
import { formatDateTime } from '../../utils/format';

const EMPTY_CONN = {
  marketplace: 'Amazon',
  status: 'Connected',
  lastSync: null,
  ordersImported: 0,
  failedImports: 0,
  syncStatus: 'Healthy',
  nextSync: null,
};

const EMPTY_LOG = {
  source: 'Amazon',
  startedAt: '',
  completedAt: '',
  recordsReceived: 0,
  created: 0,
  updated: 0,
  skipped: 0,
  failed: 0,
};

const CONN_STATUSES = ['Connected', 'Disconnected', 'Error', 'Pending Setup'];
const SYNC_STATUSES = ['Healthy', 'Warning', 'Failed', 'Idle'];

export default function MarketplaceImportsPage() {
  const { state, toast, addEntity, updateEntity, removeEntity } = useDemo();
  const [syncing, setSyncing] = useState(null);
  const [connEdit, setConnEdit] = useState(null);
  const [logEdit, setLogEdit] = useState(null);

  const connections = state.marketplaceSync || [];
  const logs = useMemo(() => state.importLogs || [], [state.importLogs]);

  const syncNow = (marketplace) => {
    const row = connections.find((m) => m.marketplace === marketplace);
    if (!row) return;
    setSyncing(marketplace);
    const now = new Date().toISOString();
    const next = new Date(Date.now() + 6 * 3600 * 1000).toISOString();

    window.setTimeout(() => {
      updateEntity('marketplaceSync', 'marketplace', marketplace, {
        lastSync: now,
        nextSync: next,
        ordersImported: (Number(row.ordersImported) || 0) + 1,
        syncStatus: 'Healthy',
        status: row.status === 'Disconnected' ? 'Connected' : row.status,
      });
      addEntity('importLogs', {
        id: `IMP-${Date.now()}`,
        source: marketplace,
        startedAt: now,
        completedAt: now,
        recordsReceived: 5,
        created: 1,
        updated: 4,
        skipped: 0,
        failed: 0,
      });
      setSyncing(null);
      toast(`${marketplace} sync saved to database`);
    }, 600);
  };

  const saveConn = () => {
    const form = connEdit.form;
    if (!form.marketplace) {
      toast('Marketplace is required', 'error');
      return;
    }
    if (connEdit.mode === 'create') {
      if (connections.some((c) => c.marketplace === form.marketplace)) {
        toast('This marketplace already exists', 'error');
        return;
      }
      addEntity('marketplaceSync', {
        ...EMPTY_CONN,
        ...form,
        ordersImported: Number(form.ordersImported) || 0,
        failedImports: Number(form.failedImports) || 0,
      });
      toast('Marketplace connection created');
    } else {
      updateEntity('marketplaceSync', 'marketplace', connEdit.id, {
        ...form,
        ordersImported: Number(form.ordersImported) || 0,
        failedImports: Number(form.failedImports) || 0,
      });
      toast('Marketplace connection updated');
    }
    setConnEdit(null);
  };

  const saveLog = () => {
    const form = logEdit.form;
    if (!form.source) {
      toast('Source is required', 'error');
      return;
    }
    const payload = {
      ...form,
      recordsReceived: Number(form.recordsReceived) || 0,
      created: Number(form.created) || 0,
      updated: Number(form.updated) || 0,
      skipped: Number(form.skipped) || 0,
      failed: Number(form.failed) || 0,
      startedAt: form.startedAt ? new Date(form.startedAt).toISOString() : new Date().toISOString(),
      completedAt: form.completedAt ? new Date(form.completedAt).toISOString() : new Date().toISOString(),
    };
    if (logEdit.mode === 'create') {
      addEntity('importLogs', { ...payload, id: `IMP-${Date.now()}` });
      toast('Import log created');
    } else {
      updateEntity('importLogs', 'id', logEdit.id, payload);
      toast('Import log updated');
    }
    setLogEdit(null);
  };

  return (
    <div>
      <PageHeader
        title="Marketplace Imports"
        subtitle={`${connections.length} connections · ${logs.length} import logs · synced to MongoDB`}
        breadcrumbs={[{ label: 'Commerce' }, { label: 'Marketplace Imports' }]}
        actions={
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className="btn-primary"
              onClick={() => setConnEdit({ mode: 'create', form: { ...EMPTY_CONN } })}
            >
              Add Connection
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => setLogEdit({
                mode: 'create',
                form: {
                  ...EMPTY_LOG,
                  startedAt: new Date().toISOString().slice(0, 16),
                  completedAt: new Date().toISOString().slice(0, 16),
                },
              })}
            >
              Add Import Log
            </button>
          </div>
        }
      />

      <div className="mb-5 grid gap-4 md:grid-cols-3">
        {connections.map((m) => (
          <div key={m.marketplace} className="rounded-lg border border-border bg-panel p-4 shadow-sm">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-semibold text-navy-900">{m.marketplace}</h3>
                <StatusBadge status={m.status} className="mt-1" />
              </div>
              <StatusBadge status={m.syncStatus} />
            </div>
            <dl className="mt-3 space-y-1 text-sm text-slate-600">
              <div className="flex justify-between"><dt>Last Sync</dt><dd>{m.lastSync ? formatDateTime(m.lastSync) : '—'}</dd></div>
              <div className="flex justify-between"><dt>Orders Imported</dt><dd>{m.ordersImported ?? 0}</dd></div>
              <div className="flex justify-between"><dt>Failed Imports</dt><dd>{m.failedImports ?? 0}</dd></div>
              <div className="flex justify-between"><dt>Next Sync</dt><dd>{m.nextSync ? formatDateTime(m.nextSync) : '—'}</dd></div>
            </dl>
            <div className="mt-3 flex flex-wrap gap-2">
              <button type="button" className="btn-primary text-xs" disabled={!!syncing} onClick={() => syncNow(m.marketplace)}>
                {syncing === m.marketplace ? 'Syncing…' : 'Sync Now'}
              </button>
              <button
                type="button"
                className="btn-secondary text-xs"
                onClick={() => setConnEdit({ mode: 'edit', id: m.marketplace, form: { ...EMPTY_CONN, ...m } })}
              >
                Edit
              </button>
              <button
                type="button"
                className="btn-danger text-xs"
                onClick={() => {
                  if (window.confirm(`Delete ${m.marketplace} connection?`)) {
                    removeEntity('marketplaceSync', 'marketplace', m.marketplace);
                    toast('Connection deleted from database');
                  }
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        {!connections.length && (
          <div className="rounded-lg border border-dashed border-border bg-panel px-4 py-10 text-center text-sm text-slate-500 md:col-span-3">
            No marketplace connections yet. Click Add Connection.
          </div>
        )}
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
          {
            key: '_actions',
            label: 'Actions',
            render: (r) => (
              <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                <button
                  type="button"
                  className="btn-secondary text-xs"
                  onClick={() => setLogEdit({
                    mode: 'edit',
                    id: r.id,
                    form: {
                      ...EMPTY_LOG,
                      ...r,
                      startedAt: r.startedAt ? String(r.startedAt).slice(0, 16) : '',
                      completedAt: r.completedAt ? String(r.completedAt).slice(0, 16) : '',
                    },
                  })}
                >
                  Edit
                </button>
                <button
                  type="button"
                  className="btn-danger text-xs"
                  onClick={() => {
                    if (window.confirm('Delete this import log?')) {
                      removeEntity('importLogs', 'id', r.id);
                      toast('Import log deleted from database');
                    }
                  }}
                >
                  Delete
                </button>
              </div>
            ),
          },
        ]}
        rows={logs}
        emptyMessage="No import logs yet"
      />

      <Modal
        open={!!connEdit}
        onClose={() => setConnEdit(null)}
        title={connEdit?.mode === 'create' ? 'Add Marketplace Connection' : 'Edit Marketplace Connection'}
        footer={
          <>
            <button type="button" className="btn-secondary" onClick={() => setConnEdit(null)}>Cancel</button>
            <button type="button" className="btn-primary" onClick={saveConn}>Save</button>
          </>
        }
      >
        {connEdit && (
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block text-sm sm:col-span-2">
              <span className="mb-1 block text-xs font-medium text-slate-600">Marketplace *</span>
              <select
                className="input-field"
                value={connEdit.form.marketplace}
                disabled={connEdit.mode === 'edit'}
                onChange={(e) => setConnEdit((p) => ({ ...p, form: { ...p.form, marketplace: e.target.value } }))}
              >
                {MARKETPLACES.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
            </label>
            <label className="block text-sm">
              <span className="mb-1 block text-xs font-medium text-slate-600">Status</span>
              <select
                className="input-field"
                value={connEdit.form.status}
                onChange={(e) => setConnEdit((p) => ({ ...p, form: { ...p.form, status: e.target.value } }))}
              >
                {CONN_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </label>
            <label className="block text-sm">
              <span className="mb-1 block text-xs font-medium text-slate-600">Sync status</span>
              <select
                className="input-field"
                value={connEdit.form.syncStatus}
                onChange={(e) => setConnEdit((p) => ({ ...p, form: { ...p.form, syncStatus: e.target.value } }))}
              >
                {SYNC_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </label>
            <label className="block text-sm">
              <span className="mb-1 block text-xs font-medium text-slate-600">Orders imported</span>
              <input
                type="number"
                className="input-field"
                value={connEdit.form.ordersImported}
                onChange={(e) => setConnEdit((p) => ({ ...p, form: { ...p.form, ordersImported: e.target.value } }))}
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1 block text-xs font-medium text-slate-600">Failed imports</span>
              <input
                type="number"
                className="input-field"
                value={connEdit.form.failedImports}
                onChange={(e) => setConnEdit((p) => ({ ...p, form: { ...p.form, failedImports: e.target.value } }))}
              />
            </label>
          </div>
        )}
      </Modal>

      <Modal
        open={!!logEdit}
        onClose={() => setLogEdit(null)}
        title={logEdit?.mode === 'create' ? 'Add Import Log' : 'Edit Import Log'}
        footer={
          <>
            <button type="button" className="btn-secondary" onClick={() => setLogEdit(null)}>Cancel</button>
            <button type="button" className="btn-primary" onClick={saveLog}>Save</button>
          </>
        }
      >
        {logEdit && (
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block text-sm">
              <span className="mb-1 block text-xs font-medium text-slate-600">Source *</span>
              <select
                className="input-field"
                value={logEdit.form.source}
                onChange={(e) => setLogEdit((p) => ({ ...p, form: { ...p.form, source: e.target.value } }))}
              >
                {MARKETPLACES.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
            </label>
            <label className="block text-sm">
              <span className="mb-1 block text-xs font-medium text-slate-600">Records received</span>
              <input type="number" className="input-field" value={logEdit.form.recordsReceived} onChange={(e) => setLogEdit((p) => ({ ...p, form: { ...p.form, recordsReceived: e.target.value } }))} />
            </label>
            <label className="block text-sm">
              <span className="mb-1 block text-xs font-medium text-slate-600">Started</span>
              <input type="datetime-local" className="input-field" value={logEdit.form.startedAt} onChange={(e) => setLogEdit((p) => ({ ...p, form: { ...p.form, startedAt: e.target.value } }))} />
            </label>
            <label className="block text-sm">
              <span className="mb-1 block text-xs font-medium text-slate-600">Completed</span>
              <input type="datetime-local" className="input-field" value={logEdit.form.completedAt} onChange={(e) => setLogEdit((p) => ({ ...p, form: { ...p.form, completedAt: e.target.value } }))} />
            </label>
            {['created', 'updated', 'skipped', 'failed'].map((k) => (
              <label key={k} className="block text-sm">
                <span className="mb-1 block text-xs font-medium capitalize text-slate-600">{k}</span>
                <input type="number" className="input-field" value={logEdit.form[k]} onChange={(e) => setLogEdit((p) => ({ ...p, form: { ...p.form, [k]: e.target.value } }))} />
              </label>
            ))}
          </div>
        )}
      </Modal>
    </div>
  );
}
