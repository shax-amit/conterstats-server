import { Router } from "express";
import { summaryByUser, topItems } from "../controllers/stats.js";
import requireAuth from "../middleware/auth.js";
import requireAdmin from "../middleware/requireAdmin.js";
import { runSync } from "../services/steamSync.js";

const router = Router();

router.get("/users/:id/summary", requireAuth, requireAdmin, summaryByUser);
router.get("/top-items", requireAuth, requireAdmin, topItems);

// --- manual Steam sync ---
router.post("/sync/steam", requireAuth, requireAdmin, async (req, res) => {
  runSync().catch((err) => console.error("[manualSync]", err));
  res.json({ message: "Steam sync started" });
});

export default router;
