import { DEMO_STORAGE_KEY } from '../config/api';

export function loadPersistedState() {
  try {
    const raw = localStorage.getItem(DEMO_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function savePersistedState(state) {
  localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(state));
}

export function clearPersistedState() {
  localStorage.removeItem(DEMO_STORAGE_KEY);
}

export function persistPatch(patch) {
  const current = loadPersistedState() || {};
  const next = { ...current, ...patch, updatedAt: new Date().toISOString() };
  savePersistedState(next);
  return next;
}
