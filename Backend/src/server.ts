import app from "./app";
import dotenv from "dotenv";
dotenv.config();
import connectDB from "./configs/db";

const PORT = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
  } catch (error) {
    console.log(error);
  }
};

start();
