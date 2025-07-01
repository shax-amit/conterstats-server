import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    name:           { type: String, required: true, trim: true },
    category:       { type: String, required: true },
    condition:      { type: String, enum: ["FN", "MW", "FT", "WW", "BS"], required: true },
    price:          { type: Number, required: true, min: 0 },
    units_in_stock: { type: Number, required: true, min: 0 },
    imageUrl:       { type: String },          
  },
  { timestamps: true }
);

export default mongoose.model("Item", itemSchema);
