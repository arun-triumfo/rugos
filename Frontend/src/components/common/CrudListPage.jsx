import { useMemo, useState } from 'react';
import PageHeader from './PageHeader';
import DataTable from './DataTable';
import Modal from './Modal';
import SearchInput, { FilterBar } from './SearchInput';
import { useDemo } from '../../context/DemoContext';

/**
 * Generic list CRUD bound to DemoContext collections (persists to Mongo when API is live).
 */
export default function CrudListPage({
  title,
  subtitle,
  breadcrumbs,
  collection,
  idField = 'id',
  columns,
  fields,
  defaults = {},
  rowKey,
  searchKeys = [],
  newIdPrefix = 'NEW',
  buildItem,
}) {
  const { state, addEntity, updateEntity, removeEntity, toast } = useDemo();
  const rows = state[collection] || [];
  const [q, setQ] = useState('');
  const [edit, setEdit] = useState(null); // null | { mode:'create'|'edit', form }

  const filtered = useMemo(() => {
    if (!q.trim()) return rows;
    const s = q.toLowerCase();
    return rows.filter((r) => {
      if (searchKeys.length) {
        return searchKeys.some((k) => String(r[k] ?? '').toLowerCase().includes(s));
      }
      return JSON.stringify(r).toLowerCase().includes(s);
    });
  }, [rows, q, searchKeys]);

  const openCreate = () => {
    setEdit({ mode: 'create', form: { ...defaults } });
  };

  const openEdit = (row) => {
    const form = {};
    fields.forEach((f) => { form[f.key] = row[f.key] ?? ''; });
    setEdit({ mode: 'edit', form, id: row[idField] });
  };

  const save = () => {
    if (!edit) return;
    const form = { ...edit.form };
    // basic required
    for (const f of fields) {
      if (f.required && (form[f.key] === undefined || form[f.key] === '')) {
        toast(`${f.label} is required`, 'error');
        return;
      }
    }
    // coerce numbers
    fields.forEach((f) => {
      if (f.type === 'number' && form[f.key] !== '' && form[f.key] != null) {
        form[f.key] = Number(form[f.key]);
      }
    });

    if (edit.mode === 'create') {
      const id = form[idField] || `${newIdPrefix}-${Date.now().toString().slice(-6)}`;
      const item = buildItem
        ? buildItem(form, id)
        : { ...defaults, ...form, [idField]: id };
      addEntity(collection, item);
      toast(`${title}: created`);
    } else {
      updateEntity(collection, idField, edit.id, form);
      toast(`${title}: updated`);
    }
    setEdit(null);
  };

  const onDelete = (row) => {
    if (!window.confirm(`Delete this ${title.slice(0, -1) || 'record'}?`)) return;
    removeEntity(collection, idField, row[idField]);
    toast(`${title}: deleted`);
  };

  const actionCol = {
    key: '_actions',
    label: 'Actions',
    render: (r) => (
      <div className="flex flex-wrap gap-1" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="btn-secondary text-xs" onClick={() => openEdit(r)}>Edit</button>
        <button type="button" className="btn-danger text-xs" onClick={() => onDelete(r)}>Delete</button>
      </div>
    ),
  };

  return (
    <div>
      <PageHeader
        title={title}
        subtitle={subtitle || `${filtered.length} records · stored in database`}
        breadcrumbs={breadcrumbs}
        actions={
          <button type="button" className="btn-primary" onClick={openCreate}>
            Add {title.replace(/s$/, '') || 'Record'}
          </button>
        }
      />
      {searchKeys.length > 0 && (
        <FilterBar>
          <SearchInput value={q} onChange={setQ} className="w-full sm:w-64" placeholder="Search…" />
        </FilterBar>
      )}
      <DataTable
        columns={[...columns, actionCol]}
        rows={filtered}
        rowKey={rowKey || idField}
        compact
      />

      <Modal
        open={!!edit}
        onClose={() => setEdit(null)}
        title={edit?.mode === 'create' ? `Add ${title}` : `Edit ${title}`}
        footer={
          <>
            <button type="button" className="btn-secondary" onClick={() => setEdit(null)}>Cancel</button>
            <button type="button" className="btn-primary" onClick={save}>Save</button>
          </>
        }
      >
        {edit && (
          <div className="grid gap-3 sm:grid-cols-2">
            {fields.map((f) => (
              <label key={f.key} className={f.full ? 'sm:col-span-2 block text-sm' : 'block text-sm'}>
                <span className="mb-1 block text-xs font-medium text-slate-600">
                  {f.label}{f.required ? ' *' : ''}
                </span>
                {f.type === 'select' ? (
                  <select
                    className="input-field"
                    value={edit.form[f.key] ?? ''}
                    onChange={(e) => setEdit((prev) => ({ ...prev, form: { ...prev.form, [f.key]: e.target.value } }))}
                    disabled={f.disabledOnEdit && edit.mode === 'edit'}
                  >
                    <option value="">Select…</option>
                    {(f.options || []).map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                ) : f.type === 'textarea' ? (
                  <textarea
                    className="input-field min-h-[80px]"
                    value={edit.form[f.key] ?? ''}
                    onChange={(e) => setEdit((prev) => ({ ...prev, form: { ...prev.form, [f.key]: e.target.value } }))}
                  />
                ) : (
                  <input
                    type={f.type || 'text'}
                    className="input-field"
                    value={edit.form[f.key] ?? ''}
                    onChange={(e) => setEdit((prev) => ({ ...prev, form: { ...prev.form, [f.key]: e.target.value } }))}
                    disabled={f.disabledOnEdit && edit.mode === 'edit'}
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
