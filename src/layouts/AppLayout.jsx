import { useMemo, useState, useEffect, useRef } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  Bell, ChevronDown, ChevronLeft, ChevronRight, LogOut, Menu, Play, Search, User, X,
} from 'lucide-react';
import { NAV_GROUPS } from '../constants/navigation';
import { useAuth } from '../context/AuthContext';
import { useDemo } from '../context/DemoContext';
import { globalSearch } from '../services';
import ToastStack from '../components/common/ToastStack';
import { Drawer } from '../components/common/Modal';
import { DEMO_TOUR_STEPS } from '../constants/demoTour';

export default function AppLayout() {
  const { user, role, roles, setRole, logout, visibleNavGroups } = useAuth();
  const { state, toast } = useDemo();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [roleOpen, setRoleOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchQ, setSearchQ] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [tourOpen, setTourOpen] = useState(false);
  const [tourStep, setTourStep] = useState(0);
  const searchRef = useRef(null);

  const groups = useMemo(() => visibleNavGroups(NAV_GROUPS), [visibleNavGroups]);
  const unreadAlerts = state.alerts.filter((a) => !a.read).length;

  useEffect(() => {
    if (!searchQ.trim()) {
      setSearchResults([]);
      return;
    }
    const t = setTimeout(() => {
      globalSearch(state, searchQ).then(setSearchResults);
    }, 200);
    return () => clearTimeout(t);
  }, [searchQ, state]);

  useEffect(() => {
    const onDoc = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) setSearchOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  const sidebar = (
    <aside
      className={`no-print flex h-full flex-col bg-navy-900 text-slate-300 transition-all ${
        collapsed ? 'w-[68px]' : 'w-[250px]'
      }`}
    >
      <div className="flex h-14 items-center gap-2 border-b border-navy-700 px-3">
        {!collapsed && (
          <Link to="/dashboard" className="flex flex-col leading-tight">
            <span className="text-sm font-bold tracking-wide text-white">RugOS</span>
            <span className="text-[10px] text-slate-400">ExportOS Platform</span>
          </Link>
        )}
        {collapsed && <span className="mx-auto text-xs font-bold text-white">R</span>}
        <button
          type="button"
          className="ml-auto hidden rounded p-1 text-slate-400 hover:bg-navy-800 hover:text-white lg:inline-flex"
          onClick={() => setCollapsed((c) => !c)}
          aria-label="Toggle sidebar"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
        <button type="button" className="ml-auto rounded p-1 lg:hidden" onClick={() => setMobileOpen(false)} aria-label="Close">
          <X size={16} />
        </button>
      </div>
      <nav className="flex-1 overflow-y-auto px-2 py-3 scrollbar-thin">
        {groups.map((group) => (
          <div key={group.label} className="mb-3">
            {!collapsed && (
              <p className="mb-1 px-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500">{group.label}</p>
            )}
            <ul className="space-y-0.5">
              {group.items.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    onClick={() => setMobileOpen(false)}
                    title={collapsed ? item.label : undefined}
                    className={({ isActive }) =>
                      `flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-[13px] transition-colors ${
                        isActive ? 'bg-accent/20 text-white' : 'hover:bg-navy-800 hover:text-white'
                      }`
                    }
                  >
                    <item.icon size={16} className="shrink-0 opacity-80" />
                    {!collapsed && <span className="truncate">{item.label}</span>}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );

  return (
    <div className="flex h-full min-h-screen bg-surface">
      <div className="hidden lg:block">{sidebar}</div>
      {mobileOpen && (
        <div className="fixed inset-0 z-40 flex lg:hidden">
          <div className="absolute inset-0 bg-navy-950/50" onClick={() => setMobileOpen(false)} />
          <div className="relative z-10 h-full">{sidebar}</div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="no-print sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-panel px-3 shadow-sm sm:px-4">
          <button type="button" className="rounded-md p-1.5 text-slate-600 hover:bg-slate-100 lg:hidden" onClick={() => setMobileOpen(true)} aria-label="Menu">
            <Menu size={18} />
          </button>

          <div className="relative min-w-0 flex-1 max-w-xl" ref={searchRef}>
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={searchQ}
              onChange={(e) => { setSearchQ(e.target.value); setSearchOpen(true); }}
              onFocus={() => setSearchOpen(true)}
              placeholder="Search orders, SKUs, shipments, AWB, customers…"
              className="w-full rounded-md border border-border bg-slate-50 py-1.5 pl-8 pr-3 text-sm outline-none focus:border-accent focus:bg-white"
            />
            {searchOpen && searchResults.length > 0 && (
              <div className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-md border border-border bg-white shadow-lg">
                {searchResults.map((r, i) => (
                  <button
                    key={i}
                    type="button"
                    className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-slate-50"
                    onClick={() => { navigate(r.to); setSearchOpen(false); setSearchQ(''); }}
                  >
                    <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-slate-500">{r.type}</span>
                    <span className="truncate">{r.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <span className="hidden rounded border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-700 sm:inline">
            Demo Environment
          </span>

          <button type="button" className="btn-secondary hidden sm:inline-flex" onClick={() => setTourOpen(true)}>
            <Play size={14} /> Start Demo Tour
          </button>

          <div className="relative">
            <button type="button" className="relative rounded-md p-1.5 text-slate-600 hover:bg-slate-100" onClick={() => setNotifOpen((v) => !v)} aria-label="Notifications">
              <Bell size={18} />
              {unreadAlerts > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[10px] text-white">
                  {unreadAlerts > 9 ? '9+' : unreadAlerts}
                </span>
              )}
            </button>
            {notifOpen && (
              <div className="absolute right-0 top-full z-50 mt-1 w-80 overflow-hidden rounded-md border border-border bg-white shadow-lg">
                <div className="border-b border-border px-3 py-2 text-xs font-semibold text-slate-600">Notifications</div>
                {state.notifications.map((n) => (
                  <div key={n.id} className={`border-b border-border px-3 py-2 text-sm ${n.read ? 'bg-white' : 'bg-blue-50/40'}`}>
                    <p className="font-medium text-navy-900">{n.title}</p>
                    <p className="text-xs text-slate-500">{n.time}</p>
                  </div>
                ))}
                <button type="button" className="w-full px-3 py-2 text-xs font-medium text-accent hover:bg-slate-50" onClick={() => { navigate('/alerts'); setNotifOpen(false); }}>
                  View Alert Center
                </button>
              </div>
            )}
          </div>

          <div className="relative">
            <button type="button" className="flex items-center gap-1 rounded-md border border-border px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50" onClick={() => setRoleOpen((v) => !v)}>
              {role} <ChevronDown size={12} />
            </button>
            {roleOpen && (
              <div className="absolute right-0 top-full z-50 mt-1 w-48 overflow-hidden rounded-md border border-border bg-white shadow-lg">
                {roles.map((r) => (
                  <button
                    key={r}
                    type="button"
                    className={`block w-full px-3 py-2 text-left text-sm hover:bg-slate-50 ${r === role ? 'bg-blue-50 text-accent font-medium' : ''}`}
                    onClick={() => { setRole(r); setRoleOpen(false); toast(`Switched to ${r} view`); }}
                  >
                    {r}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="relative">
            <button type="button" className="flex items-center gap-2 rounded-md p-1 hover:bg-slate-100" onClick={() => setProfileOpen((v) => !v)}>
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-navy-800 text-xs font-semibold text-white">
                {(user?.name || 'U').slice(0, 1)}
              </div>
              <span className="hidden text-sm font-medium text-slate-700 md:inline">{user?.name}</span>
            </button>
            {profileOpen && (
              <div className="absolute right-0 top-full z-50 mt-1 w-48 overflow-hidden rounded-md border border-border bg-white shadow-lg">
                <div className="border-b border-border px-3 py-2 text-xs text-slate-500">{user?.email}</div>
                <button type="button" className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-slate-50" onClick={() => { navigate('/settings'); setProfileOpen(false); }}>
                  <User size={14} /> Settings
                </button>
                <button type="button" className="flex w-full items-center gap-2 px-3 py-2 text-sm text-danger hover:bg-slate-50" onClick={() => { logout(); navigate('/login'); }}>
                  <LogOut size={14} /> Sign Out
                </button>
              </div>
            )}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-3 sm:p-5 scrollbar-thin">
          <Outlet />
        </main>
      </div>

      <ToastStack />

      <Drawer open={tourOpen} onClose={() => setTourOpen(false)} title="Client Demo Guide" width="max-w-sm">
        <p className="mb-3 text-xs text-slate-500">Walk through the Order #1001 end-to-end lifecycle.</p>
        <ol className="space-y-2">
          {DEMO_TOUR_STEPS.map((step, i) => (
            <li key={i}>
              <button
                type="button"
                className={`w-full rounded-md border px-3 py-2 text-left text-sm ${i === tourStep ? 'border-accent bg-blue-50' : 'border-border hover:bg-slate-50'}`}
                onClick={() => { setTourStep(i); navigate(step.to); }}
              >
                <span className="text-[10px] font-semibold uppercase text-slate-400">Step {i + 1}</span>
                <p className="font-medium text-navy-900">{step.title}</p>
                <p className="text-xs text-slate-500">{step.description}</p>
              </button>
            </li>
          ))}
        </ol>
        <div className="mt-4 flex gap-2">
          <button type="button" className="btn-secondary flex-1" disabled={tourStep === 0} onClick={() => { const n = Math.max(0, tourStep - 1); setTourStep(n); navigate(DEMO_TOUR_STEPS[n].to); }}>Previous</button>
          <button type="button" className="btn-primary flex-1" disabled={tourStep >= DEMO_TOUR_STEPS.length - 1} onClick={() => { const n = Math.min(DEMO_TOUR_STEPS.length - 1, tourStep + 1); setTourStep(n); navigate(DEMO_TOUR_STEPS[n].to); }}>Next</button>
        </div>
      </Drawer>
    </div>
  );
}
