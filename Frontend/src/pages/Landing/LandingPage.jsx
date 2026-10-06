import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Check, Menu, Package, Ship, Boxes, PieChart, Shield, X, Building2, Crown } from 'lucide-react';
import { useSaas } from '../../context/SaasContext';
import { useAuth } from '../../context/AuthContext';
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

const QUICK_LOGINS = [
  {
    key: 'owner',
    title: 'Product Owner',
    subtitle: 'Full app · Dashboard & ops',
    email: 'admin@rugos.demo',
    password: 'demo123',
    icon: Building2,
    ring: 'hover:border-teal-500 hover:shadow-teal-900/5',
    badge: 'bg-teal-50 text-teal-800',
  },
  {
    key: 'super',
    title: 'Superadmin',
    subtitle: 'Plans · Buyers · Access requests',
    email: 'superadmin@rugos.demo',
    password: 'demo123',
    icon: Crown,
    ring: 'hover:border-sky-500 hover:shadow-sky-900/5',
    badge: 'bg-sky-50 text-sky-800',
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
    contactName: '',
    email: '',
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
    const res = await requestDemo(demoForm);
    setDemoLoading(false);
    if (res?.ok) {
      setDemoSubmitted(true);
      setDemoForm({ companyName: '', contactName: '', email: '', phone: '', message: '' });
    } else {
      setDemoError(res?.error || 'Could not submit access request');
    }
  };

  const handleQuickLogin = async (account) => {
    setLoginError('');
    setLoginLoading(account.key);
    const res = await login(account.email, account.password);
    setLoginLoading(null);
    if (res?.ok) {
      navigate(res.redirectTo === '/superadmin' || account.key === 'super' ? '/superadmin/buyers' : res.redirectTo || '/dashboard');
    } else {
      setLoginError(res?.error || 'Login failed');
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
            <a href="#demo" className="hover:text-[#0f2744]">Request access</a>
            <a href="#pricing" className="hover:text-[#0f2744]">Pricing</a>
            <a href="#login" className="hover:text-[#0f2744]">Quick login</a>
          </nav>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Link to="/login" className="rounded-lg px-2.5 py-1.5 text-sm font-medium text-[#0f2744] hover:bg-[#0f2744]/5 sm:px-3">
              Sign in
            </Link>
            <a
              href="#demo"
              className="hidden items-center gap-1 rounded-lg bg-[#0e7490] px-3 py-1.5 text-sm font-semibold text-white shadow-sm shadow-teal-900/10 hover:bg-[#0f5f6e] sm:inline-flex"
            >
              Request access <ArrowRight size={14} />
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
                { href: '#demo', label: 'Request access' },
                { href: '#pricing', label: 'Pricing' },
                { href: '#login', label: 'Quick login' },
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

      {/* Hero — one composition */}
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
              SaaS for rug commerce ops
            </p>
            <h1 className="landing-display landing-fade-up-delay mt-4 text-4xl font-semibold leading-[1.05] text-[#0f2744] sm:text-5xl lg:text-6xl">
              RugOS / ExportOS
            </h1>
            <p className="landing-fade-up-delay-2 mt-5 max-w-xl text-base leading-relaxed text-[#5b6b7c] sm:text-lg">
              Marketplace orders, inventory, warehouse, shipping, export docs and true profitability —
              built for India → USA rug operations.
            </p>
            <div className="landing-fade-up-delay-2 mt-9 flex flex-wrap gap-3">
              <a
                href="#demo"
                className="inline-flex items-center gap-2 rounded-lg bg-[#0e7490] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-teal-900/15 transition hover:-translate-y-0.5 hover:bg-[#0f5f6e]"
              >
                Request access <ArrowRight size={16} />
              </a>
              <a
                href="#login"
                className="inline-flex items-center gap-2 rounded-lg border border-[#d5dde6] bg-white/80 px-5 py-3 text-sm font-semibold text-[#0f2744] shadow-sm transition hover:-translate-y-0.5 hover:border-[#0e7490]/40"
              >
                Quick login
              </a>
            </div>
          </div>

          <div className="landing-float mt-14 max-w-xl rounded-2xl border border-white/70 bg-white/70 p-5 shadow-[0_20px_50px_-24px_rgba(15,39,68,0.35)] backdrop-blur-sm sm:p-6 lg:absolute lg:right-6 lg:top-24 lg:mt-0 lg:w-[min(100%,22rem)]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#0e7490]">Operating flow</p>
            <ol className="mt-4 space-y-3.5">
              {[
                'Marketplace order lands in RugOS',
                'Inventory: USA → India → Make (MTO)',
                'Pick · Weigh · Label',
                'Ship · cost & profit locked',
              ].map((step, i) => (
                <li key={step} className="flex gap-3 text-sm text-[#0f2744]">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#e8f4f8] text-xs font-bold text-[#0e7490]">
                    {i + 1}
                  </span>
                  <span className="pt-1 leading-snug">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Quick login */}
      <section id="login" className="border-t border-[#d5dde6]/80 bg-white/50">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <h2 className="landing-display text-3xl font-semibold text-[#0f2744] sm:text-4xl">Quick login</h2>
          <p className="mt-2 max-w-2xl text-sm text-[#5b6b7c]">
            One click to explore. Password for both accounts: <span className="font-semibold text-[#0f2744]">demo123</span>
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
            {QUICK_LOGINS.map((account) => (
              <button
                key={account.key}
                type="button"
                disabled={!!loginLoading}
                onClick={() => handleQuickLogin(account)}
                className={`group flex items-start gap-4 rounded-2xl border border-[#d5dde6] bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md disabled:opacity-60 ${account.ring}`}
              >
                <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${account.badge}`}>
                  <account.icon size={22} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-base font-semibold text-[#0f2744]">{account.title}</span>
                  <span className="mt-0.5 block text-sm text-[#5b6b7c]">{account.subtitle}</span>
                  <span className="mt-2 block truncate text-xs text-slate-400">{account.email}</span>
                  <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-[#0e7490] group-hover:gap-2">
                    {loginLoading === account.key ? 'Signing in…' : 'Click to login'} <ArrowRight size={14} />
                  </span>
                </span>
              </button>
            ))}
          </div>
          {loginError && <p className="mt-3 text-sm text-red-600">{loginError}</p>}
          <p className="mt-4 text-xs text-[#5b6b7c]">
            Prefer email / password?{' '}
            <Link to="/login" className="font-medium text-[#0e7490] hover:underline">Open full sign-in →</Link>
          </p>
        </div>
      </section>

      {/* Request access */}
      <section id="demo" className="border-t border-[#d5dde6]/80">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-start">
          <div>
            <h2 className="landing-display text-3xl font-semibold text-[#0f2744] sm:text-4xl">Request access</h2>
            <p className="mt-3 text-sm leading-relaxed text-[#5b6b7c]">
              Tell us about your company. Superadmin reviews requests and schedules a guided walkthrough of RugOS modules.
            </p>
            <ul className="mt-8 space-y-3 text-sm text-[#0f2744]">
              {[
                'Live ops walkthrough (orders → ship → profit)',
                'Import or Export mode discussion',
                'No payment required to apply',
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
                <p className="text-sm text-[#5b6b7c]">Our team will contact you to schedule a walkthrough.</p>
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
                  <label className="mb-1 block text-xs font-semibold text-[#5b6b7c]" htmlFor="demo-contact">Contact name *</label>
                  <input
                    id="demo-contact"
                    required
                    className="landing-input"
                    value={demoForm.contactName}
                    onChange={(e) => setDemoForm({ ...demoForm, contactName: e.target.value })}
                  />
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
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
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-[#5b6b7c]" htmlFor="demo-phone">Phone</label>
                    <input
                      id="demo-phone"
                      className="landing-input"
                      value={demoForm.phone}
                      onChange={(e) => setDemoForm({ ...demoForm, phone: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-[#5b6b7c]" htmlFor="demo-message">What do you want to see?</label>
                  <textarea
                    id="demo-message"
                    rows={3}
                    className="landing-input"
                    placeholder="e.g. Orders workflow, India→USA replenishment, costing…"
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
                  {demoLoading ? 'Submitting…' : 'Request access'} <ArrowRight size={16} />
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Product */}
      <section id="product" className="border-t border-[#d5dde6]/80 bg-white/60">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="landing-display text-3xl font-semibold text-[#0f2744] sm:text-4xl">What the product does</h2>
          <p className="mt-3 max-w-2xl text-sm text-[#5b6b7c]">
            Modules stay the same whether you run Import or Export — Superadmin assigns exactly one mode per company.
          </p>
          <div className="mt-10 grid gap-5 sm:grid-cols-2">
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
          <h2 className="landing-display text-3xl font-semibold text-[#0f2744] sm:text-4xl">One subscription. One mode.</h2>
          <p className="mt-3 max-w-2xl text-sm text-[#5b6b7c]">
            Same modules for both. When Superadmin activates a purchase, they choose Export or Import. A company cannot use both at once.
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">Export mode</p>
              <h3 className="landing-display mt-2 text-2xl font-semibold text-[#0f2744]">India → world selling</h3>
              <p className="mt-2 text-sm text-[#5b6b7c]">
                Marketplace selling, India warehouse, replenishment to USA, export docs, EBRC/FIRA, and landed profitability.
              </p>
            </div>
            <div className="rounded-2xl border border-sky-200 bg-sky-50/70 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-700">Import mode</p>
              <h3 className="landing-display mt-2 text-2xl font-semibold text-[#0f2744]">Inbound / receiving ops</h3>
              <p className="mt-2 text-sm text-[#5b6b7c]">
                Same operational stack focused on receiving, USA inventory, inbound reconciliation and domestic fulfilment.
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
              <p className="mt-2 text-sm text-[#5b6b7c]">Managed by Superadmin. Checkout creates a pending activation.</p>
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
              <p className="font-semibold text-[#0f2744]">Superadmin controlled activation</p>
              <p className="text-sm text-[#5b6b7c]">New purchases stay pending until Superadmin sets Import or Export mode.</p>
            </div>
          </div>
          <a href="#login" className="text-sm font-semibold text-[#0e7490] hover:underline">
            Superadmin / Product Owner login →
          </a>
        </div>
      </section>

      <footer className="border-t border-[#d5dde6] bg-white/70 py-6 text-center text-xs text-[#5b6b7c]">
        © {new Date().getFullYear()} RugOS / ExportOS · SaaS platform
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
            <p>Platform Superadmin will activate the account and assign either <strong>Export</strong> or <strong>Import</strong> mode.</p>
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
