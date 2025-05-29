import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

let isConnected: boolean = false; // Global flag for cached connection

const connectDB = async () => {
  if (isConnected) return;

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI as string);
    isConnected = true;
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error; // So the caller can handle it properly
  }
};

export default connectDB;
