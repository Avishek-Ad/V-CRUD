import express from "express";
import {
  getAllVideos,
  getVideoByIdWithoutUser,
  getVideoByIdWithUser,
  uploadVideo,
  deleteVideo,
  editVideoDetails,
  likeVideo,
  dislikeVideo,
  getAllVideosByUser,
  getAllVideosBySearch,
  increaseViewCount,
} from "../controllers/video.controller";
import { videoUpload } from "../middlewares/upload";

import { protectRoute } from "../middlewares/authMiddleware";

const router = express.Router();

router.get("/", getAllVideos);
router.get("/byuser", protectRoute, getAllVideosByUser);
router.get("/search", getAllVideosBySearch);
router.post("/upload", protectRoute, videoUpload.single("video"), uploadVideo);
router.post("/like/:id", protectRoute, likeVideo);
router.post("/dislike/:id", protectRoute, dislikeVideo);
router.post("/addview/:id", increaseViewCount);
router.get("/user/:id", protectRoute, getVideoByIdWithUser);
router.get("/:id", getVideoByIdWithoutUser);
router.delete("/delete/:id", deleteVideo);
// router.put("/edit/:id", editVideoDetails);

export default router;
