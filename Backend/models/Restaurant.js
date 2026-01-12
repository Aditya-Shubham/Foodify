import mongoose from "mongoose";

const restaurantSchema = new mongoose.Schema({
  name: String,
  cuisine: String,
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  menu: [{
    name: String,
    price: Number,
    type: String,
    image: String
  }]
});

export default mongoose.model("Restaurant", restaurantSchema);
