import { Router } from "express";
import auth from "../middleware/auth.js";
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} from "../controllers/wishlist.js";

const router = Router();

router.use(auth);

router.get("/",          getWishlist);
router.post("/",         addToWishlist);
router.delete("/:itemId", removeFromWishlist);   // ← שינוי שם הפרמטר

export default router;
