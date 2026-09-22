import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { AUTH_STORAGE_KEY, ROLE_STORAGE_KEY } from '../config/api';
import { DEMO_CREDENTIALS, ROLES, ROLE_LIST } from '../constants';
import { ROLE_PERMISSIONS } from '../data/mockSystem';

const AuthContext = createContext(null);

const ROLE_NAV_FILTER = {
  [ROLES.INDIA_WAREHOUSE]: ['Overview', 'Commerce', 'Catalog', 'Inventory', 'Warehouse', 'Replenishment', 'Shipping', 'System'],
  [ROLES.USA_WAREHOUSE]: ['Overview', 'Commerce', 'Inventory', 'Warehouse', 'Replenishment', 'Shipping', 'Returns', 'System'],
  [ROLES.ACCOUNTS]: ['Overview', 'Commerce', 'Export', 'Finance', 'Analytics', 'System'],
  [ROLES.SALES]: ['Overview', 'Commerce', 'Catalog', 'Analytics', 'System'],
  [ROLES.LOGISTICS]: ['Overview', 'Commerce', 'Warehouse', 'Replenishment', 'Shipping', 'Export', 'Returns', 'System'],
  [ROLES.AUDITOR]: ['Overview', 'Commerce', 'Catalog', 'Inventory', 'Warehouse', 'Shipping', 'Export', 'Returns', 'Finance', 'Analytics', 'System'],
};

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
    if (email === DEMO_CREDENTIALS.email && password === DEMO_CREDENTIALS.password) {
      const u = { name: 'Arjun Mehta', email, role: ROLES.SUPER_ADMIN };
      setUser(u);
      setRoleState(ROLES.SUPER_ADMIN);
      return { ok: true };
    }
    return { ok: false, error: 'Invalid demo credentials. Use admin@rugos.demo / demo123' };
  }, []);

  const quickLogin = useCallback((selectedRole) => {
    const u = {
      name: selectedRole === ROLES.SUPER_ADMIN ? 'Arjun Mehta' : `${selectedRole} User`,
      email: 'admin@rugos.demo',
      role: selectedRole,
    };
    setUser(u);
    setRoleState(selectedRole);
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
      const allowed = ROLE_NAV_FILTER[role];
      if (!allowed || role === ROLES.MANAGEMENT || role === ROLES.SUPER_ADMIN || role === ROLES.AUDITOR) {
        return allGroups;
      }
      return allGroups.filter((g) => allowed.includes(g.label));
    },
    [role]
  );

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
    }),
    [user, role, login, quickLogin, logout, setRole, can, visibleNavGroups]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
