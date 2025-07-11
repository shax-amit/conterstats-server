import { Router } from "express";
import { topItems, ordersSummaryByUser } from "../controllers/stats.js";
import requireAuth from "../middleware/auth.js";
import requireAdmin  from "../middleware/requireAdmin.js";

const router = Router();

router.get("/top-items",        requireAuth, requireAdmin, topItems);
router.get("/users/:id/summary",requireAuth, requireAdmin, ordersSummaryByUser);
router.get("/me/summary",       requireAuth, ordersSummaryByUser);

export default router;
