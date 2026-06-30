import mongoose from "mongoose";

const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  type: {
    type: String,
    enum: ["VEG", "NON_VEG"],
    required: true,
  },
  image: { type: String, required: true },
    category: {
      type: String,
    enum: [
      "BREAKFAST",
      "MAIN_COURSE",
      "SNACKS",
      "FAST_FOOD",
      "BEVERAGE",
      "DESSERT"
    ],
     default: "MAIN_COURSE",
  },

  // NEW
  suitableTime: {
    type: [String],
    default: [],
  },

  // NEW
  suitableSeason: {
    type: [String],
    default: [],
  }
});

const restaurantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    cuisine: { type: String, required: true },
    openTime: { type: String, required: true },
    closeTime: { type: String, required: true },
    description: String,
    image: { type: String, required: true },
    menu: {
      type: [menuItemSchema],
      validate: [
        {
          validator: (val) => val.length <= 10,
          message: "A restaurant can have a maximum of 10 food items",
        },
      ],
    },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    isOpen: { type: Boolean, default: true },
    approved: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Restaurant", restaurantSchema);
