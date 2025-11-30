// server/models/restaurant.model.js
import mongoose from "mongoose";

const restaurantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    address: { type: String, required: true },
    phone: { type: String },
    cuisineType: { type: String },
    imageUrl: { type: String },
    isOpen: { type: Boolean, default: true }
  },
  { timestamps: true }
);

const Restaurant = mongoose.model("Restaurant", restaurantSchema, "Restaurants");

export default Restaurant;
