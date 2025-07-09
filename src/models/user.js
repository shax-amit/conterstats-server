import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    first_name: { type: String, required: true, trim: true },
    last_name:  { type: String, required: true, trim: true },
    email:      { type: String, required: true, unique: true, lowercase: true },
    phone:      { type: String },
    role:       { type: String, enum: ["customer", "admin"], default: "customer" },
    password: { type: String, required: true } , 
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
