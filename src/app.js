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
const publicPath = path.join(__dirname, "public");
app.use(express.static(publicPath)); // ✅ Serve static files from 'public'

app.use(cors({ origin: 'https://conterstats.onrender.com' }));
app.use(express.json());
// Health check root path for Render
app.get('/', (req, res) => res.send('OK'));
app.use("/api", routes);
app.use(notFound);
app.use(errorHandler);

export async function connectDB(uri = MONGO_URI) {
  await mongoose.connect(uri);
}

export default app;
