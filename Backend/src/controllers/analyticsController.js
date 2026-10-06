import { buildDashboardAnalytics } from '../services/analyticsService.js';
import { ok } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getDashboard = asyncHandler(async (req, res) => {
  const data = await buildDashboardAnalytics(req.auth.tenantId);
  return ok(res, data);
});
