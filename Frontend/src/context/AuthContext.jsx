import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { AUTH_STORAGE_KEY, ROLE_STORAGE_KEY, USE_MOCK_API } from '../config/api';
import { DEMO_CREDENTIALS, ROLES, ROLE_LIST } from '../constants';
import { ROLE_PERMISSIONS } from '../data/mockSystem';
import { DEMO_LOGINS, BUSINESS_MODE_LABELS } from '../data/mockSaas';
import { apiPost, apiGet, setAuthToken } from '../services/apiClient';

const AuthContext = createContext(null);

const ROLE_NAV_FILTER = {
  [ROLES.INDIA_WAREHOUSE]: ['Overview', 'Commerce', 'Catalog', 'Inventory', 'Warehouse', 'Replenishment', 'Shipping', 'System'],
  [ROLES.USA_WAREHOUSE]: ['Overview', 'Commerce', 'Inventory', 'Warehouse', 'Replenishment', 'Shipping', 'Returns', 'System'],
  [ROLES.ACCOUNTS]: ['Overview', 'Commerce', 'Export', 'Finance', 'Analytics', 'System'],
  [ROLES.SALES]: ['Overview', 'Commerce', 'Catalog', 'Analytics', 'System'],
  [ROLES.LOGISTICS]: ['Overview', 'Commerce', 'Warehouse', 'Replenishment', 'Shipping', 'Export', 'Returns', 'System'],
  [ROLES.AUDITOR]: ['Overview', 'Commerce', 'Catalog', 'Inventory', 'Warehouse', 'Shipping', 'Export', 'Returns', 'Finance', 'Analytics', 'System'],
};

function readTenantsFromStorage() {
  try {
    const raw = localStorage.getItem('rugos_saas_v1');
    if (!raw) return null;
    return JSON.parse(raw)?.tenants || null;
  } catch {
    return null;
  }
}

function defaultAppTenant() {
  const tenants = readTenantsFromStorage();
  return (
    tenants?.find((t) => t.id === 'ten-001') || {
      id: 'ten-001',
      businessMode: 'export',
      companyName: 'Rugos Demo Exports Pvt Ltd',
      planId: 'plan-growth',
      status: 'Active',
    }
  );
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem(AUTH_STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  const [role, setRoleState] = useState(() => localStorage.getItem(ROLE_STORAGE_KEY) || ROLES.MANAGEMENT);

  useEffect(() => {
    if (user) localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    else localStorage.removeItem(AUTH_STORAGE_KEY);
  }, [user]);

  useEffect(() => {
    localStorage.setItem(ROLE_STORAGE_KEY, role);
  }, [role]);

  // Refresh session from API when token exists
  useEffect(() => {
    if (USE_MOCK_API || !user) return;
    apiGet('/auth/me')
      .then((data) => {
        if (data?.user) {
          setUser((prev) => ({ ...prev, ...data.user }));
          if (!data.user.isPlatformAdmin && data.user.role) setRoleState(data.user.role);
        }
      })
      .catch(() => {
        /* keep cached user if offline */
      });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const login = useCallback(async (email, password) => {
    // Live API
    if (!USE_MOCK_API) {
      try {
        const data = await apiPost('/auth/login', { email, password });
        setAuthToken(data.token);
        setUser(data.user);
        setRoleState(data.user.isPlatformAdmin ? ROLES.SUPER_ADMIN : data.user.role || ROLES.SUPER_ADMIN);
        return { ok: true, redirectTo: data.redirectTo || (data.user.isPlatformAdmin ? '/superadmin/buyers' : '/dashboard') };
      } catch (err) {
        return {
          ok: false,
          error: err.message || 'Invalid credentials. Use admin@rugos.demo / demo123 or superadmin@rugos.demo / demo123.',
        };
      }
    }

    // Mock fallback
    await new Promise((r) => setTimeout(r, 400));

    const account = DEMO_LOGINS.find(
      (d) => d.email.toLowerCase() === email.toLowerCase() && d.password === password
    );

    const isLegacyAdmin =
      !account &&
      email.toLowerCase() === DEMO_CREDENTIALS.email.toLowerCase() &&
      password === DEMO_CREDENTIALS.password;

    if (!account && !isLegacyAdmin) {
      return {
        ok: false,
        error: 'Invalid credentials. Use admin@rugos.demo / demo123 (app) or superadmin@rugos.demo / demo123 (SaaS).',
      };
    }

    if (account?.isPlatformAdmin) {
      const u = {
        name: account.name,
        email: account.email,
        role: 'Platform Superadmin',
        isPlatformAdmin: true,
        tenantId: null,
        businessMode: null,
        companyName: 'RugOS Platform',
      };
      setUser(u);
      setRoleState(ROLES.SUPER_ADMIN);
      return { ok: true, redirectTo: '/superadmin/buyers' };
    }

    const tenant = defaultAppTenant();
    const u = {
      name: account?.name || 'Arjun Mehta',
      email: account?.email || email,
      role: account?.role || ROLES.SUPER_ADMIN,
      isPlatformAdmin: false,
      tenantId: tenant.id,
      businessMode: tenant.businessMode || 'export',
      companyName: tenant.companyName,
      planId: tenant.planId,
    };
    setUser(u);
    setRoleState(account?.role || ROLES.SUPER_ADMIN);
    return { ok: true, redirectTo: '/dashboard' };
  }, []);

  const quickLogin = useCallback(async (selectedRole) => {
    if (!USE_MOCK_API) {
      try {
        const data = await apiPost('/auth/quick-login', { role: selectedRole });
        setAuthToken(data.token);
        setUser(data.user);
        setRoleState(data.user.role || selectedRole);
        return { ok: true, redirectTo: data.redirectTo || '/dashboard' };
      } catch (err) {
        return { ok: false, error: err.message || 'Quick login failed' };
      }
    }

    const tenant = defaultAppTenant();
    const u = {
      name: selectedRole === ROLES.SUPER_ADMIN ? 'Arjun Mehta' : `${selectedRole} User`,
      email: 'admin@rugos.demo',
      role: selectedRole,
      isPlatformAdmin: false,
      tenantId: tenant.id,
      businessMode: tenant.businessMode || 'export',
      companyName: tenant.companyName,
      planId: tenant.planId,
    };
    setUser(u);
    setRoleState(selectedRole);
    return { ok: true, redirectTo: '/dashboard' };
  }, []);

  const logout = useCallback(() => {
    if (!USE_MOCK_API) {
      apiPost('/auth/logout', {}).catch(() => {});
    }
    setAuthToken(null);
    setUser(null);
  }, []);

  const setRole = useCallback((r) => {
    if (!USE_MOCK_API) {
      apiPost('/auth/switch-role', { role: r })
        .then((data) => {
          setAuthToken(data.token);
          setUser(data.user);
          setRoleState(data.user.role || r);
        })
        .catch(() => {
          setRoleState(r);
          setUser((prev) => (prev ? { ...prev, role: r, isPlatformAdmin: false } : prev));
        });
      return;
    }
    setRoleState(r);
    setUser((prev) => (prev ? { ...prev, role: r, isPlatformAdmin: false } : prev));
  }, []);

  const can = useCallback(
    (module, action = 'View') => {
      const perms = ROLE_PERMISSIONS[role] || {};
      const actions = perms[module] || [];
      return actions.includes(action);
    },
    [role]
  );

  const visibleNavGroups = useCallback(
    (allGroups) => {
      if (user?.isPlatformAdmin) return [];
      const allowed = ROLE_NAV_FILTER[role];
      if (!allowed || role === ROLES.MANAGEMENT || role === ROLES.SUPER_ADMIN || role === ROLES.AUDITOR) {
        return allGroups;
      }
      return allGroups.filter((g) => allowed.includes(g.label));
    },
    [role, user]
  );

  const modeLabel = user?.businessMode ? BUSINESS_MODE_LABELS[user.businessMode] : null;

  const value = useMemo(
    () => ({
      user,
      role,
      roles: ROLE_LIST,
      login,
      quickLogin,
      logout,
      setRole,
      can,
      visibleNavGroups,
      isAuthenticated: !!user,
      isPlatformAdmin: !!user?.isPlatformAdmin,
      businessMode: user?.businessMode || null,
      modeLabel,
    }),
    [user, role, login, quickLogin, logout, setRole, can, visibleNavGroups, modeLabel]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
