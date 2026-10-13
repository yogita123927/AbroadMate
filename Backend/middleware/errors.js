export function notFound(req, res) { res.status(404).json({ message: `Route not found: ${req.method} ${req.path}` }); }
export function errorHandler(err, req, res, _next) {
  console.error(err);
  if (err?.code === 11000) return res.status(409).json({ message: 'This record already exists.' });
  if (err?.name === 'ValidationError') return res.status(400).json({ message: 'Please check the submitted information.', details: Object.values(err.errors).map(e => e.message) });
  if (err?.name === 'CastError') return res.status(400).json({ message: 'Invalid identifier or value.' });
  if (err?.name === 'MongooseServerSelectionError' || err?.name === 'MongoNetworkError' || err?.name === 'MongooseError' || /buffering timed out/i.test(err?.message || '')) {
    return res.status(503).json({ message: 'Account services cannot reach the database. Check the MongoDB connection and try again.' });
  }
  res.status(err.status || 500).json({ message: err.status && err.status < 500 ? err.message : 'An unexpected server error occurred.' });
}
