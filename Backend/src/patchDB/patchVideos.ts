import mongoose from "mongoose";
import Video from "../models/video";
import dotenv from "dotenv";

dotenv.config(); // load .env for MongoDB URI

const patchVideos = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    console.log("Connected to DB");

    const resultLikes = await Video.updateMany(
      { likes: { $exists: false } },
      { $set: { likes: [] } }
    );

    const resultDislikes = await Video.updateMany(
      { dislikes: { $exists: false } },
      { $set: { dislikes: [] } }
    );

    console.log("Patch complete:");
    console.log("Likes updated:", resultLikes.modifiedCount);
    console.log("Dislikes updated:", resultDislikes.modifiedCount);

    process.exit(0);
  } catch (error) {
    console.error("Error running patch:", error);
    process.exit(1);
  }
};

patchVideos();
