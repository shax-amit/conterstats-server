import { Router } from "express";
import auth from "../middleware/auth.js";
import requireAuth from "../middleware/auth.js";
import Wishlist from "../models/wishlist.js";
import {
  addToWishlist,
  removeFromWishlist,
} from "../controllers/wishlist.js";

const router = Router();

router.use(auth);

router.get("/", requireAuth, async (req, res) => {
  const userId = req.query.userId || req.user.id;
  const list = await Wishlist.findOne({ user: userId }).populate("items.item");
  res.json(list?.items || []);
});
router.post("/",         addToWishlist);
router.delete("/:itemId", removeFromWishlist);   // ← שינוי שם הפרמטר

export default router;
