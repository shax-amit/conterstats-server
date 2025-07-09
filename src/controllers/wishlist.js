// src/controllers/wishlist.js
import { ObjectId } from "mongodb";
import mongoose     from "mongoose";
import Wishlist     from "../models/wishlist.js";

/* ----- GET /api/wishlist ----- */
export async function getWishlist(req, res) {
  const uid  = new ObjectId(req.user);                 // ← אובייקט־id תקין
  const list = await Wishlist.findOne({ user: uid })
                             .populate("items.item");

  res.json(list?.items || []);
}

/* ----- POST /api/wishlist ----- */
export async function addToWishlist(req, res) {
  const { itemId } = req.body;

  if (!itemId || !mongoose.isValidObjectId(itemId)) {
    return res.status(400).json({ error: "Valid itemId is required" });
  }

  const uid = new ObjectId(req.user);

  /* 1. ניקוי item:null */
  await Wishlist.findOneAndUpdate(
    { user: uid },
    { $pull: { items: { item: null } } }
  );

  /* 2. הוספת הפריט בלי כפילויות */
  const updated = await Wishlist.findOneAndUpdate(
    { user: uid },
    { $addToSet: { items: { item: itemId } } },
    { new: true, upsert: true, runValidators: true }
  ).populate("items.item");

  res.status(201).json(updated.items);
}

/* ----- DELETE /api/wishlist/:itemId ----- */
export async function removeFromWishlist(req, res) {
  const { itemId } = req.params;
  const uid = new ObjectId(req.user);

  const criteria = itemId === "null" ? { item: null } : { item: itemId };

  await Wishlist.findOneAndUpdate(
    { user: uid },
    { $pull: { items: criteria } }
  );

  res.status(204).end();
}
