import express from "express";
import cors from "cors";                         // ← הוסף את CORS
import mongoose from "mongoose";
import "./services/steamSync.js";
import routes from "./routes/index.js";
import { MONGO_URI } from "./config.js";
import notFound from "./middleware/notFound.js";
import errorHandler from "./middleware/errorHandler.js";
import path from "path";
import { fileURLToPath } from "url";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientPath = path.join(__dirname, "..", "..", "conterstats-client");
app.use(express.static(clientPath)); // ✅ שרת סטטי

// Serve index.html at root
app.get('/', (req, res) => {
  res.sendFile(path.join(clientPath, 'index.html'));
});

app.use(cors());
app.use(express.json());
app.use("/api", routes);
app.use(notFound);
app.use(errorHandler);

export async function connectDB(uri = MONGO_URI) {
  await mongoose.connect(uri);
}

export default app;
