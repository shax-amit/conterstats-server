import express  from "express";
import mongoose from "mongoose";
import routes   from "./routes/index.js";
import { MONGO_URI } from "./config.js";
import notFound     from "./middleware/notFound.js";
import errorHandler from "./middleware/errorHandler.js";

const app = express();
app.use(express.json());
app.use("/api", routes);
app.use(notFound);
app.use(errorHandler);

export async function connectDB(uri = MONGO_URI) {
  await mongoose.connect(uri);
}

export default app;
