import { useContext, useEffect } from "react";
import { videoContext } from "../contexts/VideoContext";
import { LoaderCircle } from "lucide-react";
import VideoCard from "../components/VideoCard";

function MainPage() {
  const { loading, videos, fetchVideos, hasMore, page, setSearchQuery } =
    useContext(videoContext)!;
  // const observerRef = useRef<IntersectionObserver | null>(null);

  // const lastVideoRef = useCallback(
  //   (node: HTMLDivElement | null) => {
  //     if (loading) return;
  //     if (observerRef.current) observerRef.current.disconnect();

  //     observerRef.current = new IntersectionObserver((entries) => {
  //       if (entries[0].isIntersecting && hasMore) {
  //         fetchVideos(page + 1);
  //       }
  //     });

  //     if (node) observerRef.current.observe(node);
  //   },
  //   [loading, hasMore, page, fetchVideos]
  // );

  useEffect(() => {
    // console.log(" ");
    setSearchQuery("");
    localStorage.removeItem("query");
    fetchVideos(1); // Load first page
  }, []);

  const handleFetchMore = () => {
    console.log(page, hasMore);
    fetchVideos(page + 1);
  };

  return (
    <div className="bg-background min-h-screen">
      <div className="bg-background p-6 max-w-5xl mx-auto space-y-8">
        {videos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {videos.map((video, index) => (
              <VideoCard key={video._id} video={video} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center text-textsecondary mt-10">
            No videos found
          </div>
        )}

        {hasMore && (
          <div className="flex justify-center mt-6">
            <button
              onClick={() => handleFetchMore()}
              className="bg-primary text-white px-4 py-2 rounded-full inline-block text-sm font-medium"
            >
              Load More
            </button>
          </div>
        )}

        {loading && (
          <div className="flex justify-center mt-6">
            <LoaderCircle className="animate-spin w-8 h-8 text-primary" />
          </div>
        )}
      </div>
    </div>
  );
}

export default MainPage;
