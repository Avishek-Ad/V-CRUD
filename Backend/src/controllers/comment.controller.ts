import { Request, Response } from "express";
import Comment from "../models/Comment";
import Video from "../models/video";
import User from "../models/User";

const getReplies = async (req: Request, res: Response): Promise<void> => {
  try {
    const commentId = req.params.id;
    const comment = await Comment.findById(commentId).populate({
      path: "replies",
      populate: {
        path: "user",
        select: "username avatar",
      },
    });

    if (!comment) {
      res.status(404).json({ message: "Comment not found" });
      return;
    }
    res.json({ success: true, replies: comment.replies });
  } catch (error) {
    console.log("Error in getReplies controller", error);
    res.status(500).json({ message: "Server error", error: error });
    return;
  }
};

const createReply = async (req: Request, res: Response): Promise<void> => {
  try {
    const { content } = req.body;
    const commentId = req.params.id;
    const userId = (req as any).user._id;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      res.status(404).json({ message: "Comment not found" });
      return;
    }

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const newReply = new Comment({
      content,
      user: userId,
    });

    await newReply.save();

    await newReply.populate("user", ["username", "avatar"]);

    comment.replies.push(newReply._id);
    await comment.save();

    user.comments.push(newReply._id);
    await user.save();

    res.status(201).json({
      success: true,
      message: "Reply created successfully",
      reply: newReply,
    });
  } catch (error) {
    console.log("Error in createReply controller", error);
    res.status(500).json({ message: "Server error", error: error });
    return;
  }
};

const getAllComments = async (req: Request, res: Response): Promise<void> => {
  try {
    const videoId = req.params.vid;

    const video = await Video.findById(videoId);
    if (!video) {
      res.status(404).json({ message: "Video not found" });
      return;
    }

    const comments = await Comment.find({ video: videoId }).populate("user", [
      "username",
      "avatar",
    ]);
    res.json({ success: true, comments: comments });
    return;
  } catch (error) {
    console.log("Error in getAllComments controller", error);
    res.status(500).json({ message: "Server error", error: error });
    return;
  }
};

const createComment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { content } = req.body;
    const videoId = req.params.vid;
    const userId = (req as any).user._id;

    const video = await Video.findById(videoId);
    if (!video) {
      res.status(404).json({ message: "Video not found" });
      return;
    }

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const comment = await Comment.create({
      content: content,
      video: videoId,
      user: userId,
    });
    await comment.populate("user", ["username", "avatar"]);

    video.comments.push(comment._id);
    await video.save();

    user.comments.push(comment._id);
    await user.save();

    res.json({
      success: true,
      message: "Comment created successfully",
      comment: comment,
    });
    return;
  } catch (error) {
    console.log("Error in createComment controller", error);
    res.status(500).json({ message: "Server error", error: error });
    return;
  }
};

const updateComment = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user._id;
    const commentId = req.params.id;
    const { content } = req.body;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      res.status(404).json({ message: "Comment not found" });
      return;
    }

    if (comment.user.toString() !== userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    comment.content = content;
    await comment.save();
    res.json({ success: true, comment: comment });
    return;
  } catch (error) {
    console.log("Error in updateComment controller", error);
    res.status(500).json({ message: "Server error", error: error });
    return;
  }
};

const deleteComment = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user._id;
    const commentId = req.params.id;

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const comment = await Comment.findById(commentId);
    if (!comment) {
      res.status(404).json({ message: "Comment not found" });
      return;
    }

    if (comment.user.toString() !== userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    if (comment.video != null) {
      const video = await Video.findById(comment.video);
      if (!video) {
        res.status(404).json({ message: "Video not found" });
        return;
      }
      video.comments = video.comments.filter(
        (cId) => cId.toString() !== commentId.toString()
      );
      await video.save();
    } else {
      const parentComment = await Comment.findOne({ replies: commentId });
      if (parentComment) {
        parentComment.replies = parentComment.replies.filter(
          (rId) => rId.toString() !== commentId.toString()
        );
        await parentComment.save();
      }
    }

    await comment.deleteOne();

    user.comments = user.comments.filter(
      (cId) => cId.toString() !== commentId.toString()
    );
    await user.save();

    res.json({ success: true, message: "Comment deleted successfully" });
    return;
  } catch (error) {
    console.log("Error in deleteComment controller", error);
    res.status(500).json({ message: "Server error", error: error });
    return;
  }
};

export {
  getAllComments,
  createComment,
  updateComment,
  deleteComment,
  createReply,
  getReplies,
};
