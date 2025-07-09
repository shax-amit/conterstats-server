import bcrypt from "bcryptjs";
import jwt    from "jsonwebtoken";
import User   from "../models/user.js";
import { JWT_SECRET } from "../config.js";

const jwtOpts = { expiresIn: "7d" };

export async function register(req, res) {
  const { first_name, last_name, email, password, phone } = req.body;

  if (!password) return res.status(400).json({ error: "Password is required" });
  if (await User.findOne({ email })) {
    return res.status(400).json({ error: "Email already in use" });
  }

  const hash = await bcrypt.hash(password, 12);
  const user = await User.create({
    first_name,
    last_name,
    email,
    phone,
    password: hash,
  });

  const token = jwt.sign({ id: user._id, email }, JWT_SECRET, jwtOpts);
  res.status(201).json({ token });
}

export async function login(req, res) {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = jwt.sign({ id: user._id, email }, JWT_SECRET, jwtOpts);
  res.json({ token });
}
