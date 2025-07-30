import mongoose from "mongoose";

// Keep original but rename fields to match controller (itemId, price)
const orderItemSchema = new mongoose.Schema(
  {
    itemId:   { type: mongoose.Schema.Types.ObjectId, ref: "Item", required: true },
    name:     { type: String, required: true },
    price:    { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    userId:       { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    purchaseDate: { type: Date, default: Date.now },
    totalAmount:  { type: Number, required: true, min: 0 },
    items:        [orderItemSchema],

    // Payment (store רק מידע לא רגיש)
    cardLast4:  { type: String, required: true },   // 4 הספרות האחרונות
    cardExpiry: { type: String, required: true },   // MM/YY
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
