import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config.js";

export default function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = header.split(" ")[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload.id;            // נשתמש בו בבקשות הבאות
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
}
