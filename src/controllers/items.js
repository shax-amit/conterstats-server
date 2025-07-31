// src/controllers/items.js
import Item from "../models/item.js";
import mongoose from "mongoose";
import { fetchPriceFromSteam } from "../services/steamSync.js";
import { CONDITION_MAP } from "../services/steamSync.js";

/* GET /api/items */
export async function getAll(req, res) {
  console.log('==> [getAll] called!');
  const { category, ids } = req.query;
  console.log('==> [getAll] query:', req.query);

  const filter = {};
  if (category) filter.category = category;
  if (ids) {
    const arr = ids.split(',').filter(Boolean);
    filter._id = { $in: arr };
  }
  console.log('==> [getAll] filter:', filter);

  try {
    const items = await Item.find(filter);

    // On-demand refresh for all fetched items (max 30 in full inventory)
    for (const doc of items) {
      await maybeRefreshPrice(doc);
    }

    console.log('==> [getAll] items found:', items.length);
    res.json(items.map((d)=>d.toObject()));
  } catch (err) {
    console.error('==> [getAll] error:', err);
    res.status(500).json({ error: 'Failed to fetch items', details: err.message });
  }
}

/* GET /api/items/:id */
export async function getOne(req, res) {
  if (!mongoose.isValidObjectId(req.params.id))
    return res.status(400).json({ error: "invalid id" });

  let item = await Item.findById(req.params.id);
  if (!item) return res.status(404).json({ error: "not found" });

  await maybeRefreshPrice(item);

  res.json(item.toObject());
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

// Helper to refresh price if older than 1h and price==1
async function maybeRefreshPrice(doc) {
  const ONE_HOUR = 60 * 60 * 1000;
  const needs = !doc.lastPriceCheck || (Date.now() - doc.lastPriceCheck.getTime()) > ONE_HOUR;
  if (!needs) return;

  const condText = CONDITION_MAP[doc.condition] || doc.condition;
  const marketName = `${doc.name} (${condText})`;
  try {
    const p = await fetchPriceFromSteam(marketName);
    if (p !== null) {
      doc.price = p;
      doc.lastPriceCheck = new Date();
      await doc.save();
    }
  } catch(e) {
    console.warn('[priceRefresh] error:', e.message);
  }
}
