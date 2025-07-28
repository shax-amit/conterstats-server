import 'dotenv/config';              // ← טען את ה-.env לפני כל השאר
import cors from "cors";

import app, { connectDB } from "./app.js";
import { PORT } from "./config.js";

// ✨ אפשר גישה ל-API מדפדפנים חיצוניים (Live Server למשל)
app.use(cors()); // ← אם תרצה להגביל לכתובת מסוימת, ראה הערה בהמשך

/* ✨ התחברות למסד ואז הפעלת השרת */
connectDB() // ← משתמש ב-MONGO_URI מתוך config
  .then(() => {
    app.listen(PORT, () =>
      console.log(`🚀  API running → http://localhost:${PORT}/api/health`)
    );
  })
  .catch(err => {
    console.error("❌ Mongo connection failed:", err);
    process.exit(1);
  });
