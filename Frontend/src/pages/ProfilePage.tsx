import { useContext, useEffect } from "react";
import { videoContext } from "../contexts/VideoContext";
import { LoaderCircle } from "lucide-react";
import VideoCard from "../components/VideoCard";
import { userContext } from "../contexts/UserContext";

function ProfilePage() {
  const { loading, videos, fetchVideosByUser, page, hasMore } =
    useContext(videoContext)!;
  const { user } = useContext(userContext)!;

  useEffect(() => {
    console.log("Profile Page");
    fetchVideosByUser(1);
  }, []);

  const handleFetchMore = () => {
    fetchVideosByUser(page + 1);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-background">
        <LoaderCircle className="animate-spin w-10 h-10 text-primary" />
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen text-textprimary px-4 py-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Profile Info Section */}
        <div className="bg-card p-6 rounded-xl shadow-md flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <img
            src={user?.avatar}
            alt={user?.username}
            className="w-32 h-32 sm:w-36 sm:h-36 rounded-full object-cover border-4 border-primary transition hover:scale-105 duration-300"
          />
          <div className="text-center sm:text-left space-y-2">
            <h2 className="text-3xl font-bold">{user?.username}</h2>
            <p className="text-textsecondary">{user?.email}</p>
            <p className="bg-primary text-white px-3 py-1 rounded-full inline-block text-sm font-medium">
              {user?.role}
            </p>
          </div>
          {/* <button className="px-6 py-2 rounded-lg bg-primary text-white hover:bg-primary/80 transition">
            Edit Profile
          </button> */}
        </div>

        {/* Video List Section */}
        <div className="space-y-4">
          <h1 className="text-2xl font-bold text-primary">My Videos</h1>
          {videos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {videos.map((video, index) => (
                <VideoCard
                  key={video._id}
                  video={video}
                  index={index}
                  fromProfile={true}
                />
              ))}
            </div>
          ) : (
            <div className="text-center text-textsecondary mt-10">
              No videos found
            </div>
          )}

          {hasMore && (
            <div className="flex justify-center mt-4">
              <button
                className="px-6 py-2 rounded-full bg-primary text-white hover:bg-primary/80 transition"
                onClick={() => handleFetchMore()}
              >
                Load More
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
