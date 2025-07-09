import express  from "express";
import mongoose from "mongoose";
import routes   from "./routes/index.js";
import { PORT, MONGO_URI } from "./config.js";
import notFound     from "./middleware/notFound.js";
import errorHandler from "./middleware/errorHandler.js";


const app = express();

/* ✨  Mongo connection */
mongoose
  .connect(MONGO_URI)              // די בה־URI בלבד; האופציות הישנות כבר דיפולט
  .then(() => console.log("✅ Mongo connected"))
  .catch(err  => console.error("❌ Mongo error :", err));

app.use(express.json());


app.use("/api", routes);

app.use(notFound);      // 404 לכל נתיב שלא קיים
app.use(errorHandler);  // error-handler גלובלי



app.get("/", (_req, res) =>
  res.json({ message: "Welcome to ConterStats API. Use /api/* routes" })
);

app.listen(PORT, () =>
  console.log(`🚀  API running → http://localhost:${PORT}/api/health`)
);
