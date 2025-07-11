import request from "supertest";
import app from "../src/app.js";
import bcrypt from "bcryptjs";
import User from "../src/models/user.js";

import { setupTestDB, closeTestDB } from "./utils/testSetup.js";

beforeAll(async () => {
  await setupTestDB();

  await User.create({
    first_name: "Alice",
    last_name:  "Admin",
    email:      "admin@test.io",
    password:   await bcrypt.hash("pass123", 12),
    role:       "admin",
  });
});

afterAll(() => closeTestDB());

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
