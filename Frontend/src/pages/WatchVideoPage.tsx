import { useContext, useEffect, useRef, useState } from "react";
import { videoContext } from "../contexts/VideoContext";
import { useNavigate, useParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  ThumbsUp,
  ThumbsDown,
  Share2,
  MessageSquare,
  LoaderCircle,
  X,
  Pause,
  Play,
  Volume2,
  VolumeOff,
  ArrowRight,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import NavBar from "../components/NavBar";
import { userContext } from "../contexts/UserContext";
import { commentContext } from "../contexts/CommentContext";

// const dummyComments = [
//   {
//     _id: "c1",
//     user: {
//       _id: "u1",
//       username: "john_doe",
//       avatar: "https://example.com/avatars/john.png",
//     },
//     text: "This video is amazing! Learned a lot, thanks!",
//     likes: 12,
//     dislikes: 1,
//     createdAt: "2022-01-01T12:34:56Z",
//   },
//   {
//     _id: "c2",
//     user: {
//       _id: "u2",
//       username: "jane_smith",
//       avatar: "https://example.com/avatars/jane.png",
//     },
//     text: "I disagree with some points made here, but overall good content.",
//     likes: 5,
//     dislikes: 3,
//     createdAt: "2022-01-02T09:12:34Z",
//   },
//   {
//     _id: "c3",
//     user: {
//       _id: "u3",
//       username: "video_fan_89",
//       avatar: "https://example.com/avatars/fan89.png",
//     },
//     text: "Can someone explain the part at 3:45? I didn’t quite get it.",
//     likes: 7,
//     dislikes: 0,
//     createdAt: "2022-01-03T15:45:12Z",
//   },
//   {
//     _id: "c4",
//     user: {
//       _id: "u4",
//       username: "tech_guru",
//       avatar: "https://example.com/avatars/techguru.png",
//     },
//     text: "Great tutorial, very clear and concise. Subscribed!",
//     likes: 20,
//     dislikes: 0,
//     createdAt: "2022-01-04T10:23:45Z",
//   },
//   {
//     _id: "c5",
//     user: {
//       _id: "u5",
//       username: "casual_viewer",
//       avatar: "https://example.com/avatars/casual.png",
//     },
//     text: "Not my type of content, but well made.",
//     likes: 2,
//     dislikes: 5,
//     createdAt: "2022-01-05T14:56:78Z",
//   },
// ];

function WatchVideoPage() {
  const {
    currentVideo,
    loading,
    fetchVideo,
    likeVideo,
    dislikeVideo,
    increaseVideoViews,
  } = useContext(videoContext)!;
  const {
    comments,
    createComment,
    fetchComments,
    loading: loadingComments,
    fetchReplies,
    createReply,
    replies,
  } = useContext(commentContext)!;
  const { user } = useContext(userContext)!;
  const { id: videoId } = useParams();
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [share, setShare] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showSignIn, setShowSignIn] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [hasCountedView, setHasCountedView] = useState(false);
  const [volume, setVolume] = useState(
    Number(localStorage.getItem("volume")) || 1
  ); // 1 means 100% volume

  const [newComment, setNewComment] = useState("");
  const [newReply, setNewReply] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [showReplyTo, setShowReplyTo] = useState<string | null>(null);

  useEffect(() => {
    fetchComments(videoId!);
  }, [videoId, showComments === true]);

  useEffect(() => {
    if (user !== undefined && videoId) {
      fetchVideo(videoId);
    }
  }, [user, videoId]);

  useEffect(() => {
    localStorage.setItem("volume", volume.toString());
    if (videoRef.current) {
      videoRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = volume;
    }
  }, [currentVideo, volume]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateProgress = () => {
      const value = (video.currentTime / video.duration) * 100;
      setProgress(isNaN(value) ? 0 : value);
      // console.log(value);
      if (value > 30 && !hasCountedView && videoId) {
        //send a request to increase view
        increaseVideoViews(videoId);
        setHasCountedView(true);
      }
    };

    video.addEventListener("timeupdate", updateProgress);
    return () => video.removeEventListener("timeupdate", updateProgress);
  });

  const copyUrl = () => {
    navigator.clipboard
      .writeText(window.location.href)
      .then(() => alert("Copied to clipboard!"))
      .catch((err) => console.error("Failed to copy: ", err));
  };

  const pauseNplay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setPlaying(true);
      } else {
        videoRef.current.pause();
        setPlaying(false);
      }
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newTime = (clickX / rect.width) * (videoRef.current?.duration || 0);
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
    }
  };

  const handleLike = () => {
    if (user && currentVideo && videoId) {
      likeVideo(videoId);
    } else {
      setShowSignIn(true);
    }
  };

  const handleDislike = () => {
    if (user && currentVideo && videoId) {
      dislikeVideo(videoId);
    } else {
      setShowSignIn(true);
    }
  };

  const handleComment = () => {
    if (user && currentVideo && videoId) {
      createComment(newComment, videoId);
      setNewComment("");
    } else {
      setShowSignIn(true);
    }
  };

  const handleReply = (commentId: string) => {
    if (user && currentVideo && videoId) {
      createReply(newReply, commentId);
      setNewReply("");
      setShowReplyTo(null);
    } else {
      setShowSignIn(true);
    }
  };

  const handleShowReply = (commentId: string) => {
    setShowReplyTo(showReplyTo === commentId ? null : commentId);
    fetchReplies(commentId);
  };

  return (
    <div className="bg-background min-h-screen">
      <div className="hidden md:block">
        <NavBar />
      </div>
      <div className="flex flex-col items-center relative">
        {/* Video Player + Loading */}
        <div className="w-full max-w-md mx-auto relative flex justify-center">
          {!loading ? (
            <div className="relative w-full sm:w-8/12 mx-auto">
              <motion.video
                ref={videoRef}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                src={currentVideo?.videoUrl || ""}
                controls={false}
                onPlay={setPlaying.bind(null, true)}
                autoPlay
                muted={false}
                className="w-full h-auto sm:h-[560px] rounded-xl shadow-lg object-cover"
                onClick={() => {
                  playing && pauseNplay();
                }}
              />
              {/* Video Title */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: playing ? 0 : 1 }}
                transition={{ duration: 0.8 }}
                className="absolute w-full top-0 rounded-t-xl left-1/2 transform -translate-x-1/2 bg-black/60 p-1 text-white font-semibold text-center pointer-events-none"
              >
                {currentVideo?.title}
              </motion.div>
              {/* Custom Play/Pause Button */}
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: playing ? 0 : 1 }}
                transition={{ duration: 0.8 }}
                onClick={() => {
                  const video = videoRef.current;
                  if (video?.paused) {
                    video.play();
                    setPlaying(true);
                  } else {
                    video?.pause();
                    setPlaying(false);
                  }
                }}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 bg-primary text-white p-4 rounded-full shadow-md hover:bg-primary/90 transition"
              >
                {playing ? <Play /> : <Pause />}
              </motion.button>

              <div className="absolute bottom-2 right-0 group flex items-center space-x-2 bg-black/50 pl-2 py-2 rounded-full transition">
                {volume === 0 ? (
                  <VolumeOff className="text-white" />
                ) : (
                  <Volume2 className="text-white" />
                )}
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="w-0 group-hover:w-24 transition-all duration-300 overflow-hidden cursor-pointer accent-primary"
                />
              </div>

              <AnimatePresence>
                {!playing && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "4px" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-gray-300 rounded-full w-full overflow-hidden cursor-pointer"
                    onClick={handleSeek}
                  >
                    <motion.div
                      className="h-1 bg-primary rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            // Loading only in video frame area
            <div className="w-full sm:w-8/12 h-[560px] flex items-center justify-center bg-black rounded-xl shadow-lg mx-auto">
              <LoaderCircle className="animate-spin w-10 h-10 text-primary" />
            </div>
          )}

          {/* Action Buttons */}
          <div className="absolute top-30 right-2 sm:right-[10px] flex flex-col items-center space-y-6">
            {/* Like */}
            <div className="flex flex-col items-center text-white">
              <motion.button
                whileTap={{ scale: 0.9 }}
                className={`p-2 rounded-full bg-neutral-700/30 md:bg-neutral-700/100 hover:bg-primary hover:text-white transition ${
                  currentVideo?.isLiked ? "text-primary" : "text-white"
                }`}
                onClick={() => handleLike()}
              >
                <ThumbsUp size={28} className="opacity-100" />
              </motion.button>
              <span className="text-xs mt-1">{currentVideo?.likes}</span>
            </div>

            {/* Dislike */}
            <div className="flex flex-col items-center text-white">
              <motion.button
                whileTap={{ scale: 0.9 }}
                className={`p-2 rounded-full bg-neutral-700/30 md:bg-neutral-700/100 hover:bg-primary hover:text-white transition ${
                  currentVideo?.isDisliked ? "text-primary" : "text-white"
                }`}
                onClick={() => handleDislike()}
              >
                <ThumbsDown size={28} />
              </motion.button>
              <span className="text-xs mt-1">Dislike</span>
            </div>

            {/* Share */}
            <div className="flex flex-col items-center text-white">
              <motion.button
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-full bg-neutral-700/30 md:bg-neutral-700/100 hover:bg-primary hover:text-white transition"
                onClick={() => setShare(!share)}
              >
                <Share2 size={28} />
              </motion.button>
              <span className="text-xs mt-1">Share</span>
            </div>

            {/* Comment */}
            <div className="flex flex-col items-center text-white">
              <motion.button
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-full bg-neutral-700/30 md:bg-neutral-700/100 hover:bg-primary hover:text-white transition"
                onClick={() => setShowComments(!showComments)}
              >
                <MessageSquare size={28} />
              </motion.button>
              <span className="text-xs mt-1">Comment</span>
            </div>
          </div>
        </div>
        {share && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="fixed top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="relative bg-white text-black dark:bg-zinc-900 dark:text-white p-6 rounded-xl shadow-2xl max-w-sm w-[90%]"
            >
              {/* Close Icon */}
              <button
                className="absolute top-3 right-3 text-zinc-500 hover:text-red-500 transition"
                onClick={() => setShare(false)}
                aria-label="Close Share Modal"
              >
                <X size={20} />
              </button>

              {/* Modal Title */}
              <h2 className="text-xl font-semibold mb-4">Share this video</h2>

              {/* URL and Copy Button */}
              <div className="flex items-center justify-between bg-zinc-100 dark:bg-zinc-800 px-3 py-2 rounded-lg text-sm">
                <p className="truncate text-zinc-700 dark:text-zinc-300">
                  {window.location.href}
                </p>
                <button
                  onClick={copyUrl}
                  className="ml-4 px-3 py-1 bg-primary text-white rounded-md hover:bg-primary/80 transition"
                >
                  COPY
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {showSignIn && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="fixed top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="relative bg-white text-black dark:bg-zinc-900 dark:text-white p-6 rounded-xl shadow-2xl max-w-sm w-[90%]"
            >
              <button
                className="absolute top-3 right-3 text-zinc-500 hover:text-red-500 transition"
                onClick={() => setShowSignIn(false)}
                aria-label="Close Sign In Modal"
              >
                <X size={20} />
              </button>
              <h2 className="text-xl font-semibold mb-4">Please Sign In</h2>
              <button
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/80 transition"
                onClick={() => navigate("/login")}
              >
                Sign In
              </button>
            </motion.div>
          </motion.div>
        )}

        {showComments && (
          <motion.div
            initial={{ opacity: 0, y: 20, right: "100%" }}
            animate={{ opacity: 1, y: 0, right: "0%" }}
            exit={{ opacity: 0, y: 20, right: "100%" }}
            transition={{ duration: 0.25 }}
            className={`
              fixed top-0 left-0 z-50 flex items-center justify-center
              w-full h-full
              lg:w-[400px] lg:h-[500px] bg-transparent lg:top-[15%] lg:left-[68%]
            `}
          >
            <div
              className={`
                bg-white dark:bg-zinc-900 text-black dark:text-white rounded-xl shadow-2xl
                w-full max-w-md max-h-[80vh] flex flex-col overflow-hidden relative
                p-6
                lg:max-w-none lg:max-h-none lg:p-6 lg:w-[400px] lg:h-[500px]
                lg:rounded-xl lg:shadow-2xl lg:relative
              `}
            >
              <button
                onClick={() => setShowComments(false)}
                aria-label="Close comments"
                className="absolute top-3 right-3 text-zinc-500 hover:text-red-500 transition"
              >
                <X size={24} />
              </button>

              <h2 className="text-xl font-semibold mb-4 border-b border-zinc-200 dark:border-zinc-700 pb-2">
                Comments
              </h2>

              <div className="flex-1 overflow-y-auto pr-2 space-y-6 custom-scrollbar">
                {comments && comments.length ? (
                  comments.map((comment) => (
                    <div
                      key={comment._id}
                      className="flex items-start space-x-4"
                    >
                      {/* Placeholder for user profile picture */}
                      {/* <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-zinc-700 flex-shrink-0" /> */}
                      <img
                        src={comment.user.avatar}
                        alt={comment.user.username}
                        className="w-10 h-10 rounded-full bg-gray-300 dark:bg-zinc-700 flex-shrink-0"
                      />

                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-medium text-sm">
                            {comment.user.username}
                          </h3>
                          <span className="text-xs text-zinc-500 dark:text-zinc-400">
                            • {comment.createdAt}
                          </span>
                        </div>
                        <p className="text-sm text-zinc-800 dark:text-zinc-200 mt-1">
                          {comment.content}
                        </p>

                        <div className="flex space-x-4 text-zinc-600 dark:text-zinc-400 mt-2 text-sm">
                          <button className="flex items-center gap-1 hover:text-blue-600 transition">
                            <ThumbsUp size={16} /> {comment.likes}
                          </button>
                          <button className="flex items-center gap-1 hover:text-red-600 transition">
                            <ThumbsDown size={16} /> {comment.dislikes}
                          </button>
                          <div className="flex items-center gap-1">
                            <button
                              className="flex items-center gap-1 hover:text-primary transition"
                              onClick={() =>
                                setReplyingTo(
                                  replyingTo === comment._id
                                    ? null
                                    : comment._id
                                )
                              }
                            >
                              {replyingTo === comment._id ? "cancel" : "reply"}
                            </button>
                          </div>
                        </div>
                        {replyingTo === comment._id && (
                          <div className="flex items-center gap-2 mt-2">
                            <input
                              type="text"
                              placeholder="Add a Reply..."
                              value={newReply}
                              onChange={(e) => setNewReply(e.target.value)}
                              className="w-full border text-sm border-zinc-200 dark:border-zinc-700 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                            <button
                              className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/80 transition"
                              onClick={() => handleReply(comment._id)}
                            >
                              <ArrowRight size={16} />
                            </button>
                          </div>
                        )}

                        {comment.replies.length > 0 && (
                          <div
                            className="flex items-center text-sm hover:text-primary transition mt-1"
                            onClick={() => handleShowReply(comment._id)}
                          >
                            {showReplyTo === comment._id ? (
                              <ChevronUp size={18} />
                            ) : (
                              <ChevronDown size={18} />
                            )}
                            {comment.replies.length} replies
                          </div>
                        )}

                        {showReplyTo === comment._id &&
                          replies.length > 0 &&
                          replies.map((reply) => (
                            <div
                              key={comment._id}
                              className="flex items-start space-x-2 mt-4"
                            >
                              <img
                                src={reply.user.avatar}
                                alt={reply.user.username}
                                className="w-8 h-8 rounded-full bg-gray-300 dark:bg-zinc-700 flex-shrink-0"
                              />

                              <div className="flex-1">
                                <div className="flex items-center space-x-2">
                                  <h3 className="font-medium text-sm">
                                    {reply.user.username}
                                  </h3>
                                  <span className="text-xs text-zinc-500 dark:text-zinc-400">
                                    • {reply.createdAt}
                                  </span>
                                </div>
                                <p className="text-sm text-zinc-800 dark:text-zinc-200 mt-1">
                                  {reply.content}
                                </p>

                                <div className="flex space-x-4 text-zinc-600 dark:text-zinc-400 text-sm mt-2">
                                  <button className="flex items-center gap-1 hover:text-blue-600 transition">
                                    <ThumbsUp size={14} /> {comment.likes}
                                  </button>
                                  <button className="flex items-center gap-1 hover:text-red-600 transition">
                                    <ThumbsDown size={14} /> {comment.dislikes}
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-zinc-500 dark:text-zinc-400 mt-10">
                    No comments yet
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2 mt-2">
                <input
                  type="text"
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="w-full border border-zinc-200 dark:border-zinc-700 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/80 transition"
                  onClick={handleComment}
                >
                  {loadingComments ? (
                    <LoaderCircle className="animate-spin w-5 h-5" />
                  ) : (
                    <ArrowRight size={24} />
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default WatchVideoPage;
