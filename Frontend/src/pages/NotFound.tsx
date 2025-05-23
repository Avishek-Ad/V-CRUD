import { motion } from "framer-motion";

function NotFound() {
  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center bg-background text-textPrimary"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
      <p className="text-xl mb-6">Oops! Page Not Found</p>
      <a
        href="/home"
        className="px-6 py-2 rounded-full bg-primary text-white hover:bg-primary/80 transition"
      >
        Go Home
      </a>
    </motion.div>
  );
}

export default NotFound;
