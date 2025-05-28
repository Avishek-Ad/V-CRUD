import express from "express";
import {
  getAllComments,
  createComment,
  updateComment,
  deleteComment,
  createReply,
  getReplies,
} from "../controllers/comment.controller";
import { protectRoute } from "../middlewares/authMiddleware";

const router = express.Router();

router.get("/:vid", getAllComments);
router.post("/:vid", protectRoute, createComment);
router.put("/:id", protectRoute, updateComment);
router.delete("/:id", protectRoute, deleteComment);
router.get("/reply/:id", getReplies);
router.post("/reply/:id", protectRoute, createReply);

export default router;
