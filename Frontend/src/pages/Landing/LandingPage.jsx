import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight, Check, Menu, Boxes, PieChart, Shield, X,
  Building2, Factory, Store, FileText, ShoppingCart, Warehouse,
} from 'lucide-react';
import { useSaas } from '../../context/SaasContext';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency } from '../../utils/format';
import Modal from '../../components/common/Modal';

const FEATURES = [
  {
    icon: ShoppingCart,
    title: 'Multichannel Orders',
    text: 'Manage Amazon, Etsy, Shopify, Walmart and direct B2B orders in one place. Display availability for each integration.',
  },
  {
    icon: Boxes,
    title: 'Multi-Warehouse Inventory',
    text: 'Track India, USA and other warehouse stock. Allocate orders according to availability, delivery deadlines and shipping costs.',
  },
  {
    icon: Factory,
    title: 'Purchasing & Production',
    text: 'Manage supplier purchase orders, CAD approvals, manufacturing stages, contractor challans and QC.',
  },
  {
    icon: Warehouse,
    title: 'Warehouse & Shipping',
    text: 'Scan, pick, pack, capture final weight and dimensions, print labels and track delivery.',
  },
  {
    icon: PieChart,
    title: 'Landed Cost & Profitability',
    text: 'Track purchase or manufacturing costs, freight, duties, marketplace fees, returns and actual profit per rug.',
  },
  {
    icon: FileText,
    title: 'Export Documents & eBRC',
    text: 'Track invoices, Shipping Bills, bank receipts, eBRC generation and verification, EDPMS closure, RoDTEP and Duty Drawback.',
  },
];

const PERSONAS = [
  {
    title: 'RugOS Seller',
    text: 'USA inventory, sales channels, fulfillment and profitability.',
    icon: Store,
  },
  {
    title: 'RugOS Importer',
    text: 'Seller features plus purchasing, supplier updates, international shipments and landed costs.',
    icon: Building2,
  },
  {
    title: 'RugOS Manufacturer',
    text: 'Indian production, export documentation, realization and incentive tracking.',
    icon: Factory,
  },
];

/** Silent sample-data launches — credentials never shown on the page */
const DEMO_LAUNCHES = [
  {
    key: 'importer',
    title: 'Importer & Seller Demo',
    subtitle: 'USA inventory, marketplace orders, fulfillment, purchasing and landed costs.',
    email: 'admin@rugos.demo',
    password: 'demo123',
    redirectHint: '/dashboard',
    icon: Building2,
    ring: 'hover:border-teal-500 hover:shadow-teal-900/5',
    badge: 'bg-teal-50 text-teal-800',
  },
  {
    key: 'manufacturer',
    title: 'Manufacturer & Exporter Demo',
    subtitle: 'Indian production, export docs, eBRC / realization and incentive tracking.',
    email: 'admin@rugos.demo',
    password: 'demo123',
    redirectHint: '/dashboard',
    icon: Factory,
    ring: 'hover:border-sky-500 hover:shadow-sky-900/5',
    badge: 'bg-sky-50 text-sky-800',
  },
];

const BUSINESS_TYPES = [
  'Seller',
  'Importer',
  'Manufacturer',
  'Importer & Seller',
  'Manufacturer & Exporter',
  'Other',
];

const FLOW_STEPS = [
  {
    title: 'Inventory: USA → India → Make',
    text: 'Allocate USA stock, India stock or made-to-order production—according to the destination and delivery deadline.',
  },
  {
    title: 'QC · Pick · Pack · Weigh · Label',
    text: 'Scan, pick, pack, capture final weight and dimensions, then print labels.',
  },
  {
    title: 'Ship · Track · Reconcile',
    text: 'Ship, track delivery, and lock costs & profit. Actual freight bills, fees and returns can arrive later.',
  },
];

export default function LandingPage() {
  const { plans, requestSubscription, requestDemo } = useSaas();
  const { login, isAuthenticated, isPlatformAdmin } = useAuth();
  const navigate = useNavigate();
  const [cycle, setCycle] = useState('monthly');
  const [buyOpen, setBuyOpen] = useState(null);
  const [form, setForm] = useState({ companyName: '', contactName: '', email: '', phone: '' });
  const [submitted, setSubmitted] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const [demoForm, setDemoForm] = useState({
    companyName: '',
    email: '',
    country: '',
    businessType: '',
    phone: '',
    message: '',
  });
  const [demoSubmitted, setDemoSubmitted] = useState(false);
  const [demoError, setDemoError] = useState('');
  const [demoLoading, setDemoLoading] = useState(false);
  const [loginLoading, setLoginLoading] = useState(null);
  const [loginError, setLoginError] = useState('');

  const activePlans = useMemo(() => plans.filter((p) => p.active), [plans]);

  const openBuy = (plan) => {
    setBuyOpen(plan);
    setSubmitted(false);
    setForm({ companyName: '', contactName: '', email: '', phone: '' });
  };

  const submitBuy = async () => {
    if (!form.companyName || !form.contactName || !form.email) return;
    const res = await requestSubscription({
      ...form,
      planId: buyOpen.id,
      billingCycle: cycle,
    });
    if (res?.ok) setSubmitted(true);
  };

  const submitDemo = async (e) => {
    e.preventDefault();
    setDemoError('');
    setDemoLoading(true);
    const res = await requestDemo({
      ...demoForm,
      contactName: demoForm.companyName,
    });
    setDemoLoading(false);
    if (res?.ok) {
      setDemoSubmitted(true);
      setDemoForm({ companyName: '', email: '', country: '', businessType: '', phone: '', message: '' });
    } else {
      setDemoError(res?.error || 'Could not submit demo request');
    }
  };

  const launchDemo = async (account) => {
    setLoginError('');
    setLoginLoading(account.key);
    const res = await login(account.email, account.password);
    setLoginLoading(null);
    if (res?.ok) {
      navigate(account.redirectHint || res.redirectTo || '/dashboard');
    } else {
      setLoginError(res?.error || 'Could not launch demo');
    }
  };

  return (
    <div className="landing-root min-h-screen">
      {/* Nav */}
      <header className="sticky top-0 z-20 border-b border-[#d5dde6]/80 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-4 py-3 sm:px-6">
          <div className="min-w-0">
            <p className="landing-display text-xl font-semibold text-[#0f2744]">RugOS</p>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#0e7490]">ExportOS Platform</p>
          </div>
          <nav className="hidden items-center gap-6 text-sm font-medium text-[#5b6b7c] md:flex">
            <a href="#product" className="hover:text-[#0f2744]">Product</a>
            <a href="#demo" className="hover:text-[#0f2744]">Book a Demo</a>
            <a href="#pricing" className="hover:text-[#0f2744]">Pricing</a>
            <a href="#view-demo" className="hover:text-[#0f2744]">View Product Demo</a>
          </nav>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Link to="/login" className="rounded-lg px-2.5 py-1.5 text-sm font-medium text-[#0f2744] hover:bg-[#0f2744]/5 sm:px-3">
              Sign in
            </Link>
            <a
              href="#demo"
              className="hidden items-center gap-1 rounded-lg bg-[#0e7490] px-3 py-1.5 text-sm font-semibold text-white shadow-sm shadow-teal-900/10 hover:bg-[#0f5f6e] sm:inline-flex"
            >
              Book a Demo <ArrowRight size={14} />
            </a>
            <button
              type="button"
              className="rounded-lg p-2 text-[#0f2744] hover:bg-[#0f2744]/5 md:hidden"
              onClick={() => setNavOpen((v) => !v)}
              aria-expanded={navOpen}
              aria-label={navOpen ? 'Close menu' : 'Open menu'}
            >
              {navOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
        {navOpen && (
          <nav className="border-t border-[#d5dde6] bg-white px-4 py-3 md:hidden">
            <ul className="space-y-1 text-sm font-medium text-[#0f2744]">
              {[
                { href: '#product', label: 'Product' },
                { href: '#demo', label: 'Book a Demo' },
                { href: '#pricing', label: 'Pricing' },
                { href: '#view-demo', label: 'View Product Demo' },
              ].map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="block rounded-lg px-3 py-2.5 hover:bg-[#e8f4f8]" onClick={() => setNavOpen(false)}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            backgroundImage:
              'linear-gradient(rgba(15,39,68,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(15,39,68,0.04) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
            maskImage: 'linear-gradient(180deg, black 40%, transparent 95%)',
          }}
        />
        <div className="relative mx-auto max-w-6xl px-4 pb-16 pt-14 sm:px-6 sm:pt-20 lg:pb-24 lg:pt-24">
          <div className="max-w-3xl">
            <p className="landing-fade-up text-xs font-semibold uppercase tracking-[0.22em] text-[#0e7490]">
              Software for Rug Importers, Sellers & Manufacturers
            </p>
            <h1 className="landing-display landing-fade-up-delay mt-4 text-4xl font-semibold leading-[1.05] text-[#0f2744] sm:text-5xl lg:text-6xl">
              RugOS / ExportOS
            </h1>
            <p className="landing-fade-up-delay-2 mt-5 max-w-xl text-base leading-relaxed text-[#5b6b7c] sm:text-lg">
              Built for India → USA rug operations. Connect Indian suppliers, USA warehouses and your sales channels.
            </p>
            <div className="landing-fade-up-delay-2 mt-9 flex flex-wrap gap-3">
              <a
                href="#view-demo"
                className="inline-flex items-center gap-2 rounded-lg bg-[#0e7490] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-teal-900/15 transition hover:-translate-y-0.5 hover:bg-[#0f5f6e]"
              >
                View Product Demo <ArrowRight size={16} />
              </a>
              <a
                href="#demo"
                className="inline-flex items-center gap-2 rounded-lg border border-[#d5dde6] bg-white/80 px-5 py-3 text-sm font-semibold text-[#0f2744] shadow-sm transition hover:-translate-y-0.5 hover:border-[#0e7490]/40"
              >
                Book a Demo
              </a>
            </div>
          </div>

          <div className="landing-float mt-14 max-w-xl rounded-2xl border border-white/70 bg-white/70 p-5 shadow-[0_20px_50px_-24px_rgba(15,39,68,0.35)] backdrop-blur-sm sm:p-6 lg:absolute lg:right-6 lg:top-24 lg:mt-0 lg:w-[min(100%,22rem)]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#0e7490]">Operating flow</p>
            <ol className="mt-4 space-y-4">
              {FLOW_STEPS.map((step, i) => (
                <li key={step.title} className="flex gap-3 text-sm text-[#0f2744]">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#e8f4f8] text-xs font-bold text-[#0e7490]">
                    {i + 1}
                  </span>
                  <span>
                    <span className="block font-semibold leading-snug">{step.title}</span>
                    <span className="mt-0.5 block text-xs leading-relaxed text-[#5b6b7c]">{step.text}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Personas */}
      <section className="border-t border-[#d5dde6]/80 bg-white/40">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <div className="grid gap-4 md:grid-cols-3">
            {PERSONAS.map((p) => (
              <div key={p.title} className="rounded-2xl border border-[#d5dde6] bg-white p-5 shadow-sm">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#e8f4f8] text-[#0e7490]">
                  <p.icon size={20} />
                </span>
                <h3 className="mt-3 text-base font-semibold text-[#0f2744]">{p.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-[#5b6b7c]">{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* View Product Demo */}
      <section id="view-demo" className="border-t border-[#d5dde6]/80 bg-white/50">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <h2 className="landing-display text-3xl font-semibold text-[#0f2744] sm:text-4xl">
            Explore RugOS — Live Product Demo
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-[#5b6b7c]">
            Use <strong className="font-semibold text-[#0f2744]">View Product Demo</strong> for visitors and{' '}
            <strong className="font-semibold text-[#0f2744]">Sign in</strong> for existing customers.
            Launch opens a sample-data account — no password shown here.
          </p>
          {isAuthenticated && (
            <p className="mt-3 text-sm text-teal-700">
              You are already signed in.{' '}
              <Link to={isPlatformAdmin ? '/superadmin/buyers' : '/dashboard'} className="font-semibold underline">
                Open app →
              </Link>
            </p>
          )}
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {DEMO_LAUNCHES.map((account) => (
              <button
                key={account.key}
                type="button"
                disabled={!!loginLoading}
                onClick={() => launchDemo(account)}
                className={`group flex items-start gap-4 rounded-2xl border border-[#d5dde6] bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md disabled:opacity-60 ${account.ring}`}
              >
                <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${account.badge}`}>
                  <account.icon size={22} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-base font-semibold text-[#0f2744]">{account.title}</span>
                  <span className="mt-0.5 block text-sm text-[#5b6b7c]">{account.subtitle}</span>
                  <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-[#0e7490] group-hover:gap-2">
                    {loginLoading === account.key ? 'Launching…' : 'Launch Demo'} <ArrowRight size={14} />
                  </span>
                </span>
              </button>
            ))}
          </div>
          {loginError && <p className="mt-3 text-sm text-red-600">{loginError}</p>}
          <p className="mt-5 text-sm text-[#5b6b7c]">
            Already a customer?{' '}
            <Link to="/login" className="font-semibold text-[#0e7490] hover:underline">Sign in →</Link>
          </p>
        </div>
      </section>

      {/* Book a Personalized Demo */}
      <section id="demo" className="border-t border-[#d5dde6]/80">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-start">
          <div>
            <h2 className="landing-display text-3xl font-semibold text-[#0f2744] sm:text-4xl">Book a Personalized Demo</h2>
            <p className="mt-3 text-sm leading-relaxed text-[#5b6b7c]">
              Tell us about your business. We will schedule a walkthrough tailored to Seller, Importer or Manufacturer workflows.
            </p>
            <ul className="mt-8 space-y-3 text-sm text-[#0f2744]">
              {[
                'Live walkthrough of orders → inventory → ship → profit',
                'Seller, Importer or Manufacturer path discussion',
                'No payment required to book',
              ].map((item) => (
                <li key={item} className="flex gap-2.5">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal-100 text-teal-700">
                    <Check size={12} strokeWidth={3} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-[#d5dde6] bg-white p-5 shadow-[0_16px_40px_-28px_rgba(15,39,68,0.4)] sm:p-7">
            {demoSubmitted ? (
              <div className="space-y-3 py-8 text-center">
                <p className="landing-display text-2xl font-semibold text-teal-700">Request received</p>
                <p className="text-sm text-[#5b6b7c]">Our team will contact you to schedule your personalized demo.</p>
                <button
                  type="button"
                  className="mt-2 rounded-lg border border-[#d5dde6] px-4 py-2 text-sm font-medium text-[#0f2744] hover:bg-[#e8f4f8]"
                  onClick={() => setDemoSubmitted(false)}
                >
                  Submit another
                </button>
              </div>
            ) : (
              <form onSubmit={submitDemo} className="space-y-3.5">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-[#5b6b7c]" htmlFor="demo-company">Company name *</label>
                  <input
                    id="demo-company"
                    required
                    className="landing-input"
                    value={demoForm.companyName}
                    onChange={(e) => setDemoForm({ ...demoForm, companyName: e.target.value })}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-[#5b6b7c]" htmlFor="demo-email">Work email *</label>
                  <input
                    id="demo-email"
                    type="email"
                    required
                    className="landing-input"
                    value={demoForm.email}
                    onChange={(e) => setDemoForm({ ...demoForm, email: e.target.value })}
                  />
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-[#5b6b7c]" htmlFor="demo-country">Country *</label>
                    <input
                      id="demo-country"
                      required
                      className="landing-input"
                      placeholder="e.g. India, USA"
                      value={demoForm.country}
                      onChange={(e) => setDemoForm({ ...demoForm, country: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-[#5b6b7c]" htmlFor="demo-type">Business type *</label>
                    <select
                      id="demo-type"
                      required
                      className="landing-input"
                      value={demoForm.businessType}
                      onChange={(e) => setDemoForm({ ...demoForm, businessType: e.target.value })}
                    >
                      <option value="">Select…</option>
                      {BUSINESS_TYPES.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-[#5b6b7c]" htmlFor="demo-phone">Phone</label>
                  <input
                    id="demo-phone"
                    className="landing-input"
                    value={demoForm.phone}
                    onChange={(e) => setDemoForm({ ...demoForm, phone: e.target.value })}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-[#5b6b7c]" htmlFor="demo-message">What should we focus on?</label>
                  <textarea
                    id="demo-message"
                    rows={3}
                    className="landing-input"
                    placeholder="e.g. Marketplace orders, production, export docs, profitability…"
                    value={demoForm.message}
                    onChange={(e) => setDemoForm({ ...demoForm, message: e.target.value })}
                  />
                </div>
                {demoError && <p className="text-sm text-red-600">{demoError}</p>}
                <button
                  type="submit"
                  disabled={demoLoading}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#0e7490] py-3 text-sm font-semibold text-white shadow-md shadow-teal-900/10 hover:bg-[#0f5f6e] disabled:opacity-60"
                >
                  {demoLoading ? 'Submitting…' : 'Book a Demo'} <ArrowRight size={16} />
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Product features */}
      <section id="product" className="border-t border-[#d5dde6]/80 bg-white/60">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="landing-display text-3xl font-semibold text-[#0f2744] sm:text-4xl">What the product does</h2>
          <p className="mt-3 max-w-2xl text-sm text-[#5b6b7c]">
            One platform for sellers, importers and manufacturers — from multichannel orders to export realization.
          </p>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="rounded-2xl border border-transparent bg-gradient-to-br from-white to-[#f4fafb] p-6 shadow-[inset_0_0_0_1px_#d5dde6] transition hover:shadow-[inset_0_0_0_1px_#0e749055]"
              >
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#e8f4f8] text-[#0e7490]">
                  <f.icon size={20} />
                </span>
                <h3 className="mt-4 text-lg font-semibold text-[#0f2744]">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#5b6b7c]">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modes */}
      <section id="modes" className="border-t border-[#d5dde6]/80">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="landing-display text-3xl font-semibold text-[#0f2744] sm:text-4xl">Built for both sides of the trade</h2>
          <p className="mt-3 max-w-2xl text-sm text-[#5b6b7c]">
            Choose the path that matches your business. Activation assigns Export or Import mode for the company.
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">Manufacturers & Exporters</p>
              <h3 className="landing-display mt-2 text-2xl font-semibold text-[#0f2744]">India → world</h3>
              <p className="mt-2 text-sm text-[#5b6b7c]">
                Manage production, India inventory, international orders, export shipments, payment realization, eBRC, EDPMS, RoDTEP and Duty Drawback.
              </p>
            </div>
            <div className="rounded-2xl border border-sky-200 bg-sky-50/70 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-700">Importers & Sellers</p>
              <h3 className="landing-display mt-2 text-2xl font-semibold text-[#0f2744]">Inbound → marketplace</h3>
              <p className="mt-2 text-sm text-[#5b6b7c]">
                Manage supplier purchases, inbound shipments, landed costs, USA warehouses, marketplace orders, domestic fulfillment, returns and profitability.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="border-t border-[#d5dde6]/80 bg-white/60">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h2 className="landing-display text-3xl font-semibold text-[#0f2744] sm:text-4xl">Pricing</h2>
              <p className="mt-2 text-sm text-[#5b6b7c]">Plans for growing rug operations. Checkout creates a pending activation.</p>
            </div>
            <div className="flex rounded-xl border border-[#d5dde6] bg-white p-1 text-sm shadow-sm">
              <button
                type="button"
                onClick={() => setCycle('monthly')}
                className={`rounded-lg px-3.5 py-1.5 font-medium ${cycle === 'monthly' ? 'bg-[#0e7490] text-white' : 'text-[#5b6b7c]'}`}
              >
                Monthly
              </button>
              <button
                type="button"
                onClick={() => setCycle('yearly')}
                className={`rounded-lg px-3.5 py-1.5 font-medium ${cycle === 'yearly' ? 'bg-[#0e7490] text-white' : 'text-[#5b6b7c]'}`}
              >
                Yearly <span className="ml-1 text-[10px] text-emerald-600">save ~17%</span>
              </button>
            </div>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {activePlans.map((plan) => {
              const price = cycle === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice;
              return (
                <div
                  key={plan.id}
                  className={`flex flex-col rounded-2xl border bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
                    plan.popular ? 'border-[#0e7490] ring-2 ring-[#0e7490]/20' : 'border-[#d5dde6]'
                  }`}
                >
                  {plan.popular && (
                    <span className="mb-2 w-fit rounded-full bg-[#0e7490] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                      Most popular
                    </span>
                  )}
                  <h3 className="text-lg font-semibold text-[#0f2744]">{plan.name}</h3>
                  <p className="mt-1 text-sm text-[#5b6b7c]">{plan.description}</p>
                  <p className="mt-5">
                    <span className="landing-display text-3xl font-semibold tabular-nums text-[#0f2744]">{formatCurrency(price)}</span>
                    <span className="text-sm text-[#5b6b7c]">/{cycle === 'yearly' ? 'year' : 'month'}</span>
                  </p>
                  <ul className="mt-5 flex-1 space-y-2.5 text-sm text-[#0f2744]">
                    {plan.features.map((f) => (
                      <li key={f} className="flex gap-2">
                        <Check size={16} className="mt-0.5 shrink-0 text-teal-600" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <button
                    type="button"
                    onClick={() => openBuy(plan)}
                    className="mt-6 w-full rounded-lg bg-[#0e7490] py-2.5 text-sm font-semibold text-white hover:bg-[#0f5f6e]"
                  >
                    Choose {plan.name}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Trust */}
      <section className="border-t border-[#d5dde6]/80">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-12 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-xl bg-[#e8f4f8] text-[#0e7490]">
              <Shield size={18} />
            </span>
            <div>
              <p className="font-semibold text-[#0f2744]">Guided activation</p>
              <p className="text-sm text-[#5b6b7c]">New purchases stay pending until your company mode is activated.</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-4 text-sm font-semibold text-[#0e7490]">
            <a href="#view-demo" className="hover:underline">View Product Demo →</a>
            <Link to="/login" className="hover:underline">Already a customer? Sign in →</Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-[#d5dde6] bg-white/70 py-6 text-center text-xs text-[#5b6b7c]">
        © {new Date().getFullYear()} RugOS / ExportOS · Software for rug importers, sellers & manufacturers
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
          <div className="space-y-2 text-sm text-slate-700">
            <p>Your subscription request is <strong>Pending Approval</strong>.</p>
            <p>We will activate the account and assign the right operating mode for your business.</p>
            <p className="text-xs text-slate-500">No real payment was charged.</p>
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
