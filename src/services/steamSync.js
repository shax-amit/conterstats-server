// src/services/steamSync.js
// cSpell:disable

import cron  from "node-cron";  // מתזמן משימות
import axios from "axios";      // שליחת HTTP request
import Item  from "../models/item.js";  // מודל הפריטים שלנו

// מפת תרגום של קודי מצב לשם מלא כפי ש-Steam מצפה
const CONDITION_MAP = {
  FN: "Factory New",
  MW: "Minimal Wear",
  FT: "Field-Tested",
  WW: "Well-Worn",
  BS: "Battle-Scarred",
};

// 1. קריאה ל־.env עבור תזמון Cron (או ברירת־מחדל)
const { SYNC_INTERVAL_CRON = "5 */6 * * *" } = process.env;
console.log(`[steamSync] schedule "${SYNC_INTERVAL_CRON}"`);

// 2. פונקציה לשליפת המחיר מ-Steam Community
async function fetchPriceFromSteam(marketName) {
  const url    = "https://steamcommunity.com/market/priceoverview/";
  const params = {
    appid:            730,
    currency:         1,
    market_hash_name: marketName,
  };
  const headers = {
    Accept:  "application/json",
    Referer: `https://steamcommunity.com/market/listings/730/${encodeURIComponent(marketName)}`,
  };

  const { data } = await axios.get(url, { params, headers, timeout: 10000 });
  if (data.success && data.lowest_price) {
    const num = parseFloat(data.lowest_price.replace(/[^0-9.]/g, ""));
    return isNaN(num) ? null : num;
  }
  return null;
}

// 3. הפונקציה שמריצה את הסנכרון על כל הפריטים
async function runSync() {
  console.log("[steamSync] sync started");

  // מושכים name, condition ו-price
  const items = await Item.find().select("name condition price");
  if (items.length === 0) {
    console.warn("[steamSync] no items found in DB – did you run `npm run seed:all`?");
  }

  for (const it of items) {
    // בונים את השם המלא עם המצב
    const condText   = CONDITION_MAP[it.condition] || it.condition;
    const marketName = `${it.name} (${condText})`;

    console.log(`  ↪ fetching price for: "${marketName}" (DB price = $${it.price})`);

    try {
      const price = await fetchPriceFromSteam(marketName);
      console.log(`       fetched Steam price = ${price === null ? "n/a" : "$" + price}`);

      if (price !== null && price !== it.price) {
        it.price = price;
        await it.save();
        console.log(`  ✔ ${marketName} → $${price.toFixed(2)}`);
      }
    } catch (err) {
      console.error(`  ✖ ${marketName}:`, err.message);
    }
  }

  console.log("[steamSync] sync finished");
}

// 4. רישום המשימה ב-cron
cron.schedule(SYNC_INTERVAL_CRON, runSync, { timezone: "UTC" });

// 5. ייצוא runSync לקריאה ידנית אם צריך
export { runSync };
