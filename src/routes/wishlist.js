import { Router } from "express";
import { getAll, addItem, removeItem } from "../controllers/wishlist.js";
import auth from "../middleware/auth.js";

const router = Router();

router.get("/", auth, getAll);
router.post("/", auth, addItem);
router.delete("/:itemId", auth, removeItem);

export default router;
