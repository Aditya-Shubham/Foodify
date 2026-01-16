

import mongoose from "mongoose";

const restaurantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    cuisine: String,
    openTime: String,
    closeTime: String,

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    approved: {
      type: Boolean,
      default: false
    },

    menu: [
      {
        name: String,
        price: Number
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.model("Restaurant", restaurantSchema);
