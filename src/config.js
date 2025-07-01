import dotenv from "dotenv";
dotenv.config({ path: process.cwd() + "/.env" });

export const PORT = process.env.PORT || 4000;
export const DB_URL = process.env.DB_URL;
export const JWT_SECRET = process.env.JWT_SECRET;

if (!DB_URL || !JWT_SECRET) {
  console.warn("⚠️  Missing DB_URL or JWT_SECRET — check your .env");
}
