import { DEMO_DELAY_MS } from '../config/api';
import { delay } from '../utils/format';

/**
 * Mock API client — returns Promises with artificial delay.
 * Later: replace with fetch(API_BASE_URL + path) without changing services.
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

export async function apiGet(path, mockData) {
  // Future: return fetch(`${API_BASE_URL}${path}`).then(r => r.json());
  void path;
  return mockRequest(mockData);
}

export async function apiPost(path, body, mockResult) {
  void path;
  void body;
  return mockRequest(mockResult);
}

export async function apiPatch(path, body, mockResult) {
  void path;
  void body;
  return mockRequest(mockResult);
}
