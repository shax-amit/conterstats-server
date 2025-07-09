import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/user.js";
import { JWT_SECRET } from "../config.js";

// פונקציה להתחברות
export async function login(req, res) {
  const { email, password } = req.body;
  // + לפני השדות כדי לאלץ שליפה של שדות שבמודל הם select:false
  const user = await User.findOne({ email }).select("+password +role");

  if (!user || !user.password) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = jwt.sign(
    { id: user._id, role: user.role },
    JWT_SECRET,
    { expiresIn: "2h" }
  );
  res.json({ token });
}