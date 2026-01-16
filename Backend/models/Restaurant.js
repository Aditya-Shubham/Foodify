

import mongoose from "mongoose";

const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
});

const restaurantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    description: String,
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    menu: [menuItemSchema], // Add menu items
    isOpen: { type: Boolean, default: true },
    approved: {type: Boolean, default: false}
  },
  { timestamps: true }
);

export default mongoose.model("Restaurant", restaurantSchema);
