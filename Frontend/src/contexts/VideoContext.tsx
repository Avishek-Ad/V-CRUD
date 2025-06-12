import { createContext, useContext, useState } from "react";
import axiosInstance from "../libs/axios";
import { userContext } from "./UserContext";

type Comment = {
  _id: string;
  user: {
    _id: string;
    username: string;
    avatar: string;
  };
  text: string;
  likes: number;
  dislikes: number;
};

export type Video = {
  _id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  views: number;
  likes: number;
  dislikes: number;
  isLiked: boolean;
  isDisliked: boolean;
  comments: Comment[];
};

type VideoFormData = {
  title: string;
  description: string;
  video: File;
};

type VideoContextProps = {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  videos: Video[];
  currentVideo: Video | null;
  loading: boolean;
  message: string;
  error: string;
  hasMore: boolean;
  page: number;

  increaseVideoViews: (videoId: string) => void;
  likeVideo: (videoId: string) => void;
  dislikeVideo: (videoId: string) => void;
  fetchVideos: (page: number) => void;
  fetchVideosByUser: (page: number) => void;
  searchVideos: (query: string, page: number, reset?: boolean) => void;
  fetchVideo: (videoId: string) => void;
  uploadVideo: (formData: VideoFormData) => void;
  editVideoDetails: (
    title: string,
    description: string,
    videoId: string
  ) => void;
  deleteVideo: (videoId: string) => void;
};

type VideoProviderProps = {
  children: React.ReactNode;
};

// const mockVideos: Video[] = [
//   {
//     _id: "short123abc",
//     title: "Amazing Mountain View!",
//     description: "Quick look at the stunning scenery.",
//     videoUrl: "https://youtube.com/shorts/oKX4nACWz3o?si=yTqfL0rJAnC29emH",
//     thumbnailUrl:
//       "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQeiHExDi9c8IH23UeWEsudrzc_zw2QIuW_Bw&s",
//     views: 5421,
//     likes: 678,
//     dislikes: 12,
//   },
//   {
//     _id: "short456def",
//     title: "TypeScript Tip of the Day",
//     description: "Learn a useful TypeScript trick in seconds!",
//     videoUrl: "https://s3.amazonaws.com/my-shorts-bucket/ts_tip_short.mp4",
//     thumbnailUrl:
//       "https://s3.amazonaws.com/my-shorts-thumbnails-bucket/ts_tip_short_thumb.jpg",
//     views: 12890,
//     likes: 955,
//     dislikes: 3,
//   },
//   {
//     _id: "short789ghi",
//     title: "Easy Pasta Recipe!",
//     description: "Whip up delicious pasta in no time.",
//     videoUrl: "https://cloudflare-videos.com/my-shorts/pasta_recipe_short.mp4",
//     thumbnailUrl:
//       "https://cloudflare-images.com/my-short-thumbs/pasta_recipe_short_thumb.jpg",
//     views: 3876,
//     likes: 412,
//     dislikes: 18,
//   },
//   {
//     _id: "shortabc012",
//     title: "Morning Hike Adventure",
//     description: "Enjoying the fresh air on a quick morning hike.",
//     videoUrl: "https://vimeo.com/my-shorts-channel/morning_hike_short.mp4",
//     thumbnailUrl:
//       "https://i.vimeocdn.com/video/my-short-thumbs/morning_hike_short_thumb.jpg",
//     views: 2198,
//     likes: 301,
//     dislikes: 7,
//   },
//   {
//     _id: "shortdef345",
//     title: "React Quick Tip!",
//     description: "A handy React component trick for you.",
//     videoUrl: "https://www.dropbox.com/s/my-shorts/react_tip_short.mp4?raw=1",
//     thumbnailUrl:
//       "https://www.dropbox.com/s/my-short-thumbs/react_tip_short_thumb.jpg?raw=1",
//     views: 7652,
//     likes: 789,
//     dislikes: 2,
//   },
//   {
//     _id: "shortghi678",
//     title: "Simple Dessert Idea",
//     description: "A quick and easy dessert to satisfy your sweet tooth.",
//     videoUrl:
//       "https://onedrive.live.com/download?resid=YOUR_RESID&authkey=!YOUR_AUTHKEY&em=2",
//     thumbnailUrl:
//       "https://onedrive.live.com/download?resid=YOUR_RESID_THUMB&authkey=!YOUR_AUTHKEY_THUMB&em=2",
//     views: 4321,
//     likes: 520,
//     dislikes: 11,
//   },
// ];

export const videoContext = createContext<VideoContextProps | undefined>(
  undefined
);

const VideoProvider = ({ children }: VideoProviderProps) => {
  const { user } = useContext(userContext)!;
  const [videos, setVideos] = useState<Video[]>([]);
  const [currentVideo, setCurrentVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [hasMore, setHasMore] = useState(true);

  // useEffect(() => {
  //   fetchVideos(page);
  // }, [page]);

  // useEffect(() => {
  //   setPage(1);
  // }, []);

  const increaseVideoViews = async (videoId: string) => {
    try {
      const response = await axiosInstance.post(`/videos/addview/${videoId}`);
      console.log(response.data);
    } catch (error) {
      console.log("Error in increaseVideoViews", error);
    }
  };

  const likeVideo = async (videoId: string) => {
    try {
      const response = await axiosInstance.post(`/videos/like/${videoId}`);
      console.log(response.data);
      fetchVideo(videoId);
    } catch (error) {
      console.log("Error in likeVideo", error);
    }
  };

  const dislikeVideo = async (videoId: string) => {
    try {
      const response = await axiosInstance.post(`/videos/dislike/${videoId}`);
      console.log(response.data);
      fetchVideo(videoId);
    } catch (error) {
      console.log("Error in dislikeVideo", error);
    }
  };

  const fetchVideos = async (newPage = 1) => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/videos?page=${newPage}`);
      const newVideos = response.data.videos;

      if (response.data.success) {
        setMessage("");
        setVideos((prev) => {
          const existingIds = new Set(
            (newPage === 1 ? [] : prev).map((v: Video) => v._id)
          );
          const uniqueNewVideos = newVideos.filter(
            (v: Video) => !existingIds.has(v._id)
          );
          return newPage === 1
            ? uniqueNewVideos
            : [...prev, ...uniqueNewVideos];
        });

        setHasMore(newVideos.length > 0);
        // console.log(newPage);
        setPage(newPage);
        setError("");
      } else {
        setVideos([]);
        setError(response.data.message);
        setMessage("");
      }

      // console.log(response.data);
    } catch (error) {
      setVideos([]);
      setError("Video Fetch Failed");
      console.log("Error in fetchVideos", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchVideo = async (videoId: string) => {
    setLoading(true);
    try {
      // console.log(user);
      const response = user
        ? await axiosInstance.get(`/videos/user/${videoId}`)
        : await axiosInstance.get(`/videos/${videoId}`);

      if (response.data.success) {
        setMessage("");
        setCurrentVideo(response.data.video);
        setError("");
      } else {
        setCurrentVideo(null);
        setError(response.data.message);
        setMessage("");
      }

      // console.log(response.data.video);
    } catch (error) {
      setError("Video Fetch Failed");
      console.log("Error in fetchVideo", error);
    } finally {
      setLoading(false);
    }
  };

  const searchVideos = async (query: string, newPage = 1, reset = false) => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        `/videos/search?search=${query}&page=${newPage}`
      );
      const newVideos = response.data.videos;

      if (response.data.success) {
        setMessage("");
        setVideos((prev) => {
          const existingIds = new Set(
            (reset ? [] : prev).map((v: Video) => v._id)
          );
          const uniqueNewVideos = newVideos.filter(
            (v: Video) => !existingIds.has(v._id)
          );

          return reset ? uniqueNewVideos : [...prev, ...uniqueNewVideos];
        });

        console.log(videos);
        setHasMore(newVideos.length > 0);
        setPage(newPage);
        setError("");
      } else {
        setVideos([]);
        setError(response.data.message);
        setMessage("");
      }

      console.log(response.data);
    } catch (error) {
      setError("Video Fetch Failed");
      setVideos([]);
      console.log("Error in searchVideos", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchVideosByUser = async (newPage = 1) => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        `/videos/byuser?page=${newPage}`
      );
      const newVideos = response.data.videos;

      if (response.data.success) {
        setMessage("");
        setVideos((prev) => {
          const existingIds = new Set(
            (newPage === 1 ? [] : prev).map((v: Video) => v._id)
          );
          const uniqueNewVideos = newVideos.filter(
            (v: Video) => !existingIds.has(v._id)
          );
          return newPage === 1
            ? uniqueNewVideos
            : [...prev, ...uniqueNewVideos];
        });
        setHasMore(newVideos.length > 0);
        setPage(newPage);
        setError("");
      } else {
        setVideos([]);
        setError(response.data.message);
        setMessage("");
      }

      console.log(response.data);
    } catch (error) {
      setVideos([]);
      setError("Video Fetch Failed");
      console.log("Error in fetchVideosByUser", error);
    } finally {
      setLoading(false);
    }
  };

  const uploadVideo = async (formData: VideoFormData) => {
    setLoading(true);
    try {
      const payload = new FormData();
      payload.append("title", formData.title);
      payload.append("description", formData.description);
      payload.append("video", formData.video);
      const response = await axiosInstance.post("/videos/upload", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.success) {
        setMessage(response.data.message);
        setError("");
      } else {
        setError(response.data.message);
        setMessage("");
      }

      console.log(response.data);
    } catch (error) {
      setError("Video Upload Failed");
      setMessage("");
      console.log("Error in uploadVideo", error);
    } finally {
      setLoading(false);
    }
  };

  const editVideoDetails = async (
    title: string,
    description: string,
    videoId: string
  ) => {
    setLoading(true);
    try {
      const response = await axiosInstance.put(`/videos/edit/${videoId}`, {
        title,
        description,
      });
      if (response.data.success) {
        setMessage(response.data.message);
        setError("");
      } else {
        setError(response.data.message);
        setMessage("");
      }

      console.log(response.data);
    } catch (error) {
      setError("Video Edit Failed");
      console.log("Error in Edit Video Details", error);
    } finally {
      setLoading(false);
    }
  };
  const deleteVideo = async (videoId: string) => {
    setLoading(true);
    try {
      const response = await axiosInstance.delete(`/videos/delete/${videoId}`);
      if (response.data.success) {
        setMessage(response.data.message);
        setError("");
        fetchVideosByUser(page);
      } else {
        setError(response.data.message);
        setMessage("");
      }

      console.log(response.data);
    } catch (error) {
      setError("Video Delete Failed");
      console.log("Error in Delete Video", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <videoContext.Provider
      value={{
        searchQuery,
        setSearchQuery,
        videos,
        currentVideo,
        loading,
        message,
        error,
        hasMore,
        page,
        increaseVideoViews,
        likeVideo,
        dislikeVideo,
        fetchVideos,
        fetchVideosByUser,
        searchVideos,
        fetchVideo,
        uploadVideo,
        editVideoDetails,
        deleteVideo,
      }}
    >
      {children}
    </videoContext.Provider>
  );
};

export default VideoProvider;
