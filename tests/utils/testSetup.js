import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

import User from "../../src/models/user.js";
import { JWT_SECRET } from "../../src/config.js";

let mongod;
let _adminToken = null;
let _customerToken = null;

export const setupTestDB = async () => {
  // 1. in-memory Mongo
  mongod = await MongoMemoryServer.create();
  await mongoose.connect(mongod.getUri());

  // 2. ensure admin & customer users exist (hashed pw just in case)
  const ensureUser = async (role, email, pw) => {
    let u = await User.findOne({ role });
    if (!u) {
      u = await User.create({
        first_name: role,
        last_name:  "Test",
        email,
        password:   await bcrypt.hash(pw, 10),
        role,
      });
    }
    return u;
  };

  const admin    = await ensureUser("admin",    "adm@test.io", "adm123");
  const customer = await ensureUser("customer", "cus@test.io", "cus123");

  // 3. always (re)sign fresh tokens
  _adminToken = jwt.sign(
    { id: admin._id.toString(), email: admin.email, role: admin.role },
    JWT_SECRET
  );
  _customerToken = jwt.sign(
    { id: customer._id.toString(), email: customer.email, role: customer.role },
    JWT_SECRET
  );
};

export const closeTestDB = async () => {
  await mongoose.disconnect();
  if (mongod) await mongod.stop();
};

// ---- safe getters (never return null) ----
export const getAdminToken = () => {
  if (!_adminToken) throw new Error("Admin token not initialised");
  return _adminToken;
};
export const getCustomerToken = () => {
  if (!_customerToken) throw new Error("Customer token not initialised");
  return _customerToken;
};
