exports.notFound = (_req, _res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
};

exports.errorHandler = (err, _req, res, _next) => {
  // Validation errors
  if (err.isJoi) {
    return res.status(400).json({
      ok: false,
      error: 'Validation failed',
      details: err.details?.map(d => d.message) || [err.message],
    });
  }

  // Known HTTP status or default 500
  const status = err.status || 500;

  // Log server errors
  if (status >= 500) {
    // eslint-disable-next-line no-console
    console.error(err);
  }

  return res.status(status).json({
    ok: false,
    error: err.message || 'Server error',
  });
};
