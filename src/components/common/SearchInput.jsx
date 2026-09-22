import { Search } from 'lucide-react';
import { cn } from '../../utils/format';

export default function SearchInput({ value, onChange, placeholder = 'Search…', className }) {
  return (
    <div className={cn('relative', className)}>
      <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-md border border-border bg-white py-1.5 pl-8 pr-3 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent/30"
      />
    </div>
  );
}

export function FilterBar({ children, className }) {
  return (
    <div className={cn('mb-4 flex flex-wrap items-center gap-2 rounded-lg border border-border bg-panel p-3', className)}>
      {children}
    </div>
  );
}

export function SelectFilter({ label, value, onChange, options, className }) {
  return (
    <label className={cn('flex flex-col gap-0.5 text-[11px] font-medium text-slate-500', className)}>
      {label}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-md border border-border bg-white px-2 py-1.5 text-sm text-slate-800 outline-none focus:border-accent"
      >
        <option value="">All</option>
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </label>
  );
}
