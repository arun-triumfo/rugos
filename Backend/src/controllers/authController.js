import { User, ROLES } from '../models/User.js';
import { Tenant } from '../models/Tenant.js';
import { signToken } from '../middleware/auth.js';
import { httpError } from '../middleware/errorHandler.js';
import { ok } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const ROLE_EMAILS = {
  Management: 'management@rugos.demo',
  'India Warehouse': 'india.wh@rugos.demo',
  'USA Warehouse': 'usa.wh@rugos.demo',
  Accounts: 'accounts@rugos.demo',
  Sales: 'sales@rugos.demo',
  Logistics: 'logistics@rugos.demo',
  Auditor: 'auditor@rugos.demo',
  'Super Admin': 'admin@rugos.demo',
};

async function tenantExtras(user) {
  if (!user.tenantId) {
    return {
      businessMode: null,
      companyName: user.isPlatformAdmin ? 'RugOS Platform' : null,
      planId: null,
    };
  }
  const tenant = await Tenant.findById(user.tenantId);
  if (!tenant) return {};
  return {
    businessMode: tenant.businessMode,
    companyName: tenant.companyName,
    planId: tenant.planId?.toString() || null,
  };
}

function buildSession(user, authExtras = {}) {
  return {
    token: signToken(user),
    user: {
      ...user.toSafeJSON(),
      businessMode: authExtras.businessMode ?? null,
      companyName: authExtras.companyName ?? (user.isPlatformAdmin ? 'RugOS Platform' : null),
      planId: authExtras.planId ?? null,
    },
    redirectTo: user.isPlatformAdmin ? '/superadmin/buyers' : '/dashboard',
  };
}

export const login = asyncHandler(async (req, res) => {
  const email = String(req.body.email || '').trim().toLowerCase();
  const password = String(req.body.password || '');

  if (!email || !password) throw httpError(400, 'Email and password are required');

  const user = await User.findOne({ email });
  if (!user) throw httpError(401, 'Invalid credentials');

  const match = await user.comparePassword(password);
  if (!match) throw httpError(401, 'Invalid credentials');

  if (user.status !== 'Active') throw httpError(403, 'Account is inactive');

  user.lastLogin = new Date();
  await user.save();

  return ok(res, buildSession(user, await tenantExtras(user)), 'Signed in');
});

/** Demo quick login by role — logs in as seeded role user for ten-001 */
export const quickLogin = asyncHandler(async (req, res) => {
  const role = String(req.body.role || '').trim();
  if (!ROLES.includes(role) || role === 'Platform Superadmin') {
    throw httpError(400, 'Invalid role');
  }

  const email = ROLE_EMAILS[role];
  if (!email) throw httpError(400, 'No demo user for this role');

  const user = await User.findOne({ email, isPlatformAdmin: false });
  if (!user) throw httpError(404, `Demo user for role ${role} not seeded — run npm run seed`);

  user.lastLogin = new Date();
  await user.save();

  return ok(res, buildSession(user, await tenantExtras(user)), `Signed in as ${role}`);
});

/** Switch active role (impersonate seeded role user on same tenant) */
export const switchRole = asyncHandler(async (req, res) => {
  if (req.auth.isPlatformAdmin) throw httpError(403, 'Not available for platform superadmin');

  const role = String(req.body.role || '').trim();
  if (!ROLES.includes(role) || role === 'Platform Superadmin') {
    throw httpError(400, 'Invalid role');
  }

  const email = ROLE_EMAILS[role];
  let user = email
    ? await User.findOne({ email, tenantId: req.auth.tenantId, isPlatformAdmin: false })
    : null;

  // Fallback: keep same user, update role field for session
  if (!user) {
    user = await User.findById(req.auth.userId);
    if (!user) throw httpError(404, 'User not found');
    user.role = role;
  }

  user.lastLogin = new Date();
  await user.save();

  return ok(res, buildSession(user, await tenantExtras(user)), `Switched to ${role}`);
});

export const me = asyncHandler(async (req, res) => {
  return ok(res, {
    user: {
      ...req.user.toSafeJSON(),
      businessMode: req.auth.businessMode,
      companyName: req.auth.companyName || (req.user.isPlatformAdmin ? 'RugOS Platform' : null),
      planId: req.auth.planId,
    },
  });
});

export const logout = asyncHandler(async (req, res) => {
  return ok(res, null, 'Signed out');
});

export { ROLE_EMAILS };
