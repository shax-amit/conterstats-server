// src/controllers/wishlist.js
import { ObjectId } from "mongodb";
import mongoose     from "mongoose";
import Wishlist     from "../models/wishlist.js";

/* ----- GET /api/wishlist ----- */
export async function getWishlist(req, res) {
  const uid  = new ObjectId(req.user);
  // Remove items with item=null
  await Wishlist.updateOne(
    { user: uid },
    { $pull: { items: { item: null } } }
  );
  let list = await Wishlist.findOne({ user: uid }).populate("items.item");
  // Remove items whose item points to a non-existent ObjectId (orphans)
  const orphanIds = (list?.items || [])
    .filter(entry => entry.item === null && entry.item !== undefined)
    .map(entry => entry.item);
  if (orphanIds.length) {
    await Wishlist.updateOne(
      { user: uid },
      { $pull: { items: { item: { $in: orphanIds } } } }
    );
    list = await Wishlist.findOne({ user: uid }).populate("items.item");
  }
  const filtered = (list?.items || []).filter(entry => entry.item);
  res.json(filtered);
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
  // Allow admin to remove from any user's wishlist via ?userId=...
  let uid;
  if (req.user.role === "admin" && req.query.userId) {
    uid = new ObjectId(req.query.userId);
  } else {
    uid = new ObjectId(req.user);
  }

  const criteria = itemId === "null" ? { item: null } : { item: itemId };

  await Wishlist.findOneAndUpdate(
    { user: uid },
    { $pull: { items: criteria } }
  );

  res.status(204).end();
}
