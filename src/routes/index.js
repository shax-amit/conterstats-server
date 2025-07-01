import { Router } from "express";
import itemsRouter from "./items.js";

const router = Router();

router.get("/", (_req, res) => res.json({ status: "ConterStats API v1" }));
router.get("/health", (_req, res) => res.json({ status: "ok" }));
router.use("/items", itemsRouter);

export default router;
