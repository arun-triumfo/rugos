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
  const [courierOpen, setCourierOpen] = useState(false);
  const [receiptOpen, setReceiptOpen] = useState(false);
  const [labelOpen, setLabelOpen] = useState(false);
  const [courierForm, setCourierForm] = useState({
    provider: 'Delhivery International',
    reference: 'DLV-INT-DEMO-1001',
    awb: 'DLV1001DEMO001',
    qrReference: 'QR-DLV-1001',
    serviceType: 'Express',
    weight: 28.5,
    dimensions: '250x180x12 cm',
    estimatedCost: 1250,
    notes: 'Mapped from India courier portal (manual interim flow)',
  });
  const [receiptForm, setReceiptForm] = useState({ receivedQty: 1, condition: 'Good' });

  const inv = state.inventory.find((i) => i.sku === (order?.sku || 'RUG-1001'));

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

  const run = (action, payload) => {
    advanceWorkflow(action, payload);
    appendAudit({
      user: 'Demo User',
      module: 'Orders',
      action: action,
      reference: order.orderNumber,
      oldValue: order.status,
      newValue: action,
    });
    const messages = {
      resolveSku: 'SKU mapped to RUG-1001',
      allocateInventory: 'Inventory reserved successfully',
      startPicking: 'Picking started',
      markPicked: 'Pick confirmed',
      enterCourier: 'Courier reference saved',
      generateLabel: 'Shipping label generated',
      printLabel: 'Label sent to printer',
      uploadProof: 'Packing proof uploaded',
      markPacked: `Order ${order.orderNumber} marked as Packed`,
      dispatchIndia: 'Dispatched from India',
      markInTransit: 'Stock marked In Transit',
      confirmUsaReceipt: 'USA receipt confirmed',
      createShipment: 'Fulfilment shipment created',
      markDelivered: 'Delivery confirmed · profitability finalized',
    };
    toast(messages[action] || 'Updated');
  };

  const nextAction = () => {
    if (step <= 1) return { label: 'Resolve SKU', fn: () => run('resolveSku') };
    if (step === 2) return { label: 'Allocate Inventory', fn: () => run('allocateInventory') };
    if (step === 3) return { label: 'Start Picking', fn: () => run('startPicking') };
    if (step === 4) return { label: 'Mark Picked', fn: () => run('markPicked') };
    if (step === 5) return { label: 'Enter Courier Reference', fn: () => setCourierOpen(true) };
    if (step === 6) return { label: 'Generate Label', fn: () => { run('generateLabel'); setLabelOpen(true); } };
    if (step === 7) return { label: 'Print Label', fn: () => { run('printLabel'); window.print(); } };
    if (step === 8) return { label: 'Upload Packing Proof', fn: () => run('uploadProof', { proofName: 'packing-proof-1001.jpg' }) };
    if (step === 9) return { label: 'Mark Packed', fn: () => run('markPacked') };
    if (step === 10) return { label: 'Dispatch from India', fn: () => run('dispatchIndia') };
    if (step === 11) return { label: 'Mark In Transit', fn: () => run('markInTransit') };
    if (step === 12) return { label: 'Confirm USA Receipt', fn: () => setReceiptOpen(true) };
    if (step === 13) return { label: 'Create Shipment', fn: () => run('createShipment') };
    if (step === 14) return { label: 'Mark Delivered', fn: () => run('markDelivered') };
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
              <div><dt className="text-xs text-slate-500">Qty</dt><dd>{order.qty}</dd></div>
              <div><dt className="text-xs text-slate-500">Selling Price</dt><dd>{formatCurrency(order.sellingPrice)}</dd></div>
              <div><dt className="text-xs text-slate-500">Fulfilment</dt><dd>{order.fulfilmentLocation || '—'}</dd></div>
              <div><dt className="text-xs text-slate-500">Warehouse Bin</dt><dd>{order.bin || '—'}</dd></div>
              <div><dt className="text-xs text-slate-500">Inventory Status</dt><dd>{order.inventoryStatus}</dd></div>
              <div><dt className="text-xs text-slate-500">Shipment Status</dt><dd>{order.shipmentStatus}</dd></div>
              <div><dt className="text-xs text-slate-500">Payment</dt><dd>{order.paymentStatus}</dd></div>
              <div><dt className="text-xs text-slate-500">AWB</dt><dd>{order.awb || '—'}</dd></div>
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
              <p className="mt-2 text-xs text-slate-500">{order.actualCostsReady ? 'Actual cost applied' : 'Estimated cost (actual pending)'}</p>
            </div>
            {order.demoWorkflow && (
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900">
                <p className="font-semibold">Client Demo Order</p>
                <p className="mt-1 text-xs">Use the Demo Workflow tab or action button to advance each operational step. Changes persist in localStorage.</p>
                <button type="button" className="btn-primary mt-3" onClick={() => setTab('workflow')}>Open Demo Workflow</button>
              </div>
            )}
          </div>
        </div>
      )}

      {tab === 'items' && (
        <div className="rounded-lg border border-border bg-panel p-4">
          <table className="min-w-full text-sm">
            <thead className="text-[11px] uppercase text-slate-500"><tr><th className="text-left py-2">SKU</th><th className="text-left">Product</th><th>Qty</th><th className="text-right">Price</th><th className="text-right">Line Total</th></tr></thead>
            <tbody><tr className="border-t border-border"><td className="py-2">{order.sku || '—'}</td><td>{order.product}</td><td className="text-center">{order.qty}</td><td className="text-right">{formatCurrency(order.sellingPrice)}</td><td className="text-right">{formatCurrency(order.sellingPrice * order.qty)}</td></tr></tbody>
          </table>
        </div>
      )}

      {tab === 'inventory' && inv && (
        <div className="space-y-4">
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            <p className="font-semibold">Reservation rule</p>
            <p className="mt-1">Reserved inventory cannot be allocated to another active order. Free = India Available − Reserved.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-4">
            <div className="rounded-lg border border-border bg-panel p-3"><p className="text-xs text-slate-500">Available (physical)</p><p className="text-xl font-semibold">{inv.indiaAvailable}</p></div>
            <div className="rounded-lg border border-border bg-panel p-3"><p className="text-xs text-slate-500">Reserved</p><p className="text-xl font-semibold text-amber-600">{inv.reserved}</p></div>
            <div className="rounded-lg border border-border bg-panel p-3"><p className="text-xs text-slate-500">Free</p><p className="text-xl font-semibold text-emerald-600">{inv.indiaAvailable - inv.reserved}</p></div>
            <div className="rounded-lg border border-border bg-panel p-3"><p className="text-xs text-slate-500">USA Available</p><p className="text-xl font-semibold">{order.usaReceiptConfirmed ? inv.usa : `${inv.usa} (not from this order yet)`}</p></div>
          </div>
          <p className="text-xs text-slate-500">USA inventory becomes Available only after physical USA receipt is confirmed.</p>
        </div>
      )}

      {tab === 'warehouse' && (
        <div className="rounded-lg border border-border bg-panel p-4 text-sm space-y-2">
          <p><span className="text-slate-500">Warehouse:</span> {order.warehouse || '—'}</p>
          <p><span className="text-slate-500">Bin:</span> {order.bin || '—'}</p>
          <p><span className="text-slate-500">Operator:</span> Amit Singh</p>
          <p><span className="text-slate-500">Packing proof:</span> {order.packingProof || 'Not uploaded'}</p>
          <Link to="/warehouse/pick-pack" className="btn-secondary mt-2 inline-flex">Open Pick & Pack</Link>
        </div>
      )}

      {tab === 'shipment' && (
        <div className="rounded-lg border border-border bg-panel p-4 text-sm space-y-2">
          <p><span className="text-slate-500">Status:</span> {order.shipmentStatus}</p>
          <p><span className="text-slate-500">Courier:</span> {order.courier?.provider || '—'}</p>
          <p><span className="text-slate-500">AWB:</span> {order.awb || '—'}</p>
          <p><span className="text-slate-500">QR:</span> {order.qrReference || '—'}</p>
          {order.courier?.lastMile && (
            <p><span className="text-slate-500">Last-mile:</span> {order.courier.lastMile.provider} · {order.courier.lastMile.awb}</p>
          )}
          <div className="mt-3 rounded-md border border-violet-200 bg-violet-50 p-3 text-xs text-violet-900">
            Courier API Automation — Planned / Pending Provider Integration. Current flow uses external India courier portal + manual reference mapping.
          </div>
          <Link to="/shipments/SHP-1001" className="btn-secondary mt-2 inline-flex">Open Shipment</Link>
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
          {!state.exportDocuments.some((d) => d.shipment === 'SHP-1001' || d.documentNumber.includes('1001')) && (
            <p className="text-sm text-slate-500">Documents generate as the order advances through packing and dispatch.</p>
          )}
        </div>
      )}

      {tab === 'finance' && (
        <div className="rounded-lg border border-border bg-panel p-4">
          <h3 className="text-sm font-semibold mb-3">Cost Breakdown {order.actualCostsReady ? '(Actual)' : '(Estimated)'}</h3>
          <dl className="space-y-1 text-sm">
            <div className="flex justify-between font-medium"><dt>Selling Revenue</dt><dd>{formatCurrency(order.sellingPrice)}</dd></div>
            {Object.entries(costs).map(([k, v]) => (
              <div key={k} className="flex justify-between text-slate-600"><dt className="capitalize">{k.replace(/([A-Z])/g, ' $1')}</dt><dd>{formatCurrency(v)}</dd></div>
            ))}
            <div className="flex justify-between border-t border-border pt-2 font-semibold"><dt>Total Cost</dt><dd>{formatCurrency(totalCost)}</dd></div>
            <div className="flex justify-between text-emerald-700 font-semibold"><dt>Gross Profit</dt><dd>{formatCurrency(profit)}</dd></div>
            <div className="flex justify-between"><dt>Margin</dt><dd>{formatPercent(margin)}</dd></div>
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
          <div className="rounded-lg border border-border bg-panel p-4">
            <h3 className="text-sm font-semibold">Client Profitability Story</h3>
            <p className="mt-3 text-sm text-slate-600">Customer pays <strong>{formatCurrency(order.sellingPrice)}</strong>.</p>
            <p className="mt-2 text-sm text-slate-600">System tracks manufacturing, packing, freight, courier, warehouse and marketplace fees.</p>
            <p className="mt-2 text-sm">Final Cost: <strong>{formatCurrency(totalCost)}</strong></p>
            <p className="mt-1 text-sm text-emerald-700">Profit: <strong>{formatCurrency(profit)}</strong> · Margin: <strong>{formatPercent(margin)}</strong></p>
            {order.id === '1001' && (
              <p className="mt-3 text-xs text-slate-500">Target demo: Revenue ₹20,000 → Cost ₹13,650 → Profit ₹6,350 (31.75%) when actual costs are applied at delivery.</p>
            )}
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
              {!order.auditLog?.length && <tr><td colSpan={5} className="px-3 py-6 text-center text-slate-500">No audit entries</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'workflow' && order.demoWorkflow && (
        <div className="space-y-4">
          <div className="rounded-lg border border-border bg-panel p-4">
            <h3 className="text-sm font-semibold mb-2">Interactive End-to-End Demo</h3>
            <p className="text-sm text-slate-600 mb-4">Advance Order #1001 through the complete operational lifecycle. Each action updates local state and persists to localStorage.</p>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { label: 'Import Order', done: true, note: 'Already imported from Amazon' },
                { label: 'Resolve SKU', action: 'resolveSku', min: 1 },
                { label: 'Allocate Inventory', action: 'allocateInventory', min: 2 },
                { label: 'Start Picking', action: 'startPicking', min: 3 },
                { label: 'Mark Picked', action: 'markPicked', min: 4 },
                { label: 'Enter Courier Reference', action: 'enterCourier', min: 5, open: () => setCourierOpen(true) },
                { label: 'Generate Label', action: 'generateLabel', min: 6 },
                { label: 'Print Label', action: 'printLabel', min: 7, extra: () => window.print() },
                { label: 'Upload Packing Proof', action: 'uploadProof', min: 8, payload: { proofName: 'packing-proof-1001.jpg' } },
                { label: 'Mark Packed', action: 'markPacked', min: 9 },
                { label: 'Dispatch from India', action: 'dispatchIndia', min: 10 },
                { label: 'Mark In Transit', action: 'markInTransit', min: 11 },
                { label: 'Confirm USA Receipt', action: 'confirmUsaReceipt', min: 12, open: () => setReceiptOpen(true) },
                { label: 'Create Shipment', action: 'createShipment', min: 13 },
                { label: 'Mark Delivered', action: 'markDelivered', min: 14 },
              ].map((btn) => {
                const enabled = btn.done || (step === btn.min) || (btn.min && step > btn.min);
                const isNext = step === btn.min;
                return (
                  <button
                    key={btn.label}
                    type="button"
                    disabled={btn.done ? false : step < btn.min}
                    className={`rounded-md border px-3 py-2 text-left text-sm ${
                      btn.done || step > btn.min
                        ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                        : isNext
                          ? 'border-accent bg-blue-50 text-navy-900'
                          : 'border-border bg-slate-50 text-slate-400'
                    }`}
                    onClick={() => {
                      if (btn.done) return;
                      if (btn.open) btn.open();
                      else {
                        run(btn.action, btn.payload);
                        btn.extra?.();
                        if (btn.action === 'generateLabel') setLabelOpen(true);
                      }
                    }}
                  >
                    <span className="font-medium">{btn.label}</span>
                    {btn.note && <span className="mt-0.5 block text-[11px]">{btn.note}</span>}
                    {!btn.done && step > btn.min && <span className="mt-0.5 block text-[11px]">Completed</span>}
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
        open={courierOpen}
        onClose={() => setCourierOpen(false)}
        title="Record Courier Reference"
        size="lg"
        footer={
          <>
            <button type="button" className="btn-secondary" onClick={() => setCourierOpen(false)}>Cancel</button>
            <button
              type="button"
              className="btn-primary"
              onClick={() => {
                run('enterCourier', courierForm);
                setCourierOpen(false);
              }}
            >
              Save Courier Reference
            </button>
          </>
        }
      >
        <p className="mb-3 text-xs text-slate-500">Operator uses the India courier provider portal externally, then maps the reference here. No live courier API.</p>
        <div className="grid gap-3 sm:grid-cols-2">
          {Object.entries(courierForm).map(([k, v]) => (
            <div key={k}>
              <label className="label-field capitalize">{k.replace(/([A-Z])/g, ' $1')}</label>
              <input className="input-field" value={v} onChange={(e) => setCourierForm({ ...courierForm, [k]: e.target.value })} />
            </div>
          ))}
        </div>
      </Modal>

      <Modal
        open={receiptOpen}
        onClose={() => setReceiptOpen(false)}
        title="Confirm USA Receipt"
        footer={
          <>
            <button type="button" className="btn-secondary" onClick={() => setReceiptOpen(false)}>Cancel</button>
            <button
              type="button"
              className="btn-primary"
              onClick={() => {
                run('confirmUsaReceipt', receiptForm);
                setReceiptOpen(false);
              }}
            >
              Confirm Receipt
            </button>
          </>
        }
      >
        <p className="mb-3 text-sm text-slate-600">USA stock becomes Available only after confirmation. Expected qty: 1</p>
        <div className="space-y-3">
          <div>
            <label className="label-field">Received Qty</label>
            <input type="number" className="input-field" value={receiptForm.receivedQty} onChange={(e) => setReceiptForm({ ...receiptForm, receivedQty: Number(e.target.value) })} />
          </div>
          <div>
            <label className="label-field">Condition</label>
            <select className="input-field" value={receiptForm.condition} onChange={(e) => setReceiptForm({ ...receiptForm, condition: e.target.value })}>
              <option>Good</option>
              <option>Damaged</option>
            </select>
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
              <p className="text-xs text-slate-500">Internal packing / shipping label</p>
            </div>
            <div className="text-right text-sm">
              <p className="font-semibold">{order.orderNumber}</p>
              <p>{order.awb || 'AWB pending'}</p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs font-semibold uppercase text-slate-500">Ship To</p>
              <p className="font-medium">{order.shipTo?.name}</p>
              <p>{order.shipTo?.line1}</p>
              <p>{order.shipTo?.city}, {order.shipTo?.state} {order.shipTo?.zip}</p>
              <p>{order.shipTo?.country}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase text-slate-500">Package</p>
              <p>SKU: {order.sku}</p>
              <p>{order.product}</p>
              <p>Qty: {order.qty}</p>
              <p>Warehouse: {order.warehouse}</p>
              <p>Courier: {order.courier?.provider || '—'}</p>
              <p>Package #: 1/1</p>
            </div>
          </div>
          <div className="mt-6 flex items-center justify-center gap-6">
            <div className="flex h-20 w-40 items-center justify-center border-2 border-slate-800 bg-slate-100 font-mono text-xs">||||| |||| |||||</div>
            <div className="flex h-20 w-20 items-center justify-center border-2 border-slate-800 bg-slate-100 text-[10px] text-center">QR<br />{order.qrReference || 'PENDING'}</div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
