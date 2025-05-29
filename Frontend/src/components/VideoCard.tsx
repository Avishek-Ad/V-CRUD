import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { videoContext, type Video } from "../contexts/VideoContext";
import { EllipsisVertical, Loader2 } from "lucide-react";
import { useContext, useState } from "react";

function VideoCard({
  video,
  index,
  fromProfile = false,
}: {
  video: Video;
  index: number;
  fromProfile?: boolean;
}) {
  const navigate = useNavigate();
  const [showOptions, setShowOptions] = useState(false);
  const { loading, deleteVideo } = useContext(videoContext)!;
  return (
    <motion.div
      key={video._id}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-card bg-opacity-80 backdrop-blur-md overflow-hidden transition duration-300 rounded-lg shadow-md"
    >
      {/* Video */}
      <div
        className="w-full aspect-[9/16] bg-black relative group"
        onClick={() => navigate(`/watch/${video._id}`)}
      >
        <video
          src={video.videoUrl}
          muted
          loop
          playsInline
          className="w-full h-full object-cover rounded-t-lg"
          onMouseOver={(e) => {
            const target = e.currentTarget;
            // Start timer and store the timer ID as a data attribute
            const timerId = setTimeout(() => target.play(), 1000);
            target.dataset.hoverTimer = timerId.toString();
          }}
          onMouseOut={(e) => {
            const target = e.currentTarget;
            // Clear the timer if it exists
            if (target.dataset.hoverTimer) {
              clearTimeout(Number(target.dataset.hoverTimer));
              delete target.dataset.hoverTimer;
            }
            target.pause();
            target.currentTime = 0;
          }}
          onError={(e) => {
            console.error("Error loading video:", video.videoUrl, e);
            e.currentTarget.src = video.thumbnailUrl;
          }}
        ></video>
      </div>

      {/* Title & Desc */}
      <div className="px-2 py-1">
        <h3 className="font-medium text-lg text-textprimary line-clamp-1">
          {video.title}
        </h3>
        <div className="flex justify-between items-center">
          <p className="text-sm text-textsecondary">
            {video.views.toLocaleString()} views
          </p>
          {fromProfile && (
            <button
              className="text-textsecondary hover:text-primary hover:bg-neutral-900 p-1 rounded-full"
              onClick={() => setShowOptions(!showOptions)}
            >
              <EllipsisVertical size={16} />
            </button>
          )}
          {showOptions && (
            <div className="absolute bottom-7 right-0 flex flex-col mt-8 bg-card p-2 rounded-lg shadow-md">
              <button
                className="text-textsecondary hover:text-primary hover:bg-neutral-900 p-1"
                onClick={() => {
                  setShowOptions(false);
                  navigate(`/edit/${video._id}`);
                }}
              >
                Edit
              </button>
              <button
                className="text-textsecondary hover:text-primary hover:bg-neutral-900 p-1 flex flex-row"
                onClick={() => deleteVideo(video._id)}
              >
                <span className="mr-2">Delete</span>{" "}
                {loading && <Loader2 className="animate-spin" />}
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default VideoCard;
