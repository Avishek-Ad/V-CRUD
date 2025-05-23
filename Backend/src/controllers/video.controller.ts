import { Request, Response } from "express";
import cloudinary from "../configs/cloudinary";
import videoValidation from "../validations/video.validation";
import Video from "../models/video";

const increaseViewCount = async (req: Request, res: Response) => {
  try {
    const videoId = req.params.id;
    const video = await Video.findById(videoId);
    if (!video) {
      res.status(404).send({ message: "Video not found" });
      return;
    }
    video.views += 1;
    await video.save();
    res.status(200).send({ success: true, message: "View count increased" });
  } catch (error) {
    console.log("Error in increaseViewCount controller", error);
    res.status(500).send({ message: "Internal Server Error", error });
  }
};

const likeVideo = async (req: Request, res: Response): Promise<void> => {
  try {
    const videoId = req.params.id;
    const userId = (req as any).user._id;

    const video = await Video.findById(videoId);
    if (!video) {
      res.status(404).send({ message: "Video not found" });
      return;
    }
    if (video.likes.some((id) => id.toString() === userId.toString())) {
      video.likes = video.likes.filter(
        (id) => id.toString() !== userId.toString()
      );
    } else {
      video.likes.push(userId);
      if (video.dislikes.some((id) => id.toString() === userId.toString())) {
        video.dislikes = video.dislikes.filter(
          (id) => id.toString() !== userId.toString()
        );
      }
    }

    await video.save();
    res
      .status(200)
      .send({ success: true, message: "Video liked successfully" });
    return;
  } catch (error) {
    console.log("Error in likeVideo controller", error);
    res.status(500).send({ message: "Internal Server Error", error });
    return;
  }
};

const dislikeVideo = async (req: Request, res: Response): Promise<void> => {
  try {
    const videoId = req.params.id;
    const userId = (req as any).user._id;
    const video = await Video.findById(videoId);
    if (!video) {
      res.status(404).send({ message: "Video not found" });
      return;
    }
    if (video.dislikes.some((id) => id.toString() === userId.toString())) {
      video.dislikes = video.dislikes.filter(
        (id) => id.toString() !== userId.toString()
      );
    } else {
      video.dislikes.push(userId);
      if (video.likes.some((id) => id.toString() === userId.toString())) {
        video.likes = video.likes.filter(
          (id) => id.toString() !== userId.toString()
        );
      }
    }

    await video.save();
    res
      .status(200)
      .send({ success: true, message: "Video disliked successfully" });
    return;
  } catch (error) {
    console.log("Error in dislikeVideo controller", error);
    res.status(500).send({ message: "Internal Server Error", error });
    return;
  }
};

const getAllVideosBySearch = async (req: Request, res: Response) => {
  try {
    const search = (req.query.search as string)?.trim() || "";
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 8;

    const query = {
      $or: [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ],
    };

    const videos = await Video.aggregate([
      { $match: query },
      {
        $addFields: {
          likesCount: {
            $cond: {
              if: { $isArray: "$likes" },
              then: { $size: "$likes" },
              else: 0,
            },
          },
          dislikesCount: {
            $cond: {
              if: { $isArray: "$dislikes" },
              then: { $size: "$dislikes" },
              else: 0,
            },
          },
        },
      },
      {
        $sort: { views: -1, likesCount: -1, dislikesCount: 1 },
      },
      { $skip: (page - 1) * limit },
      { $limit: limit },
      {
        $project: { claudinaryPublicId: 0 },
      },
    ]);

    const total = await Video.countDocuments(query);

    res.status(200).send({
      success: true,
      videos,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.log("Error in getAllVideosBySearch controller", error);
    res.status(500).send({ message: "Internal Server Error", error });
  }
};

const getAllVideosByUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 8;

    const userId = (req as any).user._id;
    const videos = await Video.find({ owner: userId })
      .select("-claudinaryPublicId")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Video.countDocuments({ owner: userId });

    res.status(200).send({
      success: true,
      videos,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    });
    return;
  } catch (error) {
    console.log("Error in getAllVideosByUser controller", error);
    res.status(500).send({ message: "Internal Server Error", error });
    return;
  }
};

const getAllVideos = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 8;
    // console.log(page, limit);

    const videos = await Video.find()
      .select("-claudinaryPublicId")
      .sort({ views: -1, createdAt: -1, _id: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    // console.log(videos);
    const total = await Video.countDocuments();

    res.status(200).send({
      success: true,
      videos,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    });
    return;
  } catch (error) {
    console.log("Error in getAllVideos controller", error);
    res.status(500).send({ message: "Internal Server Error", error });
    return;
  }
};

const getVideoByIdWithoutUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const videoId = req.params.id;
    const video = await Video.findById(videoId).select("-claudinaryPublicId");
    if (!video) {
      res.status(404).send({ message: "Video not found" });
      return;
    }
    const videoData = {
      title: video.title,
      description: video.description,
      thumbnailUrl: video.thumbnailUrl,
      videoUrl: video.videoUrl,
      likes: video.likes ? video.likes.length : 0,
      dislikes: video.dislikes ? video.dislikes.length : 0,
      views: video.views,
      owner: video.owner,
      isLiked: false,
      isDisliked: false,
    };
    res.status(200).send({ success: true, video: videoData });
    return;
  } catch (error) {
    console.log("Error in getVideoByIdWithoutUser controller", error);
    res.status(500).send({ message: "Internal Server Error", error });
    return;
  }
};

const getVideoByIdWithUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const videoId = req.params.id;
    const userId = (req as any).user?._id?.toString();
    const video = await Video.findById(videoId).select("-claudinaryPublicId");
    if (!video) {
      res.status(404).send({ message: "Video not found" });
      return;
    }
    const videoData = {
      title: video.title,
      description: video.description,
      thumbnailUrl: video.thumbnailUrl,
      videoUrl: video.videoUrl,
      likes: video.likes ? video.likes.length : 0,
      dislikes: video.dislikes ? video.dislikes.length : 0,
      views: video.views,
      owner: video.owner,
      isLiked: (video.likes || []).some((id) => id.toString() === userId),
      isDisliked: (video.dislikes || []).some((id) => id.toString() === userId),
    };
    res.status(200).send({ success: true, video: videoData });
    return;
  } catch (error) {
    console.log("Error in getVideoByIdWithUser controller", error);
    res.status(500).send({ message: "Internal Server Error", error });
    return;
  }
};

const uploadVideo = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description } = req.body;
    const userId = (req as any).user._id;

    const videoUrl = req.file?.path;
    const publicId = req.file?.filename;

    if (!videoUrl || !publicId) {
      res.status(400).send({ message: "Video not uploaded" });
      return;
    }

    // dynamic url
    const thumbnailUrl = cloudinary.url(publicId + ".jpg", {
      resource_type: "video",
      transformation: [
        { start_offset: "5", width: 300, height: 200, crop: "fill" },
      ],
    });

    const { error } = videoValidation.validate({
      title,
      description,
      videoUrl,
      thumbnailUrl,
      claudinaryPublicId: publicId,
    });

    if (error) {
      res.status(400).json({ message: error.details[0].message });
      return;
    }

    const newVideo = new Video({
      title,
      description,
      videoUrl,
      thumbnailUrl,
      claudinaryPublicId: publicId,
      owner: userId,
    });

    await newVideo.save();

    res.status(200).send({
      success: true,
      message: "Video uploaded successfully",
    });
  } catch (error) {
    console.log("Error in uploadVideo controller", error);
    res.status(500).send({ message: "Internal Server Error", error });
  }
};

const deleteVideo = async (req: Request, res: Response): Promise<void> => {
  try {
    const videoId = req.params.id;

    const video = await Video.findById(videoId);
    if (!video) {
      res.status(404).send({ message: "Video not found" });
      return;
    }

    await cloudinary.uploader.destroy(video.claudinaryPublicId, {
      resource_type: "video",
    });
    await video.deleteOne();

    res
      .status(200)
      .send({ success: true, message: "Video deleted successfully" });
    return;
  } catch (error) {
    console.log("Error in deleteVideo controller", error);
    res.status(500).send({ message: "Internal Server Error", error });
    return;
  }
};

const editVideoDetails = async (req: Request, res: Response) => {
  try {
    const videoId = req.params.id;
    const { title, description } = req.body;

    const video = await Video.findById(videoId);
    if (!video) {
      res.status(404).send({ message: "Video not found" });
      return;
    }

    video.title = title;
    video.description = description;

    await video.save();

    res.status(200).send({
      success: true,
      message: "Video details updated successfully",
    });
    return;
  } catch (error) {
    console.log("Error in editVideoDetails controller", error);
    res.status(500).send({ message: "Internal Server Error", error });
  }
};

export {
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
};
