import mongoose from "mongoose";

const wishlistItemSchema = new mongoose.Schema(
  {
    item:   { type: mongoose.Schema.Types.ObjectId, ref: "Item", required: true },
    addedAt:{ type: Date, default: Date.now },
  },
  { _id: false }
);

const wishlistSchema = new mongoose.Schema(
  {
    user:  { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    items: [wishlistItemSchema],
  },
  { timestamps: true }
);

export default mongoose.model("Wishlist", wishlistSchema);
