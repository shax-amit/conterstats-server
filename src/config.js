import dotenv from "dotenv";
dotenv.config({ path: process.cwd() + "/.env" });

export const PORT       = process.env.PORT || 4000;
export const MONGO_URI  = process.env.MONGO_URI;
export const JWT_SECRET = process.env.JWT_SECRET;

if (!MONGO_URI || !JWT_SECRET) {
  console.warn("⚠️  Missing MONGO_URI or JWT_SECRET – check your .env");
}