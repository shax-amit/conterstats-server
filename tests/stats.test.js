import request from "supertest";
import app from "../src/app.js";

import {
  setupTestDB,
  closeTestDB,
  getAdminToken,
  getCustomerToken,
} from "./utils/testSetup.js";

beforeAll(async () => {
  await setupTestDB();
});

afterAll(() => closeTestDB());

describe("GET /api/stats/top-items", () => {
  it("returns up to 5 best-selling items", async () => {
    const res = await request(app)
      .get("/api/stats/top-items?limit=5")
      .set("Authorization", `Bearer ${getAdminToken()}`)
      .expect(200);

    expect(res.body.length).toBeLessThanOrEqual(5);
    if (res.body.length > 0) {
      expect(res.body[0]).toHaveProperty("totalSold");
      expect(res.body[0]).toHaveProperty("revenue");
    }
  });
});

describe("GET /api/stats/me/summary", () => {
  it("returns an order summary for the logged-in user", async () => {
    const res = await request(app)
      .get("/api/stats/me/summary")
      .set("Authorization", `Bearer ${getCustomerToken()}`)
      .expect(200);

    expect(res.body).toHaveProperty("totalOrders");
    expect(res.body).toHaveProperty("totalSpent");
  });
});
