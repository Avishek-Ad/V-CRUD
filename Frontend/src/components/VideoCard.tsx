import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import type { Video } from "../contexts/VideoContext";

function VideoCard({ video, index }: { video: Video; index: number }) {
  const navigate = useNavigate();
  return (
    <motion.div
      key={video._id}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-card bg-opacity-80 backdrop-blur-md overflow-hidden transition duration-300 rounded-lg shadow-md"
      onClick={() => navigate(`/watch/${video._id}`)}
    >
      {/* Video */}
      <div className="w-full aspect-[9/16] bg-black relative group">
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
        <p className="text-sm text-textsecondary">
          {video.views.toLocaleString()} views
        </p>
      </div>
    </motion.div>
  );
}

export default VideoCard;
