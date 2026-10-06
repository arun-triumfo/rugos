import { useState } from 'react';
import PageHeader from '../../components/common/PageHeader';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import Modal from '../../components/common/Modal';
import { useSaas } from '../../context/SaasContext';
import { BUSINESS_MODES, BUSINESS_MODE_LABELS } from '../../data/mockSaas';
import { formatCurrency, formatDateTime } from '../../utils/format';

export function SuperAdminPlansPage() {
  const { plans, updatePlan, togglePlanActive } = useSaas();
  const [edit, setEdit] = useState(null);
  const [form, setForm] = useState({ monthlyPrice: 0, yearlyPrice: 0, name: '', description: '' });

  const openEdit = (plan) => {
    setEdit(plan);
    setForm({
      monthlyPrice: plan.monthlyPrice,
      yearlyPrice: plan.yearlyPrice,
      name: plan.name,
      description: plan.description,
    });
  };

  return (
    <div>
      <PageHeader title="Plans & Pricing" subtitle="Edit monthly / yearly prices shown on the landing page" />
      <DataTable
        columns={[
          { key: 'name', label: 'Plan' },
          { key: 'monthlyPrice', label: 'Monthly', render: (r) => formatCurrency(r.monthlyPrice) },
          { key: 'yearlyPrice', label: 'Yearly', render: (r) => formatCurrency(r.yearlyPrice) },
          { key: 'popular', label: 'Popular', render: (r) => (r.popular ? 'Yes' : '—') },
          { key: 'active', label: 'Status', render: (r) => <StatusBadge status={r.active ? 'Active' : 'Inactive'} /> },
          {
            key: 'actions',
            label: 'Actions',
            render: (r) => (
              <div className="flex gap-1">
                <button type="button" className="btn-secondary text-xs" onClick={() => openEdit(r)}>Edit price</button>
                <button type="button" className="btn-secondary text-xs" onClick={() => togglePlanActive(r.id)}>
                  {r.active ? 'Deactivate' : 'Activate'}
                </button>
              </div>
            ),
          },
        ]}
        rows={plans}
      />

      <Modal
        open={!!edit}
        onClose={() => setEdit(null)}
        title={`Edit plan · ${edit?.name}`}
        footer={
          <>
            <button type="button" className="btn-secondary" onClick={() => setEdit(null)}>Cancel</button>
            <button
              type="button"
              className="btn-primary"
              onClick={() => {
                updatePlan(edit.id, {
                  name: form.name,
                  description: form.description,
                  monthlyPrice: Number(form.monthlyPrice),
                  yearlyPrice: Number(form.yearlyPrice),
                });
                setEdit(null);
              }}
            >
              Save pricing
            </button>
          </>
        }
      >
        <div className="space-y-3">
          <div>
            <label className="label-field">Plan name</label>
            <input className="input-field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label className="label-field">Description</label>
            <input className="input-field" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div>
            <label className="label-field">Monthly price (INR)</label>
            <input type="number" className="input-field" value={form.monthlyPrice} onChange={(e) => setForm({ ...form, monthlyPrice: e.target.value })} />
          </div>
          <div>
            <label className="label-field">Yearly price (INR)</label>
            <input type="number" className="input-field" value={form.yearlyPrice} onChange={(e) => setForm({ ...form, yearlyPrice: e.target.value })} />
          </div>
        </div>
      </Modal>
    </div>
  );
}

export function SuperAdminSubscriptionsPage() {
  const { subscriptions, tenants, plans, changeTenantPlan } = useSaas();

  const rows = subscriptions.map((s) => {
    const tenant = tenants.find((t) => t.id === s.tenantId);
    const plan = plans.find((p) => p.id === s.planId);
    return {
      ...s,
      company: tenant?.companyName || s.tenantId,
      planName: plan?.name || s.planId,
      mode: tenant?.businessMode ? BUSINESS_MODE_LABELS[tenant.businessMode] : '—',
    };
  });

  return (
    <div>
      <PageHeader title="Subscriptions" subtitle="Active and pending SaaS subscriptions" />
      <DataTable
        columns={[
          { key: 'id', label: 'Subscription' },
          { key: 'company', label: 'Buyer' },
          { key: 'planName', label: 'Plan' },
          { key: 'billingCycle', label: 'Cycle' },
          { key: 'amount', label: 'Amount', render: (r) => formatCurrency(r.amount) },
          { key: 'mode', label: 'Mode' },
          { key: 'status', label: 'Status', render: (r) => <StatusBadge status={r.status} /> },
          { key: 'paymentRef', label: 'Payment ref' },
          { key: 'renewsAt', label: 'Renews', render: (r) => (r.renewsAt ? formatDateTime(r.renewsAt) : '—') },
          {
            key: 'change',
            label: 'Change plan',
            render: (r) =>
              r.status === 'Active' ? (
                <select
                  className="rounded border border-border px-2 py-1 text-xs"
                  defaultValue={r.planId}
                  onChange={(e) => changeTenantPlan(r.tenantId, e.target.value, r.billingCycle)}
                >
                  {plans.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              ) : (
                '—'
              ),
          },
        ]}
        rows={rows}
        compact
      />
    </div>
  );
}

export function SuperAdminBuyersPage() {
  const { tenants, plans, approveTenant, suspendTenant, getPlan, resetSaasData } = useSaas();
  const [approve, setApprove] = useState(null);
  const [mode, setMode] = useState(BUSINESS_MODES.EXPORT);

  return (
    <div>
      <PageHeader
        title="Buyers"
        subtitle="Purchased plans awaiting activation — choose Import or Export mode"
        actions={
          <button type="button" className="btn-secondary" onClick={() => { if (window.confirm('Reset SaaS buyers/plans/subscriptions?')) resetSaasData(); }}>
            Reset SaaS data
          </button>
        }
      />
      <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-900">
        New buyer purchases stay Pending until you activate with <strong>Export</strong> or <strong>Import</strong> (one mode only).
      </div>
      <DataTable
        columns={[
          { key: 'companyName', label: 'Company' },
          { key: 'contactName', label: 'Contact' },
          { key: 'email', label: 'Email' },
          { key: 'plan', label: 'Plan', render: (r) => getPlan(r.planId)?.name || r.planId },
          { key: 'billingCycle', label: 'Cycle' },
          {
            key: 'businessMode',
            label: 'Mode',
            render: (r) => (r.businessMode ? <StatusBadge status={BUSINESS_MODE_LABELS[r.businessMode]} color={r.businessMode === 'export' ? 'green' : 'blue'} /> : '—'),
          },
          { key: 'status', label: 'Status', render: (r) => <StatusBadge status={r.status} /> },
          { key: 'createdAt', label: 'Requested', render: (r) => formatDateTime(r.createdAt) },
          {
            key: 'actions',
            label: 'Actions',
            render: (r) => (
              <div className="flex flex-wrap gap-1">
                {r.status === 'Pending Approval' && (
                  <button type="button" className="btn-primary text-xs" onClick={() => { setApprove(r); setMode(BUSINESS_MODES.EXPORT); }}>
                    Approve & activate
                  </button>
                )}
                {r.status === 'Active' && (
                  <button type="button" className="btn-danger text-xs" onClick={() => suspendTenant(r.id)}>Suspend</button>
                )}
              </div>
            ),
          },
        ]}
        rows={tenants}
        compact
      />

      <Modal
        open={!!approve}
        onClose={() => setApprove(null)}
        title="Activate buyer"
        footer={
          <>
            <button type="button" className="btn-secondary" onClick={() => setApprove(null)}>Cancel</button>
            <button
              type="button"
              className="btn-primary"
              onClick={() => {
                approveTenant(approve.id, mode);
                setApprove(null);
              }}
            >
              Activate in {BUSINESS_MODE_LABELS[mode]} mode
            </button>
          </>
        }
      >
        <p className="mb-3 text-sm text-slate-600">
          <strong>{approve?.companyName}</strong> purchased{' '}
          <strong>{plans.find((p) => p.id === approve?.planId)?.name}</strong> ({approve?.billingCycle}).
        </p>
        <p className="mb-3 text-sm font-medium text-navy-900">Choose exactly one business mode:</p>
        <div className="grid gap-2 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => setMode(BUSINESS_MODES.EXPORT)}
            className={`rounded-lg border p-3 text-left text-sm ${mode === BUSINESS_MODES.EXPORT ? 'border-accent bg-blue-50' : 'border-border'}`}
          >
            <p className="font-semibold">Export</p>
            <p className="mt-1 text-xs text-slate-500">India → world selling, export docs, replenishment</p>
          </button>
          <button
            type="button"
            onClick={() => setMode(BUSINESS_MODES.IMPORT)}
            className={`rounded-lg border p-3 text-left text-sm ${mode === BUSINESS_MODES.IMPORT ? 'border-accent bg-blue-50' : 'border-border'}`}
          >
            <p className="font-semibold">Import</p>
            <p className="mt-1 text-xs text-slate-500">Inbound / receiving-focused use of the same modules</p>
          </button>
        </div>
      </Modal>
    </div>
  );
}

export function SuperAdminDemoRequestsPage() {
  const { demoRequests, updateDemoRequestStatus } = useSaas();

  return (
    <div>
      <PageHeader
        title="Access Requests"
        subtitle="Landing page trial / access form submissions"
      />
      <DataTable
        columns={[
          { key: 'companyName', label: 'Company' },
          { key: 'contactName', label: 'Contact' },
          { key: 'email', label: 'Email' },
          { key: 'phone', label: 'Phone', render: (r) => r.phone || '—' },
          {
            key: 'message',
            label: 'Notes',
            render: (r) => (
              <span className="block max-w-[220px] truncate" title={r.message}>
                {r.message || '—'}
              </span>
            ),
          },
          { key: 'status', label: 'Status', render: (r) => <StatusBadge status={r.status} /> },
          {
            key: 'createdAt',
            label: 'Submitted',
            render: (r) => (r.createdAt ? formatDateTime(r.createdAt) : '—'),
          },
          {
            key: 'actions',
            label: 'Actions',
            render: (r) => (
              <div className="flex flex-wrap gap-1">
                {['Contacted', 'Approved', 'Rejected'].map((s) => (
                  <button
                    key={s}
                    type="button"
                    className="btn-secondary text-xs"
                    disabled={r.status === s}
                    onClick={() => updateDemoRequestStatus(r.id, s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            ),
          },
        ]}
        rows={demoRequests || []}
        emptyMessage="No access requests yet"
      />
    </div>
  );
}
