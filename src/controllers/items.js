// src/controllers/items.js
import Item from "../models/item.js";
import mongoose from "mongoose";

/* GET /api/items */
export async function getAll(req, res) {
  const { category, ids } = req.query;

  const filter = {};
  if (category) filter.category = category;
  if (ids) {
    const arr = ids.split(',').filter(Boolean);
    filter._id = { $in: arr };
  }

  const items = await Item.find(filter).lean();
  res.json(items);
}

/* GET /api/items/:id */
export async function getOne(req, res) {
  if (!mongoose.isValidObjectId(req.params.id))
    return res.status(400).json({ error: "invalid id" });

  const item = await Item.findById(req.params.id).lean();
  if (!item) return res.status(404).json({ error: "not found" });

  res.json(item);
}

/* POST /api/items */
export async function create(req, res) {
  try {
    const item = await Item.create(req.body);
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

/* PATCH /api/items/:id */
export async function update(req, res) {
  const item = await Item.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );
  if (!item) return res.status(404).json({ error: "not found" });
  res.json(item);
}

/* DELETE /api/items/:id */
export async function remove(req, res) {
  const deleted = await Item.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ error: "not found" });
  res.json({ ok: true });
}
