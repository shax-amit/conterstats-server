import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config.js";

function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: "Missing token" });

  const token = header.split(" ")[1]; // Bearer <token>
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
}
export default auth;