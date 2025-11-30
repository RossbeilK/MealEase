// server/models/menuItem.model.js
import mongoose from "mongoose";

const menuItemSchema = new mongoose.Schema(
  {
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true
    },
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    imageUrl: { type: String },
    isAvailable: { type: Boolean, default: true }
  },
  { timestamps: true }
);

const MenuItem = mongoose.model("MenuItem", menuItemSchema, "MenuItems");

export default MenuItem;
