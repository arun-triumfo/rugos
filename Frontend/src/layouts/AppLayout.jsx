import { useMemo, useState, useEffect, useRef } from 'react';
import { Link, NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
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

function pathMatches(to, pathname) {
  if (to === '/dashboard') return pathname === '/dashboard';
  return pathname === to || pathname.startsWith(`${to}/`);
}

function groupHasActive(group, pathname) {
  return group.items.some((item) => pathMatches(item.to, pathname));
}

export default function AppLayout() {
  const { user, role, roles, setRole, logout, visibleNavGroups, modeLabel, businessMode } = useAuth();
  const { state, toast } = useDemo();
  const navigate = useNavigate();
  const location = useLocation();
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
  const [openMenus, setOpenMenus] = useState({});
  const searchRef = useRef(null);
  const headerMenuRef = useRef(null);

  const groups = useMemo(() => visibleNavGroups(NAV_GROUPS), [visibleNavGroups]);
  const unreadAlerts = state.alerts.filter((a) => !a.read).length;

  // Keep the active section menu open
  useEffect(() => {
    setOpenMenus((prev) => {
      const next = { ...prev };
      groups.forEach((g) => {
        if (groupHasActive(g, location.pathname)) next[g.label] = true;
      });
      return next;
    });
  }, [location.pathname, groups]);

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
      if (headerMenuRef.current && !headerMenuRef.current.contains(e.target)) {
        setRoleOpen(false);
        setProfileOpen(false);
        setNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleMenu = (label) => {
    setOpenMenus((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  /** Mobile drawer always shows full nav; desktop respects collapse. */
  const effectiveCollapsed = mobileOpen ? false : collapsed;

  const sidebar = (
    <aside
      className={`no-print flex h-full max-h-[100dvh] flex-col bg-navy-900 text-slate-300 transition-all ${
        effectiveCollapsed ? 'w-[68px]' : 'w-[min(100vw,280px)] sm:w-[250px]'
      }`}
    >
      <div className="flex h-14 items-center gap-2 border-b border-navy-700 px-3">
        {!effectiveCollapsed && (
          <Link to="/dashboard" className="flex min-w-0 flex-col leading-tight">
            <span className="text-sm font-bold tracking-wide text-white">RugOS</span>
            <span className="text-[10px] text-slate-400">
              {modeLabel ? `${modeLabel} mode` : 'ExportOS Platform'}
            </span>
          </Link>
        )}
        {effectiveCollapsed && <span className="mx-auto text-xs font-bold text-white">R</span>}
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
        {groups.map((group) => {
          const isOpen = !!openMenus[group.label];
          const GroupIcon = group.items[0]?.icon;

          if (effectiveCollapsed) {
            return (
              <div key={group.label} className="mb-2">
                <ul className="space-y-0.5">
                  {group.items.map((item) => (
                    <li key={item.to}>
                      <NavLink
                        to={item.to}
                        onClick={() => setMobileOpen(false)}
                        title={item.label}
                        className={({ isActive }) =>
                          `flex items-center justify-center rounded-md p-2 text-[13px] transition-colors ${
                            isActive ? 'bg-accent/20 text-white' : 'hover:bg-navy-800 hover:text-white'
                          }`
                        }
                      >
                        <item.icon size={16} className="shrink-0 opacity-80" />
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </div>
            );
          }

          return (
            <div key={group.label} className="mb-1">
              <button
                type="button"
                onClick={() => toggleMenu(group.label)}
                className={`flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-[13px] font-semibold transition-colors ${
                  groupHasActive(group, location.pathname)
                    ? 'bg-navy-800 text-white'
                    : 'text-slate-300 hover:bg-navy-800 hover:text-white'
                }`}
                aria-expanded={isOpen}
              >
                {GroupIcon && <GroupIcon size={15} className="shrink-0 opacity-80" />}
                <span className="flex-1 truncate">{group.label}</span>
                <ChevronDown
                  size={14}
                  className={`shrink-0 text-slate-500 transition-transform ${isOpen ? 'rotate-0' : '-rotate-90'}`}
                />
              </button>

              {isOpen && (
                <ul className="mt-0.5 space-y-0.5 border-l border-navy-700 ml-3.5 pl-2">
                  {group.items.map((item) => (
                    <li key={item.to}>
                      <NavLink
                        to={item.to}
                        end={item.to === '/dashboard' || item.to === '/inventory' || item.to === '/replenishment'}
                        onClick={() => setMobileOpen(false)}
                        className={({ isActive }) =>
                          `flex items-center gap-2 rounded-md px-2.5 py-1.5 text-[13px] transition-colors ${
                            isActive ? 'bg-accent/20 text-white' : 'text-slate-400 hover:bg-navy-800 hover:text-white'
                          }`
                        }
                      >
                        <item.icon size={14} className="shrink-0 opacity-80" />
                        <span className="truncate">{item.label}</span>
                      </NavLink>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </nav>

      <div className="border-t border-navy-700 p-3">
        {!effectiveCollapsed && (
          <div className="mb-2 truncate px-1 text-[11px] text-slate-500" title={user?.email}>
            {user?.email || user?.name}
          </div>
        )}
        <button
          type="button"
          onClick={handleLogout}
          title="Sign out"
          className={`flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-sm text-slate-300 transition-colors hover:bg-navy-800 hover:text-white ${
            effectiveCollapsed ? 'justify-center' : ''
          }`}
        >
          <LogOut size={16} className="shrink-0" />
          {!effectiveCollapsed && <span>Sign Out</span>}
        </button>
      </div>
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
        <header className="no-print sticky top-0 z-30 border-b border-border bg-panel px-3 py-2 shadow-sm sm:px-4 lg:py-0">
          <div className="grid grid-cols-[auto_1fr_auto] items-center gap-x-2 gap-y-2 lg:flex lg:h-14 lg:gap-3">
            <button type="button" className="col-start-1 row-start-1 shrink-0 rounded-md p-1.5 text-slate-600 hover:bg-slate-100 lg:hidden" onClick={() => setMobileOpen(true)} aria-label="Menu">
              <Menu size={18} />
            </button>

            <div className="relative col-span-3 row-start-2 min-w-0 lg:row-start-auto lg:max-w-xl lg:flex-1" ref={searchRef}>
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                value={searchQ}
                onChange={(e) => { setSearchQ(e.target.value); setSearchOpen(true); }}
                onFocus={() => setSearchOpen(true)}
                placeholder="Search orders, SKUs, shipments…"
                className="w-full rounded-md border border-border bg-slate-50 py-1.5 pl-8 pr-3 text-sm outline-none focus:border-accent focus:bg-white"
                aria-label="Global search"
              />
              {searchOpen && searchResults.length > 0 && (
                <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-[min(50dvh,16rem)] overflow-y-auto rounded-md border border-border bg-white shadow-lg scrollbar-thin">
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

            <span className="hidden rounded border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-700 xl:inline">
              Demo Environment
            </span>
            {modeLabel && (
              <span className={`hidden rounded border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide xl:inline ${
                businessMode === 'import'
                  ? 'border-sky-200 bg-sky-50 text-sky-800'
                  : 'border-emerald-200 bg-emerald-50 text-emerald-800'
              }`}>
                {modeLabel} mode
              </span>
            )}
            {user?.companyName && (
              <span className="hidden max-w-[140px] truncate text-xs text-slate-500 2xl:inline" title={user.companyName}>
                {user.companyName}
              </span>
            )}

            <button type="button" className="btn-secondary hidden shrink-0 md:inline-flex lg:order-none" onClick={() => setTourOpen(true)}>
              <Play size={14} /> <span className="hidden lg:inline">Start Demo Tour</span><span className="lg:hidden">Tour</span>
            </button>

            <div className="col-start-3 row-start-1 flex shrink-0 items-center gap-0.5 sm:gap-1.5" ref={headerMenuRef}>
            <div className="relative">
              <button type="button" className="relative rounded-md p-1.5 text-slate-600 hover:bg-slate-100" onClick={() => { setNotifOpen((v) => !v); setRoleOpen(false); setProfileOpen(false); }} aria-label="Notifications">
                <Bell size={18} />
                {unreadAlerts > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[10px] text-white">
                    {unreadAlerts > 9 ? '9+' : unreadAlerts}
                  </span>
                )}
              </button>
              {notifOpen && (
                <div className="absolute right-0 top-full z-50 mt-1 w-[min(100vw-1.5rem,20rem)] overflow-hidden rounded-md border border-border bg-white shadow-lg">
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

            <div className="relative max-sm:hidden">
              <button type="button" className="flex max-w-[5.5rem] items-center gap-0.5 rounded-md border border-border px-1.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50 sm:max-w-none sm:gap-1 sm:px-2" onClick={() => { setRoleOpen((v) => !v); setProfileOpen(false); setNotifOpen(false); }}>
                <span className="truncate">{role}</span> <ChevronDown size={12} className="shrink-0" />
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
              <button type="button" className="flex items-center gap-2 rounded-md p-1 hover:bg-slate-100" onClick={() => { setProfileOpen((v) => !v); setRoleOpen(false); setNotifOpen(false); }}>
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-navy-800 text-xs font-semibold text-white">
                  {(user?.name || 'U').slice(0, 1)}
                </div>
                <span className="hidden text-sm font-medium text-slate-700 md:inline">{user?.name}</span>
                <ChevronDown size={12} className="hidden text-slate-500 md:inline" />
              </button>
              {profileOpen && (
                <div className="absolute right-0 top-full z-50 mt-1 w-52 overflow-hidden rounded-md border border-border bg-white shadow-lg">
                  <div className="border-b border-border px-3 py-2">
                    <p className="text-sm font-medium text-navy-900">{user?.name}</p>
                    <p className="truncate text-xs text-slate-500">{user?.email}</p>
                  </div>
                  <button type="button" className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-slate-50" onClick={() => { navigate('/settings'); setProfileOpen(false); }}>
                    <User size={14} /> Settings
                  </button>
                  <div className="border-t border-border py-1 sm:hidden">
                    <p className="px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-400">Role view</p>
                    {roles.map((r) => (
                      <button
                        key={r}
                        type="button"
                        className={`block w-full px-3 py-2 text-left text-sm hover:bg-slate-50 ${r === role ? 'bg-blue-50 text-accent font-medium' : ''}`}
                        onClick={() => { setRole(r); setProfileOpen(false); toast(`Switched to ${r} view`); }}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                  <button type="button" className="flex w-full items-center gap-2 px-3 py-2 text-sm text-danger hover:bg-red-50" onClick={handleLogout}>
                    <LogOut size={14} /> Sign Out
                  </button>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="hidden items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-danger sm:inline-flex"
              title="Sign out"
            >
              <LogOut size={14} />
              <span className="hidden sm:inline">Logout</span>
            </button>
            </div>
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
