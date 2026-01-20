import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: "./.env"});

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/OrderCart");
    console.log("MongoDB Connected ✅");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

export default connectDB;
