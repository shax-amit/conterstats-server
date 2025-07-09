/* eslint-disable no-unused-vars */
export default function errorHandler(err, _req, res, _next) {
  const code = err.status || 500;
  res.status(code).json({
    error: err.message || "Server error",
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
  });
}
