import { cn } from '../../utils/format';

const colorMap = {
  blue: 'bg-blue-50 text-blue-700 ring-blue-600/20',
  green: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  amber: 'bg-amber-50 text-amber-700 ring-amber-600/20',
  red: 'bg-red-50 text-red-700 ring-red-600/20',
  purple: 'bg-violet-50 text-violet-700 ring-violet-600/20',
  gray: 'bg-slate-100 text-slate-600 ring-slate-500/20',
};

export default function StatusBadge({ status, color, className }) {
  const c = color || inferColor(status);
  return (
    <span
      className={cn(
        'inline-flex items-center rounded px-2 py-0.5 text-[11px] font-semibold ring-1 ring-inset whitespace-nowrap',
        colorMap[c] || colorMap.gray,
        className
      )}
    >
      {status}
    </span>
  );
}

function inferColor(status) {
  if (!status) return 'gray';
  const s = String(status).toLowerCase();
  if (['delivered', 'paid', 'completed', 'matched', 'success', 'healthy', 'packed', 'mapped', 'recovered', 'final', 'approved', 'active'].some((k) => s.includes(k))) return 'green';
  if (['pending', 'awaiting', 'open', 'draft', 'queued', 'low stock', 'partial', 'warning', 'mapping required'].some((k) => s.includes(k))) return 'amber';
  if (['fail', 'overdue', 'rto', 'return', 'cancel', 'critical', 'dispute', 'exception', 'damaged', 'out of stock', 'rejected'].some((k) => s.includes(k))) return 'red';
  if (['transit', 'shipped', 'dispatch', 'special'].some((k) => s.includes(k))) return 'purple';
  if (['process', 'pick', 'pack', 'running', 'reserved', 'imported'].some((k) => s.includes(k))) return 'blue';
  return 'gray';
}
