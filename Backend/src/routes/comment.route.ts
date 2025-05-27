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

router.get("/comments/:vid", protectRoute, getAllComments);
router.post("/:vid", createComment);
router.put("/:id", updateComment);
router.delete("/:id", deleteComment);
router.get("/reply/:id", getReplies);
router.post("/reply/:id", createReply);

export default router;
