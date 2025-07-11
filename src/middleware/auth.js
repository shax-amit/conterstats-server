import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config.js";

/**
 * Verifies a Bearer token and attaches { id, email, role } to req.user.
 * 401 → missing / bad token
 */
export default function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  if (!header.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = header.split(" ")[1];

  try {
    const { id, email, role } = jwt.verify(token, JWT_SECRET);
    req.user = { id, email, role };        // נוסיף גם email ליתר שימוש
    return next();
  } catch {                         // _err → מתקן ESLint unused
    return res.status(401).json({ error: "Invalid token" });
  }
}
