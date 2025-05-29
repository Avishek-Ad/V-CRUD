import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-tr from-[#0f0c29] via-[#302b63] to-[#24243e] text-white flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-3xl text-center space-y-8"
      >
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight"
        >
          <span className="bg-gradient-to-r from-primary to-[#f3b7a7] bg-clip-text text-transparent">
            V-CRUD
          </span>{" "}
          brings your videos to life
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-lg text-gray-300 max-w-xl mx-auto"
        >
          Discover, share, and stream high-quality videos with a sleek
          experience powered by modern tech.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button
            className="px-6 py-3 text-lg rounded-xl bg-gradient-to-r from-primary to-[#ff1100] text-white hover:opacity-90 transition font-medium"
            onClick={() => navigate("/home")}
          >
            Get Started
          </button>
          <button
            className="text-sm text-gray-400 hover:text-white transition"
            onClick={() =>
              window.open("https://github.com/Avishek-Ad/V-CRUD", "_blank")
            }
          >
            View on GitHub →
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default LandingPage;
