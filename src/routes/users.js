import { Router } from "express";
import User from "../models/user.js";
import requireAuth from "../middleware/auth.js";
import { requireRole } from "../middleware/requireAdmin.js";

const router = Router();

// GET /api/users - admin only
router.get("/", requireAuth, requireRole("admin"), async (req, res) => {
  const users = await User.find({}, { email: 1, _id: 1 });
  res.json(users);
});

router.get("/:id", requireAuth, requireRole("admin"), async (req, res) => {
  const user = await User.findById(req.params.id).lean();
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json(user);
});

export default router; 