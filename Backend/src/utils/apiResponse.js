export function ok(res, data = null, message) {
  const body = { ok: true, data };
  if (message) body.message = message;
  return res.json(body);
}

export function created(res, data = null, message) {
  const body = { ok: true, data };
  if (message) body.message = message;
  return res.status(201).json(body);
}

export function fail(res, status, error, code) {
  const body = { ok: false, error };
  if (code) body.code = code;
  return res.status(status).json(body);
}
