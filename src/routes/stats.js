import { Router } from "express";
import { ordersSummaryByUser, topItems } from "../controllers/stats.js";
import requireAuth from "../middleware/auth.js";
import requireAdmin from "../middleware/requireAdmin.js";

const router = Router();

router.get("/users/:id/summary", requireAuth, requireAdmin, ordersSummaryByUser);
router.get("/top-items", requireAuth, requireAdmin, topItems);

export default router;
