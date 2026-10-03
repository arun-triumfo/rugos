import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { mockPlans, mockSubscriptions, mockTenants } from '../data/mockSaas';
import { BUSINESS_MODES } from '../data/mockSaas';

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
  const [state, setState] = useState(loadSaas);
  const [toastMsg, setToastMsg] = useState(null);

  useEffect(() => {
    localStorage.setItem(SAAS_STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const notify = useCallback((message) => {
    setToastMsg(message);
    setTimeout(() => setToastMsg(null), 3200);
  }, []);

  const resetSaasData = useCallback(() => {
    const seed = seedSaas();
    setState(seed);
    localStorage.setItem(SAAS_STORAGE_KEY, JSON.stringify(seed));
    notify('SaaS demo data reset');
  }, [notify]);

  const updatePlan = useCallback((planId, patch) => {
    setState((prev) => ({
      ...prev,
      plans: prev.plans.map((p) => (p.id === planId ? { ...p, ...patch } : p)),
    }));
    notify('Plan pricing updated');
  }, [notify]);

  const togglePlanActive = useCallback((planId) => {
    setState((prev) => ({
      ...prev,
      plans: prev.plans.map((p) => (p.id === planId ? { ...p, active: !p.active } : p)),
    }));
    notify('Plan status updated');
  }, [notify]);

  /** Landing page purchase / trial request (demo — no payment gateway) */
  const requestSubscription = useCallback(({ companyName, contactName, email, phone, planId, billingCycle }) => {
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

  /**
   * Superadmin activates tenant and MUST choose Import OR Export.
   * One tenant can use only one mode.
   */
  const approveTenant = useCallback((tenantId, businessMode) => {
    if (businessMode !== BUSINESS_MODES.EXPORT && businessMode !== BUSINESS_MODES.IMPORT) {
      return { ok: false, error: 'Choose Import or Export mode' };
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
  }, [notify]);

  const suspendTenant = useCallback((tenantId) => {
    setState((prev) => ({
      ...prev,
      tenants: prev.tenants.map((t) => (t.id === tenantId ? { ...t, status: 'Suspended' } : t)),
      subscriptions: prev.subscriptions.map((s) =>
        s.tenantId === tenantId ? { ...s, status: 'Suspended' } : s
      ),
    }));
    notify('Tenant suspended');
  }, [notify]);

  const changeTenantPlan = useCallback((tenantId, planId, billingCycle) => {
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
  }, [state.plans, notify]);

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
      updatePlan,
      togglePlanActive,
      requestSubscription,
      approveTenant,
      suspendTenant,
      changeTenantPlan,
      getTenant,
      getPlan,
      resetSaasData,
    }),
    [
      state, pendingTenants, toastMsg, updatePlan, togglePlanActive, requestSubscription,
      approveTenant, suspendTenant, changeTenantPlan, getTenant, getPlan, resetSaasData,
    ]
  );

  return <SaasContext.Provider value={value}>{children}</SaasContext.Provider>;
}

export function useSaas() {
  const ctx = useContext(SaasContext);
  if (!ctx) throw new Error('useSaas must be used within SaasProvider');
  return ctx;
}
