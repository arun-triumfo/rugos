import { cn } from '../../utils/format';

export default function PageHeader({ title, subtitle, breadcrumbs, actions, badge }) {
  return (
    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div>
        {breadcrumbs && (
          <nav className="mb-1 flex flex-wrap items-center gap-1 text-xs text-slate-500">
            {breadcrumbs.map((b, i) => (
              <span key={i} className="flex items-center gap-1">
                {i > 0 && <span>/</span>}
                {b.to ? (
                  <a href={b.to} className="hover:text-accent">{b.label}</a>
                ) : (
                  <span className={i === breadcrumbs.length - 1 ? 'text-slate-700 font-medium' : ''}>{b.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-lg font-semibold text-navy-900 tracking-tight sm:text-xl">{title}</h1>
          {badge}
        </div>
        {subtitle && <p className="mt-0.5 text-sm text-slate-500">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function KpiCard({ label, value, sub, trend, icon: Icon, accent = 'blue' }) {
  const accents = {
    blue: 'border-l-blue-500',
    green: 'border-l-emerald-500',
    amber: 'border-l-amber-500',
    red: 'border-l-red-500',
    purple: 'border-l-violet-500',
  };
  return (
    <div className={cn('rounded-lg border border-border bg-panel p-3.5 shadow-sm border-l-4', accents[accent])}>
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">{label}</p>
          <p className="mt-1 text-lg font-semibold text-navy-900 tabular-nums">{value}</p>
          {sub && <p className="mt-0.5 text-xs text-slate-500">{sub}</p>}
          {trend && <p className="mt-1 text-xs text-emerald-600">{trend}</p>}
        </div>
        {Icon && (
          <div className="rounded-md bg-slate-50 p-2 text-slate-500">
            <Icon size={16} />
          </div>
        )}
      </div>
    </div>
  );
}

export function ChartCard({ title, children, actions, className }) {
  return (
    <div className={cn('rounded-lg border border-border bg-panel p-4 shadow-sm', className)}>
      <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-sm font-semibold text-navy-900">{title}</h3>
        {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
      </div>
      {children}
    </div>
  );
}
