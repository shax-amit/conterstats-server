// seed/users.js
import bcrypt   from "bcryptjs";
import mongoose from "mongoose";
import { MONGO_URI } from "../config.js";
import User     from "../models/user.js";

const saltRounds = 12;

const sampleUsers = [
  {
    first_name: "Alice",
    last_name:  "Admin",
    email:      "admin@counterstats.io",
    phone:      "0500000000",
    role:       "admin",
    password:   bcrypt.hashSync("admin123", saltRounds),
  },
  {
    first_name: "Bob",
    last_name:  "Buyer",
    email:      "bob@example.com",
    phone:      "0501111111",
    role:       "customer",
    password:   bcrypt.hashSync("buyer123", saltRounds),
  },
];

(async () => {
  await mongoose.connect(MONGO_URI);
  console.log("Mongo connected – seeding users");

  await User.deleteMany({});
  await User.insertMany(sampleUsers);

  console.log("✅ Users seeded!");
  await mongoose.disconnect();
})();
