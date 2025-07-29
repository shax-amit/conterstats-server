export default function requireAdmin(req, res, next) {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ error: "Admin only" });
  }
  next();
}

// Generic role-based middleware
export function requireRole(role) {
  return function (req, res, next) {
    if (req.user?.role !== role) {
      return res.status(403).json({ error: `${role.charAt(0).toUpperCase() + role.slice(1)} only` });
    }
    next();
  };
}
