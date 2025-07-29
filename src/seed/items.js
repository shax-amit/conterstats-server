// seed/items.js
import mongoose from "mongoose";
import { MONGO_URI } from "../config.js";
import Item from "../models/item.js";

const sampleItems = [
  // Pistols
  { name: "Glock-18 | Fade", category: "Pistol", condition: "FN", price: 1, units_in_stock: 10, imageUrl: "" },
  { name: "Desert Eagle | Blaze", category: "Pistol", condition: "FN", price: 1, units_in_stock: 10, imageUrl: "" },
  { name: "USP-S | Kill Confirmed", category: "Pistol", condition: "FN", price: 1, units_in_stock: 10, imageUrl: "" },
  { name: "P250 | See Ya Later", category: "Pistol", condition: "FN", price: 1, units_in_stock: 10, imageUrl: "" },
  { name: "CZ75-Auto | Victoria", category: "Pistol", condition: "FN", price: 1, units_in_stock: 10, imageUrl: "" },
  { name: "Five-SeveN | Hyper Beast", category: "Pistol", condition: "FN", price: 1, units_in_stock: 10, imageUrl: "" },

  // Knives
  { name: "Karambit | Doppler", category: "Knives", condition: "FN", price: 1, units_in_stock: 10, imageUrl: "" },
  { name: "Butterfly Knife | Fade", category: "Knives", condition: "FN", price: 1, units_in_stock: 10, imageUrl: "" },
  { name: "M9 Bayonet | Lore", category: "Knives", condition: "FN", price: 1, units_in_stock: 10, imageUrl: "" },
  { name: "Bayonet | Tiger Tooth", category: "Knives", condition: "FN", price: 1, units_in_stock: 10, imageUrl: "" },
  { name: "Flip Knife | Gamma Doppler", category: "Knives", condition: "FN", price: 1, units_in_stock: 10, imageUrl: "" },
  { name: "Huntsman Knife | Marble Fade", category: "Knives", condition: "FN", price: 1, units_in_stock: 10, imageUrl: "" },

  // Rifles
  { name: "AK-47 | Redline", category: "Rifle", condition: "FN", price: 1, units_in_stock: 10, imageUrl: "" },
  { name: "M4A4 | Howl", category: "Rifle", condition: "FN", price: 1, units_in_stock: 10, imageUrl: "" },
  { name: "AWP | Dragon Lore", category: "Rifle", condition: "FN", price: 1, units_in_stock: 10, imageUrl: "" },
  { name: "SG 553 | Pulse", category: "Rifle", condition: "FN", price: 1, units_in_stock: 10, imageUrl: "" },
  { name: "AUG | Chameleon", category: "Rifle", condition: "FN", price: 1, units_in_stock: 10, imageUrl: "" },
  { name: "FAMAS | Styx", category: "Rifle", condition: "FN", price: 1, units_in_stock: 10, imageUrl: "" },

  // Gloves
  { name: "Sport Gloves | Vice", category: "Gloves", condition: "FN", price: 1, units_in_stock: 10, imageUrl: "" },
  { name: "Specialist Gloves | Crimson Kimono", category: "Gloves", condition: "FN", price: 1, units_in_stock: 10, imageUrl: "" },
  { name: "Driver Gloves | King Snake", category: "Gloves", condition: "FN", price: 1, units_in_stock: 10, imageUrl: "" },
  { name: "Hand Wraps | Slaughter", category: "Gloves", condition: "FN", price: 1, units_in_stock: 10, imageUrl: "" },
  { name: "Moto Gloves | Eclipse", category: "Gloves", condition: "FN", price: 1, units_in_stock: 10, imageUrl: "" },
  { name: "Hydra Gloves | Case Hardened", category: "Gloves", condition: "FN", price: 1, units_in_stock: 10, imageUrl: "" },

  // Mid-Tier
  { name: "AK-47 | Elite Build", category: "Mid-Tier", condition: "FN", price: 1, units_in_stock: 10, imageUrl: "" },
  { name: "M4A1-S | Leaded Glass", category: "Mid-Tier", condition: "FN", price: 1, units_in_stock: 10, imageUrl: "" },
  { name: "AWP | Phobos", category: "Mid-Tier", condition: "FN", price: 1, units_in_stock: 10, imageUrl: "" },
  { name: "UMP-45 | Primal Saber", category: "Mid-Tier", condition: "FN", price: 1, units_in_stock: 10, imageUrl: "" },
  { name: "Galil AR | Firefight", category: "Mid-Tier", condition: "FN", price: 1, units_in_stock: 10, imageUrl: "" },
  { name: "SSG 08 | Abyss", category: "Mid-Tier", condition: "FN", price: 1, units_in_stock: 10, imageUrl: "" }
];

(async () => {
  await mongoose.connect(MONGO_URI);
  console.log("Mongo connected – seeding items");

  await Item.deleteMany({});
  await Item.insertMany(sampleItems);

  console.log("✅ Items seeded!");
  await mongoose.disconnect();
})();
