import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { mockPlans, mockSubscriptions, mockTenants } from '../data/mockSaas';
import { BUSINESS_MODES } from '../data/mockSaas';
import { USE_MOCK_API } from '../config/api';
import { apiGet, apiPost, apiPatch } from '../services/apiClient';
import { useAuth } from './AuthContext';

const SAAS_STORAGE_KEY = 'rugos_saas_v1';

const SaasContext = createContext(null);

function seedSaas() {
  return JSON.parse(JSON.stringify({
    plans: mockPlans,
    tenants: mockTenants,
    subscriptions: mockSubscriptions,
  }));
}

function loadSaas() {
  try {
    const raw = localStorage.getItem(SAAS_STORAGE_KEY);
    if (!raw) return seedSaas();
    return { ...seedSaas(), ...JSON.parse(raw) };
  } catch {
    return seedSaas();
  }
}

export function SaasProvider({ children }) {
  const { isPlatformAdmin, isAuthenticated } = useAuth();
  const [state, setState] = useState(USE_MOCK_API ? loadSaas : { plans: [], tenants: [], subscriptions: [] });
  const [toastMsg, setToastMsg] = useState(null);
  const [loaded, setLoaded] = useState(USE_MOCK_API);

  const notify = useCallback((message) => {
    setToastMsg(message);
    setTimeout(() => setToastMsg(null), 3200);
  }, []);

  const refreshFromApi = useCallback(async () => {
    if (USE_MOCK_API) return;
    try {
      const plans = await apiGet('/saas/plans');
      let tenants = [];
      let subscriptions = [];
      if (isAuthenticated && isPlatformAdmin) {
        [tenants, subscriptions] = await Promise.all([
          apiGet('/saas/buyers'),
          apiGet('/saas/subscriptions'),
        ]);
      }
      setState({ plans: plans || [], tenants: tenants || [], subscriptions: subscriptions || [] });
      setLoaded(true);
    } catch (err) {
      console.error('SaaS load failed', err);
      setLoaded(true);
    }
  }, [isAuthenticated, isPlatformAdmin]);

  useEffect(() => {
    if (USE_MOCK_API) {
      localStorage.setItem(SAAS_STORAGE_KEY, JSON.stringify(state));
    }
  }, [state]);

  useEffect(() => {
    refreshFromApi();
  }, [refreshFromApi]);

  const resetSaasData = useCallback(() => {
    if (!USE_MOCK_API) {
      notify('Reset via API seed: run npm run seed in Backend');
      refreshFromApi();
      return;
    }
    const seed = seedSaas();
    setState(seed);
    localStorage.setItem(SAAS_STORAGE_KEY, JSON.stringify(seed));
    notify('SaaS demo data reset');
  }, [notify, refreshFromApi]);

  const updatePlan = useCallback(async (planId, patch) => {
    if (!USE_MOCK_API) {
      const updated = await apiPatch(`/saas/plans/${planId}`, patch);
      setState((prev) => ({
        ...prev,
        plans: prev.plans.map((p) => (p.id === planId || p._id === planId ? { ...p, ...updated } : p)),
      }));
      notify('Plan pricing updated');
      return;
    }
    setState((prev) => ({
      ...prev,
      plans: prev.plans.map((p) => (p.id === planId ? { ...p, ...patch } : p)),
    }));
    notify('Plan pricing updated');
  }, [notify]);

  const togglePlanActive = useCallback(async (planId) => {
    const plan = state.plans.find((p) => p.id === planId || p._id === planId);
    if (!plan) return;
    if (!USE_MOCK_API) {
      await updatePlan(planId, { active: !plan.active });
      return;
    }
    setState((prev) => ({
      ...prev,
      plans: prev.plans.map((p) => (p.id === planId ? { ...p, active: !p.active } : p)),
    }));
    notify('Plan status updated');
  }, [state.plans, updatePlan, notify]);

  const requestSubscription = useCallback(async ({ companyName, contactName, email, phone, planId, billingCycle }) => {
    if (!USE_MOCK_API) {
      try {
        await apiPost('/saas/buyers/purchase', {
          companyName, contactName, email, phone, planId, billingCycle,
        });
        notify('Purchase request submitted — Superadmin will activate after mode selection');
        return { ok: true };
      } catch (err) {
        return { ok: false, error: err.message };
      }
    }

    const plan = state.plans.find((p) => p.id === planId);
    if (!plan) return { ok: false, error: 'Plan not found' };

    const tenantId = `ten-${Date.now()}`;
    const subId = `sub-${Date.now()}`;
    const amount = billingCycle === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice;

    setState((prev) => ({
      ...prev,
      tenants: [
        {
          id: tenantId,
          companyName,
          contactName,
          email,
          phone: phone || '',
          businessMode: null,
          status: 'Pending Approval',
          planId,
          billingCycle,
          usersAllowed: planId === 'plan-enterprise' ? 999 : planId === 'plan-growth' ? 15 : 3,
          createdAt: new Date().toISOString(),
          activatedAt: null,
          notes: `New ${billingCycle} purchase request for ${plan.name}`,
        },
        ...prev.tenants,
      ],
      subscriptions: [
        {
          id: subId,
          tenantId,
          planId,
          billingCycle,
          amount,
          status: 'Pending Activation',
          startedAt: null,
          renewsAt: null,
          paymentRef: `PAY-DEMO-${Date.now().toString().slice(-6)}`,
        },
        ...prev.subscriptions,
      ],
    }));

    notify('Purchase request submitted — Superadmin will activate after mode selection');
    return { ok: true, tenantId };
  }, [state.plans, notify]);

  const approveTenant = useCallback(async (tenantId, businessMode) => {
    if (businessMode !== BUSINESS_MODES.EXPORT && businessMode !== BUSINESS_MODES.IMPORT) {
      return { ok: false, error: 'Choose Import or Export mode' };
    }

    if (!USE_MOCK_API) {
      try {
        await apiPost(`/saas/buyers/${tenantId}/approve`, { businessMode });
        await refreshFromApi();
        notify(`Buyer activated in ${businessMode.toUpperCase()} mode`);
        return { ok: true };
      } catch (err) {
        return { ok: false, error: err.message };
      }
    }

    setState((prev) => {
      const tenant = prev.tenants.find((t) => t.id === tenantId);
      if (!tenant) return prev;
      const plan = prev.plans.find((p) => p.id === tenant.planId);
      const startedAt = new Date().toISOString();
      const renewsAt = new Date(
        Date.now() + (tenant.billingCycle === 'yearly' ? 365 : 30) * 86400000
      ).toISOString();

      return {
        ...prev,
        tenants: prev.tenants.map((t) =>
          t.id === tenantId
            ? {
                ...t,
                businessMode,
                status: 'Active',
                activatedAt: startedAt,
                notes: `${t.notes || ''} · Activated as ${businessMode.toUpperCase()} mode`,
              }
            : t
        ),
        subscriptions: prev.subscriptions.map((s) =>
          s.tenantId === tenantId
            ? {
                ...s,
                status: 'Active',
                startedAt,
                renewsAt,
                amount: tenant.billingCycle === 'yearly' ? plan?.yearlyPrice : plan?.monthlyPrice,
              }
            : s
        ),
      };
    });

    notify(`Tenant activated in ${businessMode.toUpperCase()} mode`);
    return { ok: true };
  }, [notify, refreshFromApi]);

  const suspendTenant = useCallback(async (tenantId) => {
    if (!USE_MOCK_API) {
      await apiPost(`/saas/buyers/${tenantId}/suspend`, {});
      await refreshFromApi();
      notify('Buyer suspended');
      return;
    }
    setState((prev) => ({
      ...prev,
      tenants: prev.tenants.map((t) => (t.id === tenantId ? { ...t, status: 'Suspended' } : t)),
      subscriptions: prev.subscriptions.map((s) =>
        s.tenantId === tenantId ? { ...s, status: 'Suspended' } : s
      ),
    }));
    notify('Tenant suspended');
  }, [notify, refreshFromApi]);

  const changeTenantPlan = useCallback(async (tenantId, planId, billingCycle) => {
    if (!USE_MOCK_API) {
      const sub = state.subscriptions.find((s) => s.tenantId === tenantId);
      if (!sub) return;
      await apiPatch(`/saas/subscriptions/${sub.id}`, { planId, billingCycle });
      await refreshFromApi();
      notify('Subscription plan updated');
      return;
    }
    const plan = state.plans.find((p) => p.id === planId);
    if (!plan) return;
    setState((prev) => ({
      ...prev,
      tenants: prev.tenants.map((t) =>
        t.id === tenantId ? { ...t, planId, billingCycle: billingCycle || t.billingCycle } : t
      ),
      subscriptions: prev.subscriptions.map((s) =>
        s.tenantId === tenantId
          ? {
              ...s,
              planId,
              billingCycle: billingCycle || s.billingCycle,
              amount: (billingCycle || s.billingCycle) === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice,
            }
          : s
      ),
    }));
    notify('Subscription plan updated');
  }, [state.plans, state.subscriptions, notify, refreshFromApi]);

  const getTenant = useCallback((tenantId) => state.tenants.find((t) => t.id === tenantId), [state.tenants]);
  const getPlan = useCallback((planId) => state.plans.find((p) => p.id === planId), [state.plans]);

  const pendingTenants = useMemo(
    () => state.tenants.filter((t) => t.status === 'Pending Approval'),
    [state.tenants]
  );

  const value = useMemo(
    () => ({
      plans: state.plans,
      tenants: state.tenants,
      subscriptions: state.subscriptions,
      pendingTenants,
      toastMsg,
      loaded,
      updatePlan,
      togglePlanActive,
      requestSubscription,
      approveTenant,
      suspendTenant,
      changeTenantPlan,
      getTenant,
      getPlan,
      resetSaasData,
      refreshFromApi,
    }),
    [
      state, pendingTenants, toastMsg, loaded, updatePlan, togglePlanActive, requestSubscription,
      approveTenant, suspendTenant, changeTenantPlan, getTenant, getPlan, resetSaasData, refreshFromApi,
    ]
  );

  return <SaasContext.Provider value={value}>{children}</SaasContext.Provider>;
}

export function useSaas() {
  const ctx = useContext(SaasContext);
  if (!ctx) throw new Error('useSaas must be used within SaasProvider');
  return ctx;
}
