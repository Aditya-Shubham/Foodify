import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },

    items: [
      {
        name: String,
        quantity: Number,
        price: Number,
      },
    ],

    totalAmount: {
      type: Number,
      required: true,
    },

    paymentMethod: String,

    status: {
      type: String,
      enum: ["PLACED", "ACCEPTED", "PREPARING", "READY", "COMPLETED"],
      default: "PLACED",
    },

    deliveryPartner: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "DeliveryPartner",
  default: null
},
status: {
  type: String,
  enum: ["PLACED", "PREPARING", "READY", "OUT_FOR_DELIVERY", "DELIVERED"],
  default: "PLACED"
}



  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);

