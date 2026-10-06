import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { User } from '../models/User.js';
import { Tenant } from '../models/Tenant.js';
import { httpError } from './errorHandler.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export function signToken(user) {
  return jwt.sign(
    {
      sub: user._id.toString(),
      email: user.email,
      role: user.role,
      isPlatformAdmin: !!user.isPlatformAdmin,
      tenantId: user.tenantId ? user.tenantId.toString() : null,
    },
    env.jwtSecret,
    { expiresIn: env.jwtExpiresIn }
  );
}

export const requireAuth = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) throw httpError(401, 'Authentication required', 'UNAUTHORIZED');

  let payload;
  try {
    payload = jwt.verify(token, env.jwtSecret);
  } catch {
    throw httpError(401, 'Invalid or expired token', 'UNAUTHORIZED');
  }

  const user = await User.findById(payload.sub);
  if (!user || user.status !== 'Active') {
    throw httpError(401, 'User not found or inactive', 'UNAUTHORIZED');
  }

  let tenant = null;
  let businessMode = null;
  let companyName = null;
  let planId = null;

  if (user.tenantId) {
    tenant = await Tenant.findById(user.tenantId).populate('planId');
    if (tenant) {
      businessMode = tenant.businessMode;
      companyName = tenant.companyName;
      planId = tenant.planId?._id?.toString() || tenant.planId?.toString() || null;
    }
  }

  req.user = user;
  req.auth = {
    userId: user._id.toString(),
    email: user.email,
    role: user.role,
    isPlatformAdmin: !!user.isPlatformAdmin,
    tenantId: user.tenantId ? user.tenantId.toString() : null,
    businessMode,
    companyName,
    planId,
  };
  next();
});

export function requirePlatformAdmin(req, res, next) {
  if (!req.auth?.isPlatformAdmin) {
    return next(httpError(403, 'Platform superadmin access required', 'FORBIDDEN'));
  }
  next();
}

export function requireTenantUser(req, res, next) {
  if (req.auth?.isPlatformAdmin) {
    return next(httpError(403, 'Tenant app access only', 'FORBIDDEN'));
  }
  if (!req.auth?.tenantId) {
    return next(httpError(403, 'No tenant assigned', 'FORBIDDEN'));
  }
  next();
}
