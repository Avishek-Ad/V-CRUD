import { useContext } from "react";
import { videoContext } from "../contexts/VideoContext";
import { LoaderCircle } from "lucide-react";
import VideoCard from "../components/VideoCard";

function SearchResultPage() {
  const { loading, videos, searchQuery, hasMore, page, searchVideos } =
    useContext(videoContext)!;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-background">
        <LoaderCircle className="animate-spin w-10 h-10 text-primary" />
      </div>
    );
  }

  const handleFetchMore = () => {
    console.log(page, hasMore);
    searchVideos(searchQuery, page + 1);
  };

  return (
    <div className="bg-background min-h-screen">
      <div className="bg-background px-6 py-3 max-w-5xl mx-auto space-y-8">
        <h1 className="text-2xl font-bold text-primary">
          Search Results for{" "}
          <span className="text-textsecondary">{`\n${searchQuery}`}</span>
        </h1>
      </div>
      <div className="bg-background p-6 max-w-5xl mx-auto space-y-8">
        {videos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 hover:cursor-pointer">
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
      </div>
    </div>
  );
}

export default SearchResultPage;
