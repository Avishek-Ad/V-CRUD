import { useContext, useEffect, useState } from "react";
import { videoContext } from "../contexts/VideoContext";
// import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";

function UploadPage() {
  const { loading, uploadVideo } = useContext(videoContext)!;
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    video: null as File | null,
  });
  const [message, setMessage] = useState("");

  // const navigate = useNavigate();

  // useEffect(() => {
  //   if (!loading) {
  //     setMessage("Video uploaded successfully!");
  //   }
  // }, [loading]);

  useEffect(() => {
    if (!loading && message) {
      toast.success(message);
      setMessage("");
    }
  }, [message, loading]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({
      ...prev,
      video: file,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Guard check: make sure video file exists
    if (!formData.video) {
      alert("Please select a video file before uploading.");
      return;
    }

    // Upload with video guaranteed as File
    uploadVideo({
      title: formData.title,
      description: formData.description,
      video: formData.video, // Type is now File (not File | null)
    });

    setMessage("Video uploaded successfully!");
  };

  return (
    <div className="bg-background min-h-screen py-10 px-4">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-3xl mx-auto p-8 bg-card rounded-3xl shadow-xl border border-border"
      >
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-4xl font-bold text-center text-primary mb-8 tracking-wide"
        >
          Upload New Video
        </motion.h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Preview */}
          {formData.video && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="rounded-xl overflow-hidden shadow-md"
            >
              <video
                controls
                className="w-full max-h-[400px] object-contain rounded-xl"
              >
                <source src={URL.createObjectURL(formData.video)} />
              </video>
            </motion.div>
          )}

          {/* Video File */}
          <div>
            <label
              htmlFor="video"
              className="block text-sm font-semibold text-textprimary mb-2"
            >
              Video File
            </label>
            <input
              type="file"
              name="video"
              id="video"
              accept="video/*"
              onChange={handleFileChange}
              className="w-full border border-border rounded-xl px-4 py-3 text-textsecondary bg-background cursor-pointer hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary transition duration-200"
            />
            {formData.video && (
              <p className="text-xs text-textsecondary mt-1">
                Selected: {formData.video.name}
              </p>
            )}
          </div>

          {/* Title */}
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-semibold text-textprimary mb-2"
            >
              Title
            </label>
            <input
              type="text"
              name="title"
              id="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full border border-border rounded-xl px-4 py-3 bg-background text-textprimary placeholder-textsecondary focus:ring-2 focus:ring-primary outline-none transition duration-200"
              placeholder="Enter video title"
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-semibold text-textprimary mb-2"
            >
              Description
            </label>
            <textarea
              name="description"
              id="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full border border-border rounded-xl px-4 py-3 bg-background text-textprimary placeholder-textsecondary focus:ring-2 focus:ring-primary outline-none transition duration-200"
              placeholder="Write a short description..."
            ></textarea>
          </div>

          {/* Submit Button */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            type="submit"
            className="w-full bg-primary hover:bg-secondary text-white font-semibold py-3 rounded-xl transition duration-300 shadow-md"
            disabled={loading}
          >
            {loading ? "Uploading..." : "Upload Video"}
          </motion.button>
        </form>
      </motion.div>

      {/* Toast Notifications */}
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar
        closeOnClick
        pauseOnHover
        draggable
        theme="dark"
      />
    </div>
  );
}

export default UploadPage;
