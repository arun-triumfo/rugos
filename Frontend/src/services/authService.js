import { mockRequest } from './apiClient';

/** Auth service — mock now, REST later */
export async function login(email, password) {
  // Future: return apiPost('/api/auth/login', { email, password });
  return mockRequest({ email, password });
}

export async function getCurrentUser(user) {
  return mockRequest(user);
}
