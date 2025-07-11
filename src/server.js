/* ---------- src/server.js (גרסה חדשה) ---------- */
import app, { connectDB } from "./app.js";
import { PORT } from "./config.js";

/* ✨  התחברות למסד ואז הפעלת השרת */
connectDB()                       // ← משתמש ב-MONGO_URI מתוך config
  .then(() => {
    app.listen(PORT, () =>
      console.log(`🚀  API running → http://localhost:${PORT}/api/health`)
    );
  })
  .catch(err => {
    console.error("❌ Mongo connection failed:", err);
    process.exit(1);
  });
