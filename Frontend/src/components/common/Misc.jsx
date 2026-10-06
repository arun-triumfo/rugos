export function LoadingSkeleton({ rows = 5 }) {
  return (
    <div className="space-y-2 animate-pulse">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-10 rounded-md bg-slate-200/70" />
      ))}
    </div>
  );
}

export function EmptyState({ title = 'No data', description, action }) {
  return (
    <div className="rounded-lg border border-dashed border-border bg-panel px-6 py-14 text-center">
      <p className="text-sm font-medium text-navy-900">{title}</p>
      {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function TabNavigation({ tabs, active, onChange }) {
  return (
    <div className="mb-4 flex gap-1 overflow-x-auto border-b border-border scrollbar-thin">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={`shrink-0 border-b-2 px-3 py-2 text-sm font-medium transition-colors ${
            active === tab.id
              ? 'border-accent text-accent'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

export function Timeline({ items }) {
  return (
    <ol className="relative space-y-0 border-l border-border ml-3">
      {items.map((item, i) => (
        <li key={item.id || i} className="mb-4 ml-4">
          <span
            className={`absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full border-2 border-white ${
              item.status === 'done'
                ? 'bg-emerald-500'
                : item.status === 'pending'
                  ? 'bg-amber-400'
                  : 'bg-slate-300'
            }`}
          />
          <div className="rounded-md border border-border bg-panel px-3 py-2">
            <p className="text-sm font-medium text-navy-900">{item.title}</p>
            <div className="mt-0.5 flex flex-wrap gap-x-3 text-xs text-slate-500">
              {item.at && <span>{new Date(item.at).toLocaleString('en-IN')}</span>}
              {item.user && <span>{item.user}</span>}
              {item.status && <span className="capitalize">{item.status}</span>}
            </div>
          </div>
        </li>
      ))}
    </ol>
  );
}

export function WorkflowStepper({ steps, currentStep }) {
  return (
    <div className="flex gap-1 overflow-x-auto pb-2 scrollbar-thin">
      {steps.map((step, i) => {
        const done = i + 1 < currentStep;
        const active = i + 1 === currentStep;
        return (
          <div
            key={step.key}
            className={`min-w-[100px] flex-1 rounded-md border px-2 py-2 text-center ${
              done
                ? 'border-emerald-200 bg-emerald-50'
                : active
                  ? 'border-blue-300 bg-blue-50'
                  : 'border-border bg-slate-50'
            }`}
          >
            <p className="text-[10px] font-semibold uppercase text-slate-500">Step {i + 1}</p>
            <p className="text-xs font-medium text-navy-900 leading-tight">{step.label}</p>
          </div>
        );
      })}
    </div>
  );
}
