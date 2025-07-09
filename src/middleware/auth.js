import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config.js";


export default function requireAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = header.split(" ")[1];

  try {
    const { id, role } = jwt.verify(token, JWT_SECRET);
    req.user = { id, role };   // ← נשמור את שני השדות לבדיקות בהמשך
    next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
}
