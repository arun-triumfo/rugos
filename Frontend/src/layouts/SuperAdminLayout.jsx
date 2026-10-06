import { useState } from 'react';
import { NavLink, Outlet, Link, Navigate, useNavigate } from 'react-router-dom';
import { Building2, CreditCard, LogOut, Menu, Tags, X, ClipboardList } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSaas } from '../context/SaasContext';

const NAV = [
  { to: '/superadmin/plans', label: 'Pricing Plans', icon: Tags },
  { to: '/superadmin/buyers', label: 'Buyers', icon: Building2 },
  { to: '/superadmin/subscriptions', label: 'Subscriptions', icon: CreditCard },
  { to: '/superadmin/demo-requests', label: 'Demo Requests', icon: ClipboardList },
];

export default function SuperAdminLayout() {
  const { user, logout, isPlatformAdmin } = useAuth();
  const { toastMsg } = useSaas();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!isPlatformAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const sidebar = (
    <aside className="flex h-full max-h-[100dvh] w-[min(100vw,14rem)] flex-col bg-navy-900 text-slate-300 sm:w-56">
      <div className="flex items-center justify-between border-b border-navy-700 px-4 py-4">
        <div>
          <p className="text-sm font-bold text-white">Superadmin</p>
          <p className="text-[10px] text-slate-400">Pricing · Buyers · Subscriptions</p>
        </div>
        <button type="button" className="rounded p-1 text-slate-400 hover:bg-navy-800 lg:hidden" onClick={() => setMobileOpen(false)} aria-label="Close menu">
          <X size={18} />
        </button>
      </div>
      <nav className="flex-1 space-y-0.5 overflow-y-auto p-2 scrollbar-thin">
        {NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-2 rounded-md px-3 py-2.5 text-sm ${isActive ? 'bg-accent/20 text-white' : 'hover:bg-navy-800 hover:text-white'}`
            }
          >
            <item.icon size={16} />
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="border-t border-navy-700 p-3">
        <p className="truncate text-xs text-slate-400">{user?.email}</p>
        <button
          type="button"
          className="mt-2 flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-sm text-slate-300 hover:bg-navy-800 hover:text-white"
          onClick={handleLogout}
        >
          <LogOut size={16} /> Sign Out
        </button>
        <Link to="/" className="mt-2 block px-2.5 text-xs text-blue-300 hover:text-blue-200" onClick={() => setMobileOpen(false)}>
          ← Landing page
        </Link>
      </div>
    </aside>
  );

  return (
    <div className="flex min-h-screen min-w-0 bg-surface">
      <div className="hidden shrink-0 lg:block">{sidebar}</div>
      {mobileOpen && (
        <div className="fixed inset-0 z-40 flex lg:hidden">
          <div className="absolute inset-0 bg-navy-950/50" onClick={() => setMobileOpen(false)} aria-hidden />
          <div className="relative z-10 h-full">{sidebar}</div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-12 items-center gap-2 border-b border-border bg-panel px-3 sm:h-14 sm:px-4">
          <button type="button" className="rounded-md p-1.5 text-slate-600 hover:bg-slate-100 lg:hidden" onClick={() => setMobileOpen(true)} aria-label="Menu">
            <Menu size={18} />
          </button>
          <p className="min-w-0 flex-1 truncate text-sm font-medium text-slate-700 lg:flex-none">{user?.name || 'Superadmin'}</p>
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-danger"
          >
            <LogOut size={14} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </header>
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-3 sm:p-5">
          <Outlet />
        </main>
      </div>
      {toastMsg && (
        <div className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-sm rounded-lg border border-border bg-white px-4 py-2 text-sm shadow-lg sm:left-auto sm:right-4">
          {toastMsg}
        </div>
      )}
    </div>
  );
}
