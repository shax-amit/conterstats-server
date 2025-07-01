import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    item:       { type: mongoose.Schema.Types.ObjectId, ref: "Item", required: true },
    unit_price: { type: Number, required: true },
    quantity:   { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user:         { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    purchaseDate: { type: Date, default: Date.now },
    total_price:  { type: Number, required: true, min: 0 },
    items:        [orderItemSchema],
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
