import express  from "express";
import mongoose from "mongoose";
import routes   from "./routes/index.js";
import { PORT, MONGO_URI } from "./config.js";

const app = express();

/* ✨  Mongo connection */
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ Mongo connected"))
  .catch(err  => console.error("Mongo error", err));

app.use(express.json());
app.use("/", routes);

app.listen(PORT, () =>
  console.log(`API running → http://localhost:${PORT}/health`)
);
