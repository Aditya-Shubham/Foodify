import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  items: Array,
  totalAmount: Number,
  paymentMethod: String,
  status: {
    type: String,
    default: "Pending"
  }
}, { timestamps: true });

export default mongoose.model("Order", orderSchema);
