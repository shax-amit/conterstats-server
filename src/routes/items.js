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

const r = Router();

/* ---------- Public ---------- */
r.get("/",     getAll);
r.get("/:id",  getOne);

/* ---------- Admin-only ---------- */
r.post("/",      requireAuth, requireAdmin, create);
r.patch("/:id",  requireAuth, requireAdmin, update);
r.delete("/:id", requireAuth, requireAdmin, remove);

export default r;
