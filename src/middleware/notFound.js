export default function notFound(req, _res, next) {
  const err = new Error(`Route ${req.originalUrl} not found`);
  err.status = 404;
  next(err);
}
