import { Plan } from '../models/Plan.js';
import { Tenant } from '../models/Tenant.js';
import { Subscription } from '../models/Subscription.js';
import { AuditLog } from '../models/AuditLog.js';
import { httpError } from '../middleware/errorHandler.js';
import { ok, created } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

function mapPlan(p) {
  return {
    id: p.key || p._id.toString(),
    _id: p._id.toString(),
    name: p.name,
    description: p.description,
    monthlyPrice: p.monthlyPrice,
    yearlyPrice: p.yearlyPrice,
    currency: p.currency,
    popular: p.popular,
    active: p.active,
    features: p.features || [],
    usersAllowed: p.usersAllowed,
  };
}

function mapTenant(t, planKeyMap = {}) {
  const planId = t.planId?._id?.toString() || t.planId?.toString() || t.planId;
  const planKey = t.planId?.key || planKeyMap[planId] || planId;
  return {
    id: t.key || t._id.toString(),
    _id: t._id.toString(),
    companyName: t.companyName,
    contactName: t.contactName,
    email: t.email,
    phone: t.phone,
    businessMode: t.businessMode,
    status: t.status,
    planId: planKey,
    planMongoId: planId,
    billingCycle: t.billingCycle,
    usersAllowed: t.usersAllowed,
    createdAt: t.createdAt,
    activatedAt: t.activatedAt,
    notes: t.notes,
  };
}

function mapSubscription(s, maps = {}) {
  const tenantId = s.tenantId?._id?.toString() || s.tenantId?.toString();
  const planId = s.planId?._id?.toString() || s.planId?.toString();
  return {
    id: s.key || s._id.toString(),
    _id: s._id.toString(),
    tenantId: s.tenantId?.key || maps.tenantKeys?.[tenantId] || tenantId,
    planId: s.planId?.key || maps.planKeys?.[planId] || planId,
    billingCycle: s.billingCycle,
    amount: s.amount,
    status: s.status,
    paymentRef: s.paymentRef,
    startedAt: s.startedAt,
    renewsAt: s.renewsAt,
  };
}

async function planKeyLookup() {
  const plans = await Plan.find();
  const byId = {};
  const byKey = {};
  plans.forEach((p) => {
    byId[p._id.toString()] = p.key || p._id.toString();
    byKey[p.key] = p;
  });
  return { byId, byKey, plans };
}

export const listPlans = asyncHandler(async (req, res) => {
  const plans = await Plan.find().sort({ monthlyPrice: 1 });
  return ok(res, plans.map(mapPlan));
});

export const updatePlan = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const plan = (await Plan.findOne({ key: id })) || (await Plan.findById(id).catch(() => null));
  if (!plan) throw httpError(404, 'Plan not found');

  const fields = ['name', 'description', 'monthlyPrice', 'yearlyPrice', 'popular', 'active', 'features', 'usersAllowed'];
  fields.forEach((f) => {
    if (req.body[f] !== undefined) plan[f] = req.body[f];
  });
  await plan.save();

  await AuditLog.create({
    actorId: req.user._id,
    actorEmail: req.user.email,
    action: 'plan.update',
    entity: 'Plan',
    entityId: plan._id.toString(),
    meta: req.body,
  });

  return ok(res, mapPlan(plan), 'Plan updated');
});

export const listBuyers = asyncHandler(async (req, res) => {
  const { byId } = await planKeyLookup();
  const tenants = await Tenant.find().populate('planId').sort({ createdAt: -1 });
  return ok(res, tenants.map((t) => mapTenant(t, byId)));
});

export const createBuyerPurchase = asyncHandler(async (req, res) => {
  const {
    companyName,
    contactName,
    email,
    phone,
    planId,
    billingCycle = 'monthly',
  } = req.body;

  if (!companyName || !contactName || !email || !planId) {
    throw httpError(400, 'companyName, contactName, email and planId are required');
  }

  const { byKey, byId } = await planKeyLookup();
  let plan = byKey[planId];
  if (!plan) {
    plan = await Plan.findById(planId).catch(() => null);
  }
  if (!plan || !plan.active) throw httpError(404, 'Plan not found or inactive');

  const cycle = billingCycle === 'yearly' ? 'yearly' : 'monthly';
  const amount = cycle === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice;

  const tenant = await Tenant.create({
    companyName,
    contactName,
    email: String(email).toLowerCase(),
    phone: phone || '',
    businessMode: null,
    status: 'Pending Approval',
    planId: plan._id,
    billingCycle: cycle,
    usersAllowed: plan.usersAllowed,
    notes: 'Purchased via landing page — awaiting Superadmin activation',
  });

  const subscription = await Subscription.create({
    tenantId: tenant._id,
    planId: plan._id,
    billingCycle: cycle,
    amount,
    status: 'Pending Activation',
    paymentRef: `PAY-${Date.now()}`,
  });

  await AuditLog.create({
    action: 'buyer.purchase',
    entity: 'Tenant',
    entityId: tenant._id.toString(),
    meta: { email, plan: plan.key, billingCycle: cycle },
  });

  return created(res, {
    buyer: mapTenant(tenant, byId),
    subscription: mapSubscription(subscription, { planKeys: byId }),
  }, 'Purchase request received — pending Superadmin approval');
});

export const approveBuyer = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const mode = req.body.businessMode === 'import' ? 'import' : req.body.businessMode === 'export' ? 'export' : null;
  if (!mode) throw httpError(400, 'businessMode must be export or import');

  const tenant =
    (await Tenant.findOne({ key: id })) ||
    (await Tenant.findById(id).catch(() => null));
  if (!tenant) throw httpError(404, 'Buyer not found');

  tenant.businessMode = mode;
  tenant.status = 'Active';
  tenant.activatedAt = new Date();
  await tenant.save();

  const now = new Date();
  const renews = new Date(now);
  if (tenant.billingCycle === 'yearly') renews.setFullYear(renews.getFullYear() + 1);
  else renews.setMonth(renews.getMonth() + 1);

  await Subscription.findOneAndUpdate(
    { tenantId: tenant._id },
    { status: 'Active', startedAt: now, renewsAt: renews },
    { sort: { createdAt: -1 } }
  );

  const { byId } = await planKeyLookup();
  await AuditLog.create({
    actorId: req.user._id,
    actorEmail: req.user.email,
    tenantId: tenant._id,
    action: 'buyer.approve',
    entity: 'Tenant',
    entityId: tenant._id.toString(),
    meta: { businessMode: mode },
  });

  return ok(res, mapTenant(await tenant.populate('planId'), byId), `Buyer activated in ${mode} mode`);
});

export const suspendBuyer = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const tenant =
    (await Tenant.findOne({ key: id })) ||
    (await Tenant.findById(id).catch(() => null));
  if (!tenant) throw httpError(404, 'Buyer not found');

  tenant.status = 'Suspended';
  await tenant.save();
  await Subscription.updateMany({ tenantId: tenant._id }, { status: 'Suspended' });

  const { byId } = await planKeyLookup();
  await AuditLog.create({
    actorId: req.user._id,
    actorEmail: req.user.email,
    tenantId: tenant._id,
    action: 'buyer.suspend',
    entity: 'Tenant',
    entityId: tenant._id.toString(),
  });

  return ok(res, mapTenant(tenant, byId), 'Buyer suspended');
});

export const listSubscriptions = asyncHandler(async (req, res) => {
  const plans = await Plan.find();
  const tenants = await Tenant.find();
  const planKeys = Object.fromEntries(plans.map((p) => [p._id.toString(), p.key || p._id.toString()]));
  const tenantKeys = Object.fromEntries(tenants.map((t) => [t._id.toString(), t.key || t._id.toString()]));

  const subs = await Subscription.find().populate('tenantId').populate('planId').sort({ createdAt: -1 });
  return ok(res, subs.map((s) => mapSubscription(s, { planKeys, tenantKeys })));
});

export const changeSubscriptionPlan = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { planId, billingCycle } = req.body;

  const sub =
    (await Subscription.findOne({ key: id })) ||
    (await Subscription.findById(id).catch(() => null));
  if (!sub) throw httpError(404, 'Subscription not found');

  const { byKey, byId } = await planKeyLookup();
  let plan = byKey[planId];
  if (!plan) plan = await Plan.findById(planId).catch(() => null);
  if (!plan) throw httpError(404, 'Plan not found');

  const cycle = billingCycle === 'yearly' ? 'yearly' : billingCycle === 'monthly' ? 'monthly' : sub.billingCycle;
  sub.planId = plan._id;
  sub.billingCycle = cycle;
  sub.amount = cycle === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice;
  await sub.save();

  await Tenant.findByIdAndUpdate(sub.tenantId, {
    planId: plan._id,
    billingCycle: cycle,
    usersAllowed: plan.usersAllowed,
  });

  const tenants = await Tenant.find();
  const tenantKeys = Object.fromEntries(tenants.map((t) => [t._id.toString(), t.key || t._id.toString()]));

  return ok(res, mapSubscription(sub, { planKeys: byId, tenantKeys }), 'Subscription plan updated');
});
