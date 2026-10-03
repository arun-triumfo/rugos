import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { AUTH_STORAGE_KEY, ROLE_STORAGE_KEY } from '../config/api';
import { DEMO_CREDENTIALS, ROLES, ROLE_LIST } from '../constants';
import { ROLE_PERMISSIONS } from '../data/mockSystem';
import { TENANT_DEMO_LOGINS, BUSINESS_MODE_LABELS } from '../data/mockSaas';

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

  const login = useCallback(async (email, password) => {
    await new Promise((r) => setTimeout(r, 400));

    const demo = TENANT_DEMO_LOGINS.find(
      (d) => d.email.toLowerCase() === email.toLowerCase() && d.password === password
    );

    if (!demo && !(email === DEMO_CREDENTIALS.email && password === DEMO_CREDENTIALS.password)) {
      return { ok: false, error: 'Invalid credentials. Try admin@rugos.demo / demo123 or tenant demos.' };
    }

    const account = demo || {
      email,
      tenantId: null,
      name: 'Arjun Mehta',
      role: ROLES.SUPER_ADMIN,
      isPlatformAdmin: true,
    };

    if (account.isPlatformAdmin) {
      const u = {
        name: account.name,
        email: account.email,
        role: ROLES.SUPER_ADMIN,
        isPlatformAdmin: true,
        tenantId: null,
        businessMode: null,
        companyName: 'RugOS Platform',
      };
      setUser(u);
      setRoleState(ROLES.SUPER_ADMIN);
      return { ok: true, redirectTo: '/superadmin' };
    }

    const tenants = readTenantsFromStorage();
    const tenant = tenants?.find((t) => t.id === account.tenantId || t.email?.toLowerCase() === email.toLowerCase());

    if (!tenant) {
      return { ok: false, error: 'Tenant not found. Complete purchase and wait for Superadmin activation.' };
    }
    if (tenant.status === 'Pending Approval') {
      return { ok: false, error: 'Account pending Superadmin approval. Import or Export mode not assigned yet.' };
    }
    if (tenant.status === 'Suspended') {
      return { ok: false, error: 'Account suspended. Contact RugOS Superadmin.' };
    }
    if (!tenant.businessMode) {
      return { ok: false, error: 'Business mode not set. Superadmin must choose Import or Export.' };
    }

    const u = {
      name: account.name || tenant.contactName,
      email: account.email || tenant.email,
      role: account.role || ROLES.MANAGEMENT,
      isPlatformAdmin: false,
      tenantId: tenant.id,
      businessMode: tenant.businessMode,
      companyName: tenant.companyName,
      planId: tenant.planId,
    };
    setUser(u);
    setRoleState(account.role || ROLES.MANAGEMENT);
    return { ok: true, redirectTo: '/dashboard' };
  }, []);

  const quickLogin = useCallback((selectedRole) => {
    if (selectedRole === ROLES.SUPER_ADMIN) {
      const u = {
        name: 'Arjun Mehta',
        email: 'admin@rugos.demo',
        role: ROLES.SUPER_ADMIN,
        isPlatformAdmin: true,
        tenantId: null,
        businessMode: null,
        companyName: 'RugOS Platform',
      };
      setUser(u);
      setRoleState(ROLES.SUPER_ADMIN);
      return { redirectTo: '/superadmin' };
    }

    // Tenant demo — export mode company by default for role previews
    const tenants = readTenantsFromStorage();
    const tenant = tenants?.find((t) => t.id === 'ten-001') || {
      id: 'ten-001',
      businessMode: 'export',
      companyName: 'Rugos Demo Exports Pvt Ltd',
      planId: 'plan-growth',
      status: 'Active',
    };

    const u = {
      name: `${selectedRole} User`,
      email: 'tenant@rugos.demo',
      role: selectedRole,
      isPlatformAdmin: false,
      tenantId: tenant.id,
      businessMode: tenant.businessMode || 'export',
      companyName: tenant.companyName,
      planId: tenant.planId,
    };
    setUser(u);
    setRoleState(selectedRole);
    return { redirectTo: '/dashboard' };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const setRole = useCallback((r) => {
    setRoleState(r);
    setUser((prev) => (prev ? { ...prev, role: r } : prev));
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
