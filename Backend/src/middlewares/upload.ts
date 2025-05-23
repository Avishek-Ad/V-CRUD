import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../configs/cloudinary";

const VideoStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "videos", // All videos go to Cloudinary folder "videos"
    resource_type: "video", // Important! Tells Cloudinary it's a video
  } as any,
});

const AvatarStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "avatars", // All videos go to Cloudinary folder "videos"
    resource_type: "image", // Important! Tells Cloudinary it's a video
  } as any,
});

const videoUpload = multer({ storage: VideoStorage });

const avatarUpload = multer({ storage: AvatarStorage });

export { videoUpload, avatarUpload };
