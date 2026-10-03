import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, Package, Ship, Boxes, PieChart, Shield } from 'lucide-react';
import { useSaas } from '../../context/SaasContext';
import { formatCurrency } from '../../utils/format';
import Modal from '../../components/common/Modal';

const FEATURES = [
  {
    icon: Package,
    title: 'Commerce & orders',
    text: 'Normalize Amazon, Etsy and Walmart orders, map SKUs, and run fulfilment without spreadsheet chaos.',
  },
  {
    icon: Boxes,
    title: 'USA-first inventory',
    text: 'Check USA stock first, fall back to India, or create Make-to-Order when both are empty.',
  },
  {
    icon: Ship,
    title: 'Warehouse to customer',
    text: 'Pick, weigh with photo & dimensions, generate internal labels, and ship — even before courier API.',
  },
  {
    icon: PieChart,
    title: 'True cost & profit',
    text: 'See manufacturing, freight, fees and margin on every order so leadership trusts the numbers.',
  },
];

export default function LandingPage() {
  const { plans, requestSubscription } = useSaas();
  const [cycle, setCycle] = useState('monthly');
  const [buyOpen, setBuyOpen] = useState(null);
  const [form, setForm] = useState({ companyName: '', contactName: '', email: '', phone: '' });
  const [submitted, setSubmitted] = useState(false);

  const activePlans = useMemo(() => plans.filter((p) => p.active), [plans]);

  const openBuy = (plan) => {
    setBuyOpen(plan);
    setSubmitted(false);
    setForm({ companyName: '', contactName: '', email: '', phone: '' });
  };

  const submitBuy = () => {
    if (!form.companyName || !form.contactName || !form.email) return;
    const res = requestSubscription({
      ...form,
      planId: buyOpen.id,
      billingCycle: cycle,
    });
    if (res.ok) setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#0b1220] text-white">
      {/* Nav */}
      <header className="sticky top-0 z-20 border-b border-white/10 bg-[#0b1220]/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <div>
            <p className="text-lg font-bold tracking-tight">RugOS</p>
            <p className="text-[10px] uppercase tracking-[0.18em] text-slate-400">ExportOS Platform</p>
          </div>
          <nav className="hidden items-center gap-6 text-sm text-slate-300 md:flex">
            <a href="#product" className="hover:text-white">Product</a>
            <a href="#modes" className="hover:text-white">Import / Export</a>
            <a href="#pricing" className="hover:text-white">Pricing</a>
          </nav>
          <div className="flex items-center gap-2">
            <Link to="/login" className="rounded-md px-3 py-1.5 text-sm text-slate-200 hover:bg-white/10">Sign in</Link>
            <a href="#pricing" className="inline-flex items-center gap-1 rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium hover:bg-blue-500">
              View pricing <ArrowRight size={14} />
            </a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            background:
              'radial-gradient(ellipse 80% 60% at 70% 20%, #1e3a5f 0%, transparent 55%), linear-gradient(180deg, #0b1220 0%, #111827 100%)',
          }}
        />
        <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:py-24">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-300">SaaS for rug commerce ops</p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl lg:text-[3.25rem] lg:leading-[1.1]">
              RugOS / ExportOS
            </h1>
            <p className="mt-4 max-w-xl text-base text-slate-300 sm:text-lg">
              One platform for marketplace orders, inventory, warehouse, shipping labels, export documents,
              receivables and true profitability — built for India-to-USA rug operations.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#pricing" className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold hover:bg-blue-500">
                Start with a plan <ArrowRight size={16} />
              </a>
              <Link to="/login" className="inline-flex items-center gap-2 rounded-md border border-white/20 px-4 py-2.5 text-sm font-medium text-slate-100 hover:bg-white/5">
                Open demo login
              </Link>
            </div>
            <p className="mt-4 text-xs text-slate-500">Demo environment · Static prototype · No live payments</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-5 shadow-2xl backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Operating flow</p>
            <ol className="mt-4 space-y-3 text-sm text-slate-200">
              {[
                'Marketplace order lands in RugOS',
                'Inventory: USA → India → Make (MTO)',
                'Pick · Weigh (photo + dimensions) · Label',
                'Ship to customer · cost & profit locked',
              ].map((step, i) => (
                <li key={step} className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-blue-600/30 text-xs font-bold text-blue-200">{i + 1}</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Product */}
      <section id="product" className="border-t border-white/10 bg-[#111827]">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">What the product does</h2>
          <p className="mt-2 max-w-2xl text-sm text-slate-400">
            Modules stay the same whether you run Import or Export — Superadmin assigns exactly one mode per company.
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {FEATURES.map((f) => (
              <div key={f.title} className="rounded-lg border border-white/10 bg-[#0b1220]/60 p-5">
                <f.icon size={20} className="text-blue-400" />
                <h3 className="mt-3 text-base font-semibold">{f.title}</h3>
                <p className="mt-1.5 text-sm text-slate-400">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modes */}
      <section id="modes" className="border-t border-white/10">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">One subscription. One mode.</h2>
          <p className="mt-2 max-w-2xl text-sm text-slate-400">
            Same modules for both. When Superadmin activates a purchase, they choose <strong className="text-slate-200">Export</strong> or <strong className="text-slate-200">Import</strong>. A company cannot use both at once.
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-emerald-300">Export mode</p>
              <h3 className="mt-2 text-xl font-semibold">India → world selling</h3>
              <p className="mt-2 text-sm text-slate-400">
                Marketplace selling, India warehouse, replenishment to USA, export docs, EBRC/FIRA, and landed profitability.
              </p>
            </div>
            <div className="rounded-lg border border-sky-500/30 bg-sky-500/5 p-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-sky-300">Import mode</p>
              <h3 className="mt-2 text-xl font-semibold">Inbound / receiving ops</h3>
              <p className="mt-2 text-sm text-slate-400">
                Same operational stack focused on receiving, USA inventory, inbound reconciliation and domestic fulfilment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="border-t border-white/10 bg-[#111827]">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Pricing</h2>
              <p className="mt-2 text-sm text-slate-400">Managed by Superadmin. Demo checkout creates a pending activation.</p>
            </div>
            <div className="flex rounded-md border border-white/15 p-1 text-sm">
              <button type="button" onClick={() => setCycle('monthly')} className={`rounded px-3 py-1.5 ${cycle === 'monthly' ? 'bg-blue-600 text-white' : 'text-slate-300'}`}>Monthly</button>
              <button type="button" onClick={() => setCycle('yearly')} className={`rounded px-3 py-1.5 ${cycle === 'yearly' ? 'bg-blue-600 text-white' : 'text-slate-300'}`}>
                Yearly <span className="ml-1 text-[10px] text-emerald-300">save ~17%</span>
              </button>
            </div>
          </div>

          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            {activePlans.map((plan) => {
              const price = cycle === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice;
              return (
                <div
                  key={plan.id}
                  className={`flex flex-col rounded-xl border p-5 ${
                    plan.popular ? 'border-blue-400 bg-[#0b1220] shadow-lg shadow-blue-900/20' : 'border-white/10 bg-[#0b1220]/50'
                  }`}
                >
                  {plan.popular && (
                    <span className="mb-2 w-fit rounded bg-blue-600 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide">Most popular</span>
                  )}
                  <h3 className="text-lg font-semibold">{plan.name}</h3>
                  <p className="mt-1 text-sm text-slate-400">{plan.description}</p>
                  <p className="mt-5">
                    <span className="text-3xl font-bold tabular-nums">{formatCurrency(price)}</span>
                    <span className="text-sm text-slate-400">/{cycle === 'yearly' ? 'year' : 'month'}</span>
                  </p>
                  <ul className="mt-5 flex-1 space-y-2 text-sm text-slate-300">
                    {plan.features.map((f) => (
                      <li key={f} className="flex gap-2">
                        <Check size={16} className="mt-0.5 shrink-0 text-emerald-400" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <button type="button" onClick={() => openBuy(plan)} className="mt-6 w-full rounded-md bg-blue-600 py-2.5 text-sm font-semibold hover:bg-blue-500">
                    Choose {plan.name}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Trust */}
      <section className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-12 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="flex items-start gap-3">
            <Shield size={20} className="mt-0.5 text-slate-400" />
            <div>
              <p className="font-semibold">Superadmin controlled activation</p>
              <p className="text-sm text-slate-400">New purchases stay pending until Superadmin sets Import or Export and activates the company.</p>
            </div>
          </div>
          <Link to="/login" className="text-sm font-medium text-blue-300 hover:text-blue-200">Superadmin / tenant sign in →</Link>
        </div>
      </section>

      <footer className="border-t border-white/10 py-6 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} RugOS / ExportOS · Demo SaaS prototype
      </footer>

      <Modal
        open={!!buyOpen}
        onClose={() => setBuyOpen(null)}
        title={submitted ? 'Request received' : `Subscribe · ${buyOpen?.name}`}
        footer={
          submitted ? (
            <button type="button" className="btn-primary" onClick={() => setBuyOpen(null)}>Close</button>
          ) : (
            <>
              <button type="button" className="btn-secondary" onClick={() => setBuyOpen(null)}>Cancel</button>
              <button type="button" className="btn-primary" onClick={submitBuy}>Submit purchase request</button>
            </>
          )
        }
      >
        {submitted ? (
          <div className="text-sm text-slate-700 space-y-2">
            <p>Your subscription request is <strong>Pending Approval</strong>.</p>
            <p>Platform Superadmin will activate the account and assign either <strong>Export</strong> or <strong>Import</strong> mode.</p>
            <p className="text-xs text-slate-500">Demo only — no real payment was charged.</p>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-slate-600">
              {buyOpen?.name} · {cycle} · {formatCurrency(cycle === 'yearly' ? buyOpen?.yearlyPrice : buyOpen?.monthlyPrice)}
            </p>
            <div>
              <label className="label-field" htmlFor="companyName">Company name</label>
              <input id="companyName" className="input-field" value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })} />
            </div>
            <div>
              <label className="label-field" htmlFor="contactName">Contact name</label>
              <input id="contactName" className="input-field" value={form.contactName} onChange={(e) => setForm({ ...form, contactName: e.target.value })} />
            </div>
            <div>
              <label className="label-field" htmlFor="email">Work email</label>
              <input id="email" type="email" className="input-field" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div>
              <label className="label-field" htmlFor="phone">Phone</label>
              <input id="phone" className="input-field" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
