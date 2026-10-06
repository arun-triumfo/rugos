export function notFound(req, res, next) {
  res.status(404).json({ ok: false, error: `Not found: ${req.method} ${req.originalUrl}` });
}

export function errorHandler(err, req, res, next) {
  console.error(err);
  const status = err.status || err.statusCode || 500;
  res.status(status).json({
    ok: false,
    error: err.message || 'Internal server error',
    code: err.code || undefined,
  });
}

export function httpError(status, message, code) {
  const err = new Error(message);
  err.status = status;
  if (code) err.code = code;
  return err;
}
