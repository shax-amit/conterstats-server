import request from "supertest";
import app, { connectDB } from "../src/app.js";
import { MongoMemoryServer } from "mongodb-memory-server";
import User from "../src/models/user.js";
import Item from "../src/models/item.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../src/config.js";

let mongo, adminToken, custToken;
beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  await connectDB(mongo.getUri());

  await Item.create({ name: "AK-47", category: "Rifle", condition: "FT", price: 10, units_in_stock: 1 });

  const admin = await User.create({
    first_name: "Alice", last_name: "Admin",
    email: "a@test.io",
    password: await bcrypt.hash("x", 12),
    role: "admin",
  });
  const cust = await User.create({
    first_name: "Bob", last_name: "Buyer",
    email: "b@test.io",
    password: await bcrypt.hash("y", 12),
    role: "customer",
  });

  adminToken = jwt.sign({ id: admin._id, email: admin.email, role: admin.role }, JWT_SECRET);
  custToken  = jwt.sign({ id: cust._id,  email: cust.email,  role: cust.role  }, JWT_SECRET);
});
afterAll(async () => { await mongo.stop(); });

test("GET /items 200", async () => {
  const res = await request(app)
    .get("/api/items")
    .set("Authorization", `Bearer ${custToken}`);
  expect(res.statusCode).toBe(200);
});

test("customer POST /items → 403", async () => {
  const res = await request(app)
    .post("/api/items")
    .set("Authorization", `Bearer ${custToken}`)
    .send({ name: "M4A1", category: "Rifle", condition: "FN", price: 15, units_in_stock: 1 });
  expect(res.statusCode).toBe(403);
});

test("admin POST /items → 201", async () => {
  const res = await request(app)
    .post("/api/items")
    .set("Authorization", `Bearer ${adminToken}`)
    .send({ name: "M4A1", category: "Rifle", condition: "FN", price: 15, units_in_stock: 1 });
  expect(res.statusCode).toBe(201);
  expect(res.body).toHaveProperty("_id");
});
