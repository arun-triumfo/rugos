import { NavLink, Outlet, Link, Navigate, useNavigate } from 'react-router-dom';
import { Building2, CreditCard, LogOut, Tags } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSaas } from '../context/SaasContext';

const NAV = [
  { to: '/superadmin/plans', label: 'Pricing Plans', icon: Tags },
  { to: '/superadmin/buyers', label: 'Buyers', icon: Building2 },
  { to: '/superadmin/subscriptions', label: 'Subscriptions', icon: CreditCard },
];

export default function SuperAdminLayout() {
  const { user, logout, isPlatformAdmin } = useAuth();
  const { toastMsg } = useSaas();
  const navigate = useNavigate();

  if (!isPlatformAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-surface">
      <aside className="flex w-56 flex-col bg-navy-900 text-slate-300">
        <div className="border-b border-navy-700 px-4 py-4">
          <p className="text-sm font-bold text-white">Superadmin</p>
          <p className="text-[10px] text-slate-400">Pricing · Buyers · Subscriptions</p>
        </div>
        <nav className="flex-1 space-y-0.5 p-2">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-2 rounded-md px-3 py-2 text-sm ${isActive ? 'bg-accent/20 text-white' : 'hover:bg-navy-800 hover:text-white'}`
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
          <Link to="/" className="mt-2 block px-2.5 text-xs text-blue-300 hover:text-blue-200">← Landing page</Link>
        </div>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-12 items-center justify-end gap-2 border-b border-border bg-panel px-4">
          <span className="text-sm text-slate-600">{user?.name || 'Superadmin'}</span>
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-danger"
          >
            <LogOut size={14} /> Logout
          </button>
        </header>
        <main className="flex-1 overflow-y-auto p-5">
          <Outlet />
        </main>
      </div>
      {toastMsg && (
        <div className="fixed bottom-4 right-4 z-50 rounded-lg border border-border bg-white px-4 py-2 text-sm shadow-lg">
          {toastMsg}
        </div>
      )}
    </div>
  );
}
