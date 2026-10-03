import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';
import PageHeader, { ChartCard } from '../../components/common/PageHeader';
import StatusBadge from '../../components/common/StatusBadge';
import { TabNavigation, Timeline, WorkflowStepper } from '../../components/common/Misc';
import Modal from '../../components/common/Modal';
import { useDemo } from '../../context/DemoContext';
import { decideFulfilment } from '../../utils/allocation';
import { formatCurrency, formatDateTime, formatPercent, calcProfit } from '../../utils/format';

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'items', label: 'Items' },
  { id: 'inventory', label: 'Inventory' },
  { id: 'warehouse', label: 'Warehouse' },
  { id: 'shipment', label: 'Shipment' },
  { id: 'documents', label: 'Documents' },
  { id: 'finance', label: 'Finance' },
  { id: 'profitability', label: 'Profitability' },
  { id: 'timeline', label: 'Timeline' },
  { id: 'audit', label: 'Audit Log' },
  { id: 'workflow', label: 'Demo Workflow' },
];

export default function OrderDetailPage() {
  const { id } = useParams();
  const { state, advanceWorkflow, resetWorkflow1001, toast, appendAudit, workflowSteps } = useDemo();
  const order = state.orders.find((o) => o.id === id);
  const [tab, setTab] = useState(order?.demoWorkflow ? 'workflow' : 'overview');
  const [labelOpen, setLabelOpen] = useState(false);
  const [weighOpen, setWeighOpen] = useState(false);
  const [weighForm, setWeighForm] = useState({
    weightKg: 28.5,
    lengthCm: 250,
    widthCm: 180,
    heightCm: 12,
    notes: 'Manual weighing — no courier partner API yet',
  });
  const [weighPhoto, setWeighPhoto] = useState(null);

  const inv = state.inventory.find((i) => i.sku === (order?.sku || 'RUG-1001'));
  const previewDecision = useMemo(() => decideFulfilment(inv, order?.qty || 1), [inv, order?.qty]);
  const linkedMto = state.mto.find((m) => m.order === order?.orderNumber || m.id === order?.mtoId);

  const costBreakdown = useMemo(() => {
    if (!order?.costs) return [];
    return Object.entries(order.costs)
      .filter(([, v]) => v)
      .map(([k, v]) => ({ name: k, value: v }));
  }, [order]);

  if (!order) {
    return (
      <div>
        <PageHeader title="Order not found" />
        <Link to="/orders" className="btn-secondary">Back to Orders</Link>
      </div>
    );
  }

  const costs = order.actualCostsReady ? order.costs : (order.estimatedCosts || order.costs || {});
  const { totalCost, profit, margin } = calcProfit(order.sellingPrice, costs);
  const step = order.workflowStep || 1;
  const isMtoPending = order.fulfilmentPath === 'MTO' && !order.mtoReady;

  const run = (action, payload) => {
    advanceWorkflow(action, payload);
    appendAudit({
      user: 'Demo User',
      module: 'Orders',
      action,
      reference: order.orderNumber,
      oldValue: order.status,
      newValue: action,
    });
    const messages = {
      resolveSku: 'SKU mapped to RUG-1001',
      allocateInventory: 'Inventory check complete (USA → India → MTO)',
      completeMto: 'MTO completed — ready to pick',
      startPicking: 'Picking started',
      markPicked: 'Pick confirmed',
      recordWeighing: 'Weighing saved with photo & dimensions',
      generateLabel: 'Shipping label generated',
      printLabel: 'Label sent to printer',
      markPacked: `Order ${order.orderNumber} marked as Packed`,
      createShipment: 'Shipped to customer',
      markDelivered: 'Delivery confirmed · profitability finalized',
      
    };
    toast(messages[action] || 'Updated');
  };

  const nextAction = () => {
    if (step <= 1) return { label: 'Resolve SKU', fn: () => run('resolveSku') };
    if (step === 2) return { label: 'Check Inventory (USA → India → MTO)', fn: () => run('allocateInventory') };
    if (step === 3 && isMtoPending) return { label: 'Complete MTO / Mark Ready', fn: () => run('completeMto') };
    if (step === 3) return { label: 'Start Picking', fn: () => run('startPicking') };
    if (step === 4) return { label: 'Mark Picked', fn: () => run('markPicked') };
    if (step === 5) return { label: 'Capture Weighing', fn: () => setWeighOpen(true) };
    if (step === 6) return { label: 'Generate Label', fn: () => { run('generateLabel'); setLabelOpen(true); } };
    if (step === 7) return { label: 'Print Label', fn: () => { run('printLabel'); window.print(); } };
    if (step === 8) return { label: 'Mark Packed', fn: () => run('markPacked') };
    if (step === 9) return { label: 'Ship to Customer', fn: () => run('createShipment') };
    if (step === 10) return { label: 'Mark Delivered', fn: () => run('markDelivered') };
    return null;
  };

  const action = nextAction();

  return (
    <div>
      <PageHeader
        title={`Order ${order.orderNumber}`}
        subtitle={`${order.marketplace} · ${order.country} · ${formatCurrency(order.sellingPrice)}`}
        breadcrumbs={[{ label: 'Commerce', to: '/orders' }, { label: 'Orders', to: '/orders' }, { label: order.orderNumber }]}
        badge={<StatusBadge status={order.status} />}
        actions={
          <div className="flex flex-wrap gap-2">
            {order.demoWorkflow && (
              <button type="button" className="btn-secondary" onClick={resetWorkflow1001}>Reset Demo Workflow</button>
            )}
            {order.labelGenerated && (
              <button type="button" className="btn-secondary" onClick={() => setLabelOpen(true)}>Print Label</button>
            )}
            {action && (
              <button type="button" className="btn-primary" onClick={action.fn}>{action.label}</button>
            )}
          </div>
        }
      />

      {order.demoWorkflow && (
        <div className="mb-4">
          <WorkflowStepper steps={workflowSteps} currentStep={step} />
          <p className="mt-2 text-xs text-slate-500">
            Client rule: check <strong>USA</strong> first → then <strong>India</strong> → else <strong>Make (MTO)</strong> → pick → weigh (photo + dimensions) → label → ship customer.
            No live courier partner — labels are generated in RugOS.
          </p>
        </div>
      )}

      <TabNavigation tabs={TABS.filter((t) => order.demoWorkflow || t.id !== 'workflow')} active={tab} onChange={setTab} />

      {tab === 'overview' && (
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="space-y-3 rounded-lg border border-border bg-panel p-4 lg:col-span-2">
            <h3 className="text-sm font-semibold">Order Summary</h3>
            <dl className="grid grid-cols-2 gap-3 text-sm">
              <div><dt className="text-xs text-slate-500">Marketplace Order</dt><dd className="font-medium">{order.marketplaceOrderId}</dd></div>
              <div><dt className="text-xs text-slate-500">Customer</dt><dd className="font-medium">{order.customer}</dd></div>
              <div><dt className="text-xs text-slate-500">SKU</dt><dd className="font-medium">{order.sku || 'Unmapped'}</dd></div>
              <div><dt className="text-xs text-slate-500">Product</dt><dd className="font-medium">{order.product}</dd></div>
              <div><dt className="text-xs text-slate-500">Fulfilment Path</dt><dd className="font-medium">{order.fulfilmentPath || 'Pending check'}</dd></div>
              <div><dt className="text-xs text-slate-500">Fulfilment Type</dt><dd>{order.fulfilmentType || '—'}</dd></div>
              <div><dt className="text-xs text-slate-500">Warehouse</dt><dd>{order.warehouse || '—'}</dd></div>
              <div><dt className="text-xs text-slate-500">Bin</dt><dd>{order.bin || '—'}</dd></div>
              <div><dt className="text-xs text-slate-500">Inventory Status</dt><dd>{order.inventoryStatus}</dd></div>
              <div><dt className="text-xs text-slate-500">Shipment Status</dt><dd>{order.shipmentStatus}</dd></div>
              <div><dt className="text-xs text-slate-500">Weight</dt><dd>{order.weighing ? `${order.weighing.weightKg} kg` : '—'}</dd></div>
              <div><dt className="text-xs text-slate-500">Dimensions</dt><dd>{order.weighing ? `${order.weighing.lengthCm}×${order.weighing.widthCm}×${order.weighing.heightCm} cm` : '—'}</dd></div>
            </dl>
            {order.shipTo && (
              <div className="mt-3 rounded-md bg-slate-50 p-3 text-sm">
                <p className="text-xs font-semibold uppercase text-slate-500">Ship To</p>
                <p className="font-medium">{order.shipTo.name}</p>
                <p>{order.shipTo.line1}</p>
                <p>{order.shipTo.city}, {order.shipTo.state} {order.shipTo.zip}</p>
                <p>{order.shipTo.country}</p>
              </div>
            )}
          </div>
          <div className="space-y-3">
            <div className="rounded-lg border border-border bg-panel p-4">
              <h3 className="text-sm font-semibold">Profit Snapshot</h3>
              <p className="mt-2 text-2xl font-semibold text-emerald-700">{order.profit != null ? formatCurrency(order.profit) : formatCurrency(profit)}</p>
              <p className="text-sm text-slate-500">Margin {order.margin != null ? formatPercent(order.margin) : formatPercent(margin)}</p>
            </div>
            {linkedMto && (
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm">
                <p className="font-semibold text-amber-900">Linked MTO</p>
                <p className="mt-1">{linkedMto.id} · Stage: {linkedMto.stage}</p>
                <Link to="/warehouse/mto" className="btn-secondary mt-2 inline-flex text-xs">Open MTO Board</Link>
              </div>
            )}
            {order.demoWorkflow && (
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900">
                <p className="font-semibold">Client Demo Order</p>
                <button type="button" className="btn-primary mt-3" onClick={() => setTab('workflow')}>Open Demo Workflow</button>
              </div>
            )}
          </div>
        </div>
      )}

      {tab === 'items' && (
        <div className="rounded-lg border border-border bg-panel p-4">
          <table className="min-w-full text-sm">
            <thead className="text-[11px] uppercase text-slate-500"><tr><th className="text-left py-2">SKU</th><th className="text-left">Product</th><th>Qty</th><th className="text-right">Price</th></tr></thead>
            <tbody><tr className="border-t border-border"><td className="py-2">{order.sku || '—'}</td><td>{order.product}</td><td className="text-center">{order.qty}</td><td className="text-right">{formatCurrency(order.sellingPrice)}</td></tr></tbody>
          </table>
        </div>
      )}

      {tab === 'inventory' && inv && (
        <div className="space-y-4">
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900">
            <p className="font-semibold">Allocation rule</p>
            <ol className="mt-2 list-decimal pl-5 space-y-1">
              <li>Check USA free stock first</li>
              <li>If unavailable, check India free stock (Available − Reserved)</li>
              <li>If both unavailable → create Make to Order (MTO)</li>
            </ol>
            <p className="mt-2 text-xs">Preview for this SKU now: <strong>{previewDecision.path}</strong> — {previewDecision.message}</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-4">
            <div className="rounded-lg border border-border bg-panel p-3"><p className="text-xs text-slate-500">USA Free</p><p className="text-xl font-semibold text-emerald-700">{inv.usa}</p></div>
            <div className="rounded-lg border border-border bg-panel p-3"><p className="text-xs text-slate-500">India Free</p><p className="text-xl font-semibold">{Math.max(0, inv.indiaAvailable - inv.reserved)}</p></div>
            <div className="rounded-lg border border-border bg-panel p-3"><p className="text-xs text-slate-500">India Reserved</p><p className="text-xl font-semibold text-amber-600">{inv.reserved}</p></div>
            <div className="rounded-lg border border-border bg-panel p-3"><p className="text-xs text-slate-500">Chosen Path</p><p className="text-xl font-semibold">{order.fulfilmentPath || '—'}</p></div>
          </div>
          {order.allocationChecks && (
            <p className="text-xs text-slate-500">
              Last check — USA: {order.allocationChecks.usaFree} · India free: {order.allocationChecks.indiaFree}
            </p>
          )}
        </div>
      )}

      {tab === 'warehouse' && (
        <div className="rounded-lg border border-border bg-panel p-4 text-sm space-y-2">
          <p><span className="text-slate-500">Warehouse:</span> {order.warehouse || '—'}</p>
          <p><span className="text-slate-500">Bin:</span> {order.bin || '—'}</p>
          <p><span className="text-slate-500">Weighing photo:</span> {order.weighing?.photoName || 'Not captured'}</p>
          {order.weighing?.photoPreview && (
            <img src={order.weighing.photoPreview} alt="Weighing" className="mt-2 max-h-40 rounded border border-border" />
          )}
          <Link to="/warehouse/pick-pack" className="btn-secondary mt-2 inline-flex">Open Pick & Pack</Link>
        </div>
      )}

      {tab === 'shipment' && (
        <div className="rounded-lg border border-border bg-panel p-4 text-sm space-y-2">
          <p><span className="text-slate-500">Status:</span> {order.shipmentStatus}</p>
          <p><span className="text-slate-500">Courier partner:</span> {order.courier?.provider || 'None — manual label flow'}</p>
          <p><span className="text-slate-500">AWB / Ref:</span> {order.awb || '—'}</p>
          {order.weighing && (
            <p><span className="text-slate-500">Chargeable capture:</span> {order.weighing.weightKg} kg · {order.weighing.lengthCm}×{order.weighing.widthCm}×{order.weighing.heightCm} cm</p>
          )}
          <div className="mt-3 rounded-md border border-violet-200 bg-violet-50 p-3 text-xs text-violet-900">
            No live courier partner API. Weight/dimension/photo are captured in RugOS at weighing time; shipping label is generated internally.
          </div>
        </div>
      )}

      {tab === 'documents' && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {state.exportDocuments.filter((d) => d.shipment === 'SHP-1001' || d.documentNumber.includes('1001')).map((d) => (
            <div key={d.id} className="rounded-lg border border-border bg-panel p-3">
              <p className="text-sm font-medium">{d.type}</p>
              <p className="text-xs text-slate-500">{d.documentNumber}</p>
              <StatusBadge status={d.status} className="mt-2" />
            </div>
          ))}
        </div>
      )}

      {tab === 'finance' && (
        <div className="rounded-lg border border-border bg-panel p-4">
          <dl className="space-y-1 text-sm">
            <div className="flex justify-between font-medium"><dt>Selling Revenue</dt><dd>{formatCurrency(order.sellingPrice)}</dd></div>
            {Object.entries(costs).map(([k, v]) => (
              <div key={k} className="flex justify-between text-slate-600"><dt className="capitalize">{k.replace(/([A-Z])/g, ' $1')}</dt><dd>{formatCurrency(v)}</dd></div>
            ))}
            <div className="flex justify-between border-t border-border pt-2 font-semibold"><dt>Total Cost</dt><dd>{formatCurrency(totalCost)}</dd></div>
            <div className="flex justify-between text-emerald-700 font-semibold"><dt>Gross Profit</dt><dd>{formatCurrency(profit)}</dd></div>
          </dl>
        </div>
      )}

      {tab === 'profitability' && (
        <div className="grid gap-4 lg:grid-cols-2">
          <ChartCard title="Cost Waterfall">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[{ name: 'Revenue', value: order.sellingPrice }, ...costBreakdown, { name: 'Profit', value: profit }]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} angle={-25} textAnchor="end" height={60} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(v) => formatCurrency(v)} />
                  <Bar dataKey="value">
                    {[{ name: 'Revenue' }, ...costBreakdown, { name: 'Profit' }].map((e, i) => (
                      <Cell key={i} fill={e.name === 'Revenue' ? '#2563eb' : e.name === 'Profit' ? '#059669' : '#94a3b8'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
          <div className="rounded-lg border border-border bg-panel p-4 text-sm">
            <p>Customer pays <strong>{formatCurrency(order.sellingPrice)}</strong></p>
            <p className="mt-2">Final cost <strong>{formatCurrency(totalCost)}</strong> · Profit <strong className="text-emerald-700">{formatCurrency(profit)}</strong> ({formatPercent(margin)})</p>
          </div>
        </div>
      )}

      {tab === 'timeline' && <Timeline items={order.timeline?.length ? order.timeline : [{ id: 1, title: 'No timeline events yet', status: 'locked' }]} />}

      {tab === 'audit' && (
        <div className="rounded-lg border border-border bg-panel overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-[11px] uppercase text-slate-500"><tr><th className="px-3 py-2 text-left">Time</th><th className="text-left">User</th><th className="text-left">Action</th><th className="text-left">From</th><th className="text-left">To</th></tr></thead>
            <tbody className="divide-y divide-border">
              {(order.auditLog || []).map((a, i) => (
                <tr key={i}><td className="px-3 py-2">{formatDateTime(a.at)}</td><td>{a.user}</td><td>{a.action}</td><td>{a.oldValue || '—'}</td><td>{a.newValue}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'workflow' && order.demoWorkflow && (
        <div className="space-y-4">
          <div className="rounded-lg border border-border bg-panel p-4">
            <h3 className="text-sm font-semibold mb-2">Interactive Client Workflow</h3>
            <p className="text-sm text-slate-600 mb-3">
              Auto allocation uses current stock. Use force buttons to demo India or MTO paths.
            </p>

            <div className="mb-4 grid gap-2 sm:grid-cols-3">
              <div className="rounded-md border border-border bg-slate-50 p-3 text-xs">
                <p className="font-semibold text-slate-700">1. USA check</p>
                <p className="mt-1">Free: {inv?.usa ?? 0}</p>
              </div>
              <div className="rounded-md border border-border bg-slate-50 p-3 text-xs">
                <p className="font-semibold text-slate-700">2. India check</p>
                <p className="mt-1">Free: {inv ? Math.max(0, inv.indiaAvailable - inv.reserved) : 0}</p>
              </div>
              <div className="rounded-md border border-border bg-slate-50 p-3 text-xs">
                <p className="font-semibold text-slate-700">3. Else Make</p>
                <p className="mt-1">Creates linked MTO</p>
              </div>
            </div>

            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { label: 'Resolve SKU', action: 'resolveSku', min: 1 },
                { label: 'Allocate (Auto USA→India→MTO)', action: 'allocateInventory', min: 2 },
                { label: 'Force Allocate → India', action: 'allocateInventory', min: 2, payload: { forcePath: 'INDIA' }, force: true },
                { label: 'Force Allocate → MTO', action: 'allocateInventory', min: 2, payload: { forcePath: 'MTO' }, force: true },
                { label: 'Complete MTO', action: 'completeMto', min: 3, mtoOnly: true },
                { label: 'Start Picking', action: 'startPicking', min: 3 },
                { label: 'Mark Picked', action: 'markPicked', min: 4 },
                { label: 'Capture Weighing', action: 'recordWeighing', min: 5, open: () => setWeighOpen(true) },
                { label: 'Generate Label', action: 'generateLabel', min: 6 },
                { label: 'Print Label', action: 'printLabel', min: 7, extra: () => window.print() },
                { label: 'Mark Packed', action: 'markPacked', min: 8 },
                { label: 'Ship to Customer', action: 'createShipment', min: 9 },
                { label: 'Mark Delivered', action: 'markDelivered', min: 10 },
              ].map((btn) => {
                const done = !btn.force && !btn.mtoOnly && step > btn.min;
                const isNext = !btn.force && (
                  btn.mtoOnly
                    ? step === 3 && isMtoPending
                    : btn.action === 'startPicking'
                      ? step === 3 && !isMtoPending
                      : step === btn.min && !(btn.min === 3 && isMtoPending && btn.action !== 'completeMto')
                );
                const disabled = btn.force
                  ? step !== 2
                  : btn.mtoOnly
                    ? !(step === 3 && isMtoPending)
                    : btn.action === 'startPicking'
                      ? !(step === 3 && !isMtoPending)
                      : step < btn.min;
                return (
                  <button
                    key={btn.label}
                    type="button"
                    disabled={disabled && !done}
                    className={`rounded-md border px-3 py-2 text-left text-sm ${
                      done
                        ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                        : isNext || (btn.force && step === 2)
                          ? 'border-accent bg-blue-50 text-navy-900'
                          : 'border-border bg-slate-50 text-slate-400'
                    }`}
                    onClick={() => {
                      if (btn.open) btn.open();
                      else {
                        run(btn.action, btn.payload);
                        btn.extra?.();
                        if (btn.action === 'generateLabel') setLabelOpen(true);
                      }
                    }}
                  >
                    <span className="font-medium">{btn.label}</span>
                    {done && <span className="mt-0.5 block text-[11px]">Completed</span>}
                    {isNext && <span className="mt-0.5 block text-[11px] text-accent">Next step</span>}
                  </button>
                );
              })}
            </div>
            <button type="button" className="btn-secondary mt-4" onClick={resetWorkflow1001}>Reset Demo Workflow</button>
          </div>
          <Timeline items={order.timeline || []} />
        </div>
      )}

      <Modal
        open={weighOpen}
        onClose={() => setWeighOpen(false)}
        title="Capture Weighing"
        size="lg"
        footer={
          <>
            <button type="button" className="btn-secondary" onClick={() => setWeighOpen(false)}>Cancel</button>
            <button
              type="button"
              className="btn-primary"
              onClick={() => {
                run('recordWeighing', {
                  ...weighForm,
                  photoName: weighPhoto?.name || 'weighing-photo-1001.jpg',
                  photoPreview: weighPhoto?.url || null,
                });
                setWeighOpen(false);
              }}
            >
              Save Weighing
            </button>
          </>
        }
      >
        <p className="mb-3 text-xs text-slate-500">
          No courier partner API. Capture weight, dimensions, and a photo while weighing — stored in RugOS for the shipping label.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="label-field" htmlFor="weightKg">Weight (kg)</label>
            <input id="weightKg" type="number" step="0.1" className="input-field" value={weighForm.weightKg} onChange={(e) => setWeighForm({ ...weighForm, weightKg: e.target.value })} />
          </div>
          <div>
            <label className="label-field" htmlFor="lengthCm">Length (cm)</label>
            <input id="lengthCm" type="number" className="input-field" value={weighForm.lengthCm} onChange={(e) => setWeighForm({ ...weighForm, lengthCm: e.target.value })} />
          </div>
          <div>
            <label className="label-field" htmlFor="widthCm">Width (cm)</label>
            <input id="widthCm" type="number" className="input-field" value={weighForm.widthCm} onChange={(e) => setWeighForm({ ...weighForm, widthCm: e.target.value })} />
          </div>
          <div>
            <label className="label-field" htmlFor="heightCm">Height (cm)</label>
            <input id="heightCm" type="number" className="input-field" value={weighForm.heightCm} onChange={(e) => setWeighForm({ ...weighForm, heightCm: e.target.value })} />
          </div>
          <div className="sm:col-span-2">
            <label className="label-field" htmlFor="weighNotes">Notes</label>
            <input id="weighNotes" className="input-field" value={weighForm.notes} onChange={(e) => setWeighForm({ ...weighForm, notes: e.target.value })} />
          </div>
          <div className="sm:col-span-2">
            <label className="label-field" htmlFor="weighPhoto">Weighing photo (camera / file)</label>
            <input
              id="weighPhoto"
              type="file"
              accept="image/*"
              capture="environment"
              className="input-field"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) setWeighPhoto({ name: f.name, url: URL.createObjectURL(f) });
              }}
            />
            {weighPhoto && <img src={weighPhoto.url} alt="Weighing preview" className="mt-3 max-h-48 rounded border border-border" />}
          </div>
        </div>
      </Modal>

      <Modal open={labelOpen} onClose={() => setLabelOpen(false)} title="Shipping Label Preview" size="lg" footer={
        <>
          <button type="button" className="btn-secondary" onClick={() => setLabelOpen(false)}>Close</button>
          <button type="button" className="btn-secondary" onClick={() => toast('PDF download simulated')}>Download PDF</button>
          <button type="button" className="btn-primary" onClick={() => { run('printLabel'); window.print(); }}>Print Label</button>
        </>
      }>
        <div id="shipping-label" className="rounded border-2 border-dashed border-slate-400 bg-white p-6">
          <div className="flex justify-between border-b border-slate-300 pb-3">
            <div>
              <p className="text-lg font-bold">RugOS Shipping Label</p>
              <p className="text-xs text-slate-500">Internal label · No courier partner API</p>
            </div>
            <div className="text-right text-sm">
              <p className="font-semibold">{order.orderNumber}</p>
              <p>{order.awb || 'REF pending'}</p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs font-semibold uppercase text-slate-500">Ship To</p>
              <p className="font-medium">{order.shipTo?.name}</p>
              <p>{order.shipTo?.line1}</p>
              <p>{order.shipTo?.city}, {order.shipTo?.state} {order.shipTo?.zip}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase text-slate-500">Package</p>
              <p>SKU: {order.sku}</p>
              <p>{order.product}</p>
              <p>Qty: {order.qty}</p>
              <p>From: {order.warehouse}</p>
              <p>Path: {order.fulfilmentPath || '—'}</p>
              {order.weighing && (
                <>
                  <p>Weight: {order.weighing.weightKg} kg</p>
                  <p>Dims: {order.weighing.lengthCm}×{order.weighing.widthCm}×{order.weighing.heightCm} cm</p>
                </>
              )}
            </div>
          </div>
          <div className="mt-6 flex items-center justify-center gap-6">
            <div className="flex h-20 w-40 items-center justify-center border-2 border-slate-800 bg-slate-100 font-mono text-xs">||||| |||| |||||</div>
            <div className="flex h-20 w-20 items-center justify-center border-2 border-slate-800 bg-slate-100 text-[10px] text-center">QR<br />{order.qrReference || 'INTERNAL'}</div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
