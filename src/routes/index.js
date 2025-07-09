import { Router } from "express";
import itemsRouter     from "./items.js";
import authRouter      from "./auth.js";       // חדש
import wishlistRouter  from "./wishlist.js";   // חדש

const router = Router();

router.get("/",   (_req, res) => res.json({ status: "ConterStats API v1" }));
router.get("/health", (_req, res) => res.json({ status: "ok" }));

router.use("/items",    itemsRouter);
router.use("/auth",     authRouter);       // חדש
router.use("/wishlist", wishlistRouter);   // חדש

export default router;
