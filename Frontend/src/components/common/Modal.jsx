import { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../utils/format';

export default function Modal({ open, onClose, title, children, footer, size = 'md' }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && onClose?.();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  const sizes = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4">
      <div className="absolute inset-0 bg-navy-950/50" onClick={onClose} aria-hidden />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className={cn(
          'relative z-10 max-h-[92dvh] w-full rounded-t-xl border border-border bg-white shadow-xl sm:max-h-[85vh] sm:rounded-lg',
          sizes[size],
        )}
      >
        <div className="flex items-start justify-between gap-2 border-b border-border px-4 py-3">
          <h2 id="modal-title" className="min-w-0 flex-1 text-sm font-semibold text-navy-900">{title}</h2>
          <button type="button" onClick={onClose} className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700" aria-label="Close">
            <X size={16} />
          </button>
        </div>
        <div className="max-h-[min(60dvh,28rem)] overflow-y-auto px-4 py-4 scrollbar-thin sm:max-h-[70vh]">{children}</div>
        {footer && (
          <div className="flex flex-wrap justify-end gap-2 border-t border-border px-4 py-3 [&_.btn-primary]:flex-1 [&_.btn-primary]:sm:flex-none [&_.btn-secondary]:flex-1 [&_.btn-secondary]:sm:flex-none">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

export function ConfirmDialog({ open, onClose, onConfirm, title, message, confirmLabel = 'Confirm' }) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <>
          <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
          <button type="button" onClick={() => { onConfirm(); onClose(); }} className="btn-primary">{confirmLabel}</button>
        </>
      }
    >
      <p className="text-sm text-slate-600">{message}</p>
    </Modal>
  );
}

export function Drawer({ open, onClose, title, children, width = 'max-w-md' }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && onClose?.();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-navy-950/40" onClick={onClose} aria-hidden />
      <aside className={cn('relative z-10 flex h-full w-full max-w-full flex-col border-l border-border bg-white shadow-xl sm:w-auto', width)}>
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <h2 className="text-sm font-semibold text-navy-900">{title}</h2>
          <button type="button" onClick={onClose} className="rounded p-1 text-slate-400 hover:bg-slate-100" aria-label="Close">
            <X size={16} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 scrollbar-thin">{children}</div>
      </aside>
    </div>
  );
}
