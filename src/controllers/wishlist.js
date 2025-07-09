import Wishlist   from "../models/wishlist.js";


export const addItem = async (req, res) => {
  const { itemId } = req.body;

  const wl = await Wishlist.findOneAndUpdate(
    { user: req.user.id },
    { $addToSet: { items: { item: itemId } } },    // ← עטפנו באובייקט
    { new: true, upsert: true }
  ).populate("items.item"); // צריך לשנות ל-items.item

  res.status(201).json(wl);
};

export const getAll = async (req, res) => {
  const list = await Wishlist
    .findOne({ user: req.user.id })
    .populate("items.item")     // ← src path
    .lean();

  res.json(list ?? { items: [] });
};

export const removeItem = async (req, res) => {
  const { itemId } = req.params;

  const wl = await Wishlist.findOneAndUpdate(
    { user: req.user.id },
    { $pull: { items: { item: itemId } } },        // ← גם כאן אובייקט
    { new: true }
  ).populate("items.item");

  if (!wl) return res.status(404).json({ error: "Wishlist not found" });
  res.json(wl);
};