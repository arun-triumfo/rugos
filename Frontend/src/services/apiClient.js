import { API_BASE_URL, DEMO_DELAY_MS, TOKEN_STORAGE_KEY, USE_MOCK_API } from '../config/api';
import { delay } from '../utils/format';

/**
 * Mock API client — returns Promises with artificial delay.
 * When VITE_API_BASE_URL is set, apiGet/apiPost/apiPatch hit the Node backend.
 */
export async function mockRequest(data, options = {}) {
  const ms = options.delay ?? DEMO_DELAY_MS;
  if (ms > 0) await delay(ms);
  if (options.error) throw new Error(options.error);
  return typeof data === 'function' ? data() : deepClone(data);
}

function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function getToken() {
  try {
    return localStorage.getItem(TOKEN_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function setAuthToken(token) {
  try {
    if (token) localStorage.setItem(TOKEN_STORAGE_KEY, token);
    else localStorage.removeItem(TOKEN_STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

export async function apiRequest(path, options = {}) {
  if (USE_MOCK_API) {
    throw new Error('API base URL not configured');
  }

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  });

  let json = null;
  try {
    json = await res.json();
  } catch {
    json = null;
  }

  if (!res.ok || json?.ok === false) {
    const err = new Error(json?.error || `Request failed (${res.status})`);
    err.status = res.status;
    err.code = json?.code;
    throw err;
  }

  return json?.data;
}

export async function apiGet(path, mockData) {
  if (!USE_MOCK_API) return apiRequest(path, { method: 'GET' });
  void path;
  return mockRequest(mockData);
}

export async function apiPost(path, body, mockResult) {
  if (!USE_MOCK_API) return apiRequest(path, { method: 'POST', body });
  void path;
  void body;
  return mockRequest(mockResult);
}

export async function apiPatch(path, body, mockResult) {
  if (!USE_MOCK_API) return apiRequest(path, { method: 'PATCH', body });
  void path;
  void body;
  return mockRequest(mockResult);
}
