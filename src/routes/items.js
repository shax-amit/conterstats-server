// src/routes/items.js

import { Router } from "express";
import {
  getAll,
  getOne,
  create,
  update,
  remove,
} from "../controllers/items.js";

import requireAuth   from "../middleware/auth.js";
import requireAdmin  from "../middleware/requireAdmin.js";

// נייבא את ה-sync-On-Demand
import { syncSkinsIfNeeded } from "../services/steamSync.js";

const r = Router();

/* ---------- Public ---------- */
// GET כל הפריטים: מריצים קודם־אז קריאת Sync רק אם TTL חלף
r.get("/", async (req, res, next) => {
  try {
    // יריץ ב-background אם עבר יותר מ-TTL דקות
    syncSkinsIfNeeded();
    // שולף ומחזיר מיידית
    await getAll(req, res);
  } catch (err) {
    next(err);
  }
});

r.get("/:id", getOne);

/* ---------- Admin-only ---------- */
r.post("/",      requireAuth, requireAdmin, create);
r.patch("/:id",  requireAuth, requireAdmin, update);
r.delete("/:id", requireAuth, requireAdmin, remove);

export default r;
