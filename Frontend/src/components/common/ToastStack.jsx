import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';
import { useDemo } from '../../context/DemoContext';

export default function ToastStack() {
  const { toasts, dismissToast } = useDemo();
  if (!toasts.length) return null;

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[60] flex w-full max-w-sm flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="pointer-events-auto flex items-start gap-2 rounded-lg border border-border bg-white px-3 py-2.5 shadow-lg"
        >
          {t.type === 'error' ? (
            <AlertTriangle size={16} className="mt-0.5 shrink-0 text-danger" />
          ) : t.type === 'info' ? (
            <Info size={16} className="mt-0.5 shrink-0 text-accent" />
          ) : (
            <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-success" />
          )}
          <p className="flex-1 text-sm text-slate-800">{t.message}</p>
          <button type="button" onClick={() => dismissToast(t.id)} className="text-slate-400 hover:text-slate-600" aria-label="Dismiss">
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
