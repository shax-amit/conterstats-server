// src/services/steamSync.js
import cron  from "node-cron";
import axios from "axios";
import Item  from "../models/item.js";

// מפת תרגום של קודי מצב לשם מלא כפי ש-Steam מצפה
const CONDITION_MAP = {
  FN: "Factory New",
  MW: "Minimal Wear",
  FT: "Field-Tested",
  WW: "Well-Worn",
  BS: "Battle-Scarred",
};

// Cron schedule מ-.env (ברירת-מחדל כל 6 שעות בדקה ה-5 UTC)
const { SYNC_INTERVAL_CRON = "5 */6 * * *" } = process.env;
// TTL-On-Demand ב-דקות (ברירת-מחדל 15 דקות)
const rawTtl = parseInt(process.env.SYNC_TTL_MINUTES, 10);
const TTL_MINUTES = Number.isNaN(rawTtl) ? 15 : rawTtl;

// --- Rate limit handling ---
// Delay (ms) between consecutive Steam API requests to avoid HTTP 429
const REQUEST_DELAY_MS = parseInt(process.env.SYNC_REQUEST_DELAY_MS, 10) || 20000; // default 20s

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

let lastSyncAt = 0;  // timestamp (ms) של הסנכרון האחרון
let isSyncRunning = false;  // guard to prevent parallel runs

console.log(
  `[steamSync] schedule "${SYNC_INTERVAL_CRON}", TTL-On-Demand = ${TTL_MINUTES} min`
);

// הפונקציה שקוראת מחירים מ-Steam
async function fetchPriceFromSteam(marketName) {
  const url    = "https://steamcommunity.com/market/priceoverview/";
  const params = {
    appid:            730,
    currency:         1,
    market_hash_name: marketName,
  };
  const headers = {
    Accept:  "application/json",
    Referer: `https://steamcommunity.com/market/listings/730/${encodeURIComponent(
      marketName
    )}`,
  };

  const { data } = await axios.get(url, { params, headers, timeout: 10000 });
  if (data.success && data.lowest_price) {
    const num = parseFloat(data.lowest_price.replace(/[^0-9.]/g, ""));
    return isNaN(num) ? null : num;
  }
  return null;
}

// פונקציית הסנכרון המלאה
async function runSync() {
  if (isSyncRunning) {
    console.log("[steamSync] skipped – sync already running");
    return;
  }
  isSyncRunning = true;
  console.log("[steamSync] sync started");
  const items = await Item.find().sort({ price: 1 }).select("name condition price");
  if (items.length === 0) {
    console.warn(
      "[steamSync] no items found in DB – did you run `npm run seed:all`?"
    );
  }

  for (let idx = 0; idx < items.length; idx++) {
    const it = items[idx];
    // Respect rate-limit
    await sleep(REQUEST_DELAY_MS);

    console.log(`(${idx + 1}/${items.length})`);
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
      if (err.response && err.response.status === 429) {
        console.warn("  ⏳ Rate-limited by Steam – waiting 10s...");
        await sleep(10_000);
      } else {
        console.error(`  ✖ ${marketName}:`, err.message);
      }
    }
  }

  lastSyncAt = Date.now();
  console.log("[steamSync] sync finished");
  isSyncRunning = false;
}

// Cron: רישום הסנכרון הקבוע
cron.schedule(SYNC_INTERVAL_CRON, runSync, { timezone: "UTC" });

// Kick-off sync once at server startup (non-blocking)
setImmediate(() => {
  runSync().catch((err) => console.error("[steamSync] first-sync error:", err));
});

// פונקציה ל-TTL-On-Demand
async function syncSkinsIfNeeded() {
  const ageMinutes = (Date.now() - lastSyncAt) / 1000 / 60;
  if (ageMinutes >= TTL_MINUTES) {
    // לא ממתינים לתוצאה כאן: ירוץ ברקע
    runSync().catch((err) => console.error("[steamSync] on-demand error:", err));
  }
}

// ייצוא
export { runSync, syncSkinsIfNeeded, fetchPriceFromSteam, CONDITION_MAP };
