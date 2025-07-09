import { Router } from "express";
import itemsRouter from "./items.js";
import wishlistRouter  from "./wishlist.js";
import authRouter from "./auth.js";

const router = Router();

router.get("/", (_req, res) => res.json({ status: "ConterStats API v1" }));
router.get("/health", (_req, res) => res.json({ status: "ok" }));
router.use("/items", itemsRouter);
router.use("/wishlist",  wishlistRouter);
router.use("/auth", authRouter); 

export default router;
