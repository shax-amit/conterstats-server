import mongoose from "mongoose";
import { MONGO_URI } from "../config.js";
import Item from "../models/item.js";

const sampleItems = [
  { name: "AK-47 | Redline",    category: "Rifle",  condition: "FT", price: 12.5, units_in_stock: 50 },
  { name: "M4A1-S | Decimator", category: "Rifle",  condition: "MW", price: 18.2, units_in_stock: 30 },
  { name: "Glock-18 | Neo-Noir",category: "Pistol", condition: "FN", price:  9.9, units_in_stock: 70 },
];

(async () => {
  await mongoose.connect(MONGO_URI);
  console.log("Connected for seeding");

  await Item.deleteMany({});
  await Item.insertMany(sampleItems);

  console.log("✅ Items seeded!");
  await mongoose.disconnect();
})();
