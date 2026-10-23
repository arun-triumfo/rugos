import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Building2, CheckCircle2, CircleDashed, Compass, GitBranch,
  Layers, Map, Sparkles, Users, ExternalLink,
} from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import {
  WORKFLOWS, DEPARTMENTS, MENU_GUIDE, ROADMAP, STATUS,
} from '../../constants/workflows';

const TABS = [
  { id: 'journey', label: 'Complete workflows', icon: GitBranch },
  { id: 'departments', label: 'By department', icon: Users },
  { id: 'menus', label: 'Menu guide', icon: Map },
  { id: 'roadmap', label: 'To be developed', icon: Sparkles },
];

function StatusPill({ status }) {
  const s = STATUS[status] || STATUS.planned;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset ${s.className}`}
      title={s.hint}
    >
      {status === 'live' ? <CheckCircle2 className="h-3 w-3" /> : status === 'ready' ? <Layers className="h-3 w-3" /> : <CircleDashed className="h-3 w-3" />}
      {s.label}
    </span>
  );
}

function StepLink({ step }) {
  const body = (
    <div className={`flex h-full flex-col gap-2 rounded-xl border p-3 transition ${
      step.to ? 'border-border bg-white hover:border-accent/40 hover:shadow-sm' : 'border-dashed border-amber-200 bg-amber-50/40'
    }`}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-navy-900 text-xs font-semibold text-white">
          {step.n}
        </span>
        <StatusPill status={step.status} />
      </div>
      <div>
        <p className="text-sm font-semibold text-navy-900">{step.title}</p>
        <p className="mt-1 text-xs leading-relaxed text-slate-500">{step.plain}</p>
      </div>
      {step.menu && step.menu !== '—' && (
        <div className="mt-auto flex items-center gap-1 text-xs font-medium text-accent">
          {step.to ? (
            <>
              Open {step.menu}
              <ArrowRight className="h-3 w-3" />
            </>
          ) : (
            <span className="text-amber-800">Not built yet</span>
          )}
        </div>
      )}
    </div>
  );

  if (!step.to) return body;
  return <Link to={step.to} className="block h-full">{body}</Link>;
}

function JourneyPanel({ selectedId, onSelect }) {
  const active = WORKFLOWS.find((w) => w.id === selectedId) || WORKFLOWS[0];

  return (
    <div className="grid gap-4 lg:grid-cols-[260px_1fr]">
      <aside className="rounded-xl border border-border bg-white p-2">
        <p className="px-2 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
          Pick a journey
        </p>
        <ul className="space-y-0.5">
          {WORKFLOWS.map((w) => {
            const on = w.id === active.id;
            return (
              <li key={w.id}>
                <button
                  type="button"
                  onClick={() => onSelect(w.id)}
                  className={`w-full rounded-lg px-3 py-2.5 text-left text-sm transition ${
                    on ? 'bg-navy-900 text-white' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span className="block font-medium leading-snug">{w.title}</span>
                  <span className={`mt-0.5 block text-[11px] ${on ? 'text-slate-300' : 'text-slate-400'}`}>
                    {w.department}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </aside>

      <section className="rounded-xl border border-border bg-white p-4 sm:p-5">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div className="max-w-2xl">
            <h2 className="text-lg font-semibold text-navy-900">{active.title}</h2>
            <p className="mt-1 text-sm leading-relaxed text-slate-600">{active.plain}</p>
            <p className="mt-2 text-xs text-slate-400">
              Who works this · <span className="font-medium text-slate-600">{active.department}</span>
            </p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            <StatusPill status="live" />
            <StatusPill status="ready" />
            <StatusPill status="planned" />
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {active.steps.map((step) => (
            <StepLink key={`${active.id}-${step.n}`} step={step} />
          ))}
        </div>

        <p className="mt-4 text-xs text-slate-400">
          Tip: click any step card to open that menu and try it yourself.
        </p>
      </section>
    </div>
  );
}

const DEPT_COLORS = {
  blue: 'from-blue-600 to-blue-800',
  sky: 'from-sky-500 to-sky-700',
  emerald: 'from-emerald-500 to-emerald-700',
  violet: 'from-violet-500 to-violet-700',
  amber: 'from-amber-500 to-amber-700',
  rose: 'from-rose-500 to-rose-700',
  slate: 'from-slate-500 to-slate-700',
  navy: 'from-navy-800 to-navy-950',
};

function DepartmentsPanel() {
  const [openId, setOpenId] = useState(DEPARTMENTS[0].id);
  const active = DEPARTMENTS.find((d) => d.id === openId) || DEPARTMENTS[0];

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-600">
        Each login role sees different menus and does different daily work.
        Click a department to see what they use.
      </p>

      <div className="flex flex-wrap gap-2">
        {DEPARTMENTS.map((d) => (
          <button
            key={d.id}
            type="button"
            onClick={() => setOpenId(d.id)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
              d.id === openId
                ? 'bg-navy-900 text-white'
                : 'border border-border bg-white text-slate-600 hover:border-slate-300'
            }`}
          >
            {d.role}
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-white">
        <div className={`bg-gradient-to-r ${DEPT_COLORS[active.color] || DEPT_COLORS.blue} px-5 py-4 text-white`}>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-xs uppercase tracking-wide text-white/70">Department / role</p>
              <h2 className="text-xl font-semibold">{active.role}</h2>
            </div>
            <StatusPill status={active.status} />
          </div>
          <p className="mt-2 max-w-2xl text-sm text-white/90">{active.plain}</p>
        </div>

        <div className="grid gap-0 md:grid-cols-3">
          <div className="border-b border-border p-4 md:border-b-0 md:border-r">
            <h3 className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">
              <Building2 className="h-3.5 w-3.5" />
              What they see
            </h3>
            <p className="text-sm leading-relaxed text-slate-700">{active.sees}</p>
          </div>
          <div className="border-b border-border p-4 md:border-b-0 md:border-r">
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Daily jobs
            </h3>
            <ul className="space-y-2">
              {active.jobs.map((j) => (
                <li key={j} className="flex gap-2 text-sm text-slate-700">
                  <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" />
                  {j}
                </li>
              ))}
            </ul>
          </div>
          <div className="p-4">
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Open their menus
            </h3>
            <div className="flex flex-col gap-1.5">
              {active.menus.map((m) => (
                <Link
                  key={m.to}
                  to={m.to}
                  className="inline-flex items-center justify-between rounded-lg border border-border px-3 py-2 text-sm font-medium text-slate-700 hover:border-accent/40 hover:bg-slate-50"
                >
                  {m.label}
                  <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
                </Link>
              ))}
            </div>
            {active.gap && (
              <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-xs leading-relaxed text-amber-900 ring-1 ring-amber-100">
                <span className="font-semibold">Still to build: </span>
                {active.gap}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function MenusPanel() {
  const [q, setQ] = useState('');
  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return MENU_GUIDE;
    return MENU_GUIDE.map((g) => ({
      ...g,
      items: g.items.filter(
        (i) => i.label.toLowerCase().includes(needle) || i.plain.toLowerCase().includes(needle),
      ),
    })).filter((g) => g.items.length > 0 || g.group.toLowerCase().includes(needle));
  }, [q]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-600">
          Every sidebar menu explained in plain language. Click to open it.
        </p>
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search menus…"
          className="input-field max-w-xs"
        />
      </div>

      <div className="space-y-3">
        {filtered.map((g) => (
          <details key={g.group} open className="group rounded-xl border border-border bg-white open:shadow-sm">
            <summary className="cursor-pointer list-none px-4 py-3 marker:content-none">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm font-semibold text-navy-900">{g.group}</h3>
                  <p className="text-xs text-slate-500">{g.plain}</p>
                </div>
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">
                  {g.items.length} menus
                </span>
              </div>
            </summary>
            <ul className="divide-y divide-border border-t border-border">
              {g.items.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="flex flex-col gap-1 px-4 py-3 transition hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-navy-900">{item.label}</p>
                      <p className="text-xs text-slate-500">{item.plain}</p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <StatusPill status={item.status} />
                      <ArrowRight className="h-4 w-4 text-slate-300" />
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </details>
        ))}
        {filtered.length === 0 && (
          <p className="rounded-xl border border-dashed border-border bg-white px-4 py-8 text-center text-sm text-slate-500">
            No menus match “{q}”.
          </p>
        )}
      </div>
    </div>
  );
}

function RoadmapPanel() {
  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-600">
        Honest delivery status — what is already working for the client, and what we still plan to build
        (especially SaaS and department permissions).
      </p>

      <div className="grid gap-4 lg:grid-cols-2">
        {ROADMAP.map((block) => (
          <section key={block.area} className="rounded-xl border border-border bg-white p-4">
            <h3 className="mb-3 text-sm font-semibold text-navy-900">{block.area}</h3>
            <ul className="space-y-2.5">
              {block.items.map((item) => (
                <li
                  key={item.title}
                  className={`rounded-lg border px-3 py-2.5 ${
                    item.status === 'planned'
                      ? 'border-amber-100 bg-amber-50/50'
                      : 'border-border bg-slate-50/60'
                  }`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <p className="text-sm font-medium text-slate-800">{item.title}</p>
                    <StatusPill status={item.status} />
                  </div>
                  <p className="mt-1 text-xs text-slate-500">{item.note}</p>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}

export default function WorkflowGuidePage() {
  const [tab, setTab] = useState('journey');
  const [journeyId, setJourneyId] = useState(WORKFLOWS[0].id);

  const counts = useMemo(() => {
    const steps = WORKFLOWS.flatMap((w) => w.steps);
    return {
      live: steps.filter((s) => s.status === 'live').length,
      ready: steps.filter((s) => s.status === 'ready').length,
      planned: steps.filter((s) => s.status === 'planned').length + ROADMAP.flatMap((r) => r.items).filter((i) => i.status === 'planned').length,
      journeys: WORKFLOWS.length,
      departments: DEPARTMENTS.length,
    };
  }, []);

  return (
    <div>
      <PageHeader
        title="System Workflow Guide"
        subtitle="Plain-language map of how RugOS works — click any step to open the real menu"
        breadcrumbs={[{ label: 'Overview' }, { label: 'Workflow Guide' }]}
        badge={
          <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-800 ring-1 ring-emerald-200">
            Client walkthrough
          </span>
        }
      />

      <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: 'End-to-end journeys', value: counts.journeys, icon: Compass },
          { label: 'Departments', value: counts.departments, icon: Users },
          { label: 'Live / ready steps', value: counts.live + counts.ready, icon: CheckCircle2 },
          { label: 'Planned next', value: counts.planned, icon: CircleDashed },
        ].map((k) => (
          <div key={k.label} className="rounded-xl border border-border bg-white px-4 py-3">
            <div className="flex items-center gap-2 text-slate-400">
              <k.icon className="h-4 w-4" />
              <span className="text-[11px] font-medium uppercase tracking-wide">{k.label}</span>
            </div>
            <p className="mt-1 text-2xl font-semibold text-navy-900">{k.value}</p>
          </div>
        ))}
      </div>

      <div className="mb-4 flex flex-wrap gap-1 rounded-xl border border-border bg-white p-1">
        {TABS.map((t) => {
          const Icon = t.icon;
          const on = tab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition sm:flex-none ${
                on ? 'bg-navy-900 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Icon className="h-4 w-4" />
              {t.label}
            </button>
          );
        })}
      </div>

      {tab === 'journey' && <JourneyPanel selectedId={journeyId} onSelect={setJourneyId} />}
      {tab === 'departments' && <DepartmentsPanel />}
      {tab === 'menus' && <MenusPanel />}
      {tab === 'roadmap' && <RoadmapPanel />}
    </div>
  );
}
