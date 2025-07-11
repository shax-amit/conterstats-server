import request from "supertest";
import app, { connectDB } from "../src/app.js";
import { MongoMemoryServer } from "mongodb-memory-server";
import User from "../src/models/user.js";
import bcrypt from "bcryptjs";

let mongo;
beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  await connectDB(mongo.getUri());
  await User.create({
    first_name: "Alice", last_name: "Admin",
    email: "admin@test.io",
    password: await bcrypt.hash("pass123", 12),
    role: "admin",
  });
});
afterAll(async () => { await mongo.stop(); });

test("login success returns token", async () => {
  const res = await request(app)
    .post("/api/auth/login")
    .send({ email: "admin@test.io", password: "pass123" });
  expect(res.statusCode).toBe(200);
  expect(res.body).toHaveProperty("token");
});

test("login wrong password → 401", async () => {
  const res = await request(app)
    .post("/api/auth/login")
    .send({ email: "admin@test.io", password: "oops" });
  expect(res.statusCode).toBe(401);
});
