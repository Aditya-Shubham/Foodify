import mongoose from "mongoose";

const deliveryPartnerSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    phone: {
      type: String,
      required: true
    },

    address: {
      type: String,
      required: true
    },

    aadhaar: String,
    drivingLicense: String,

    isApproved: {
      type: Boolean,
      default: false
    },

    // ✅ REQUIRED FOR DASHBOARD
    status: {
      type: String,
      enum: ["FREE", "ASSIGNED"],
      default: "FREE"
    },

    currentOrder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      default: null
    }
  },
  { timestamps: true }
);

export default mongoose.model("DeliveryPartner", deliveryPartnerSchema);
