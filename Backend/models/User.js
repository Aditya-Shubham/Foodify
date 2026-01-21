import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  label: String,
  street: String,
  apartment: String,
  landmark: String,
  city: String,
  state: String,
  pincode: String,
  isDefault: { type: Boolean, default: false }
});

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: {
    type: String,
    enum: ["user", "admin", "owner", "delivery"],
    default: "user"
  },
  phone: String,
  addresses: [addressSchema]
}, { timestamps: true });

export default mongoose.model("User", userSchema);

