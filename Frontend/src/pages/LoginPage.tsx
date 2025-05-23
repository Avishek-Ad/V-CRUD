import { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { userContext } from "../contexts/UserContext";
import { LoaderCircle } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";

function LoginPage() {
  const { loading, error, login } = useContext(userContext)!;
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submitted", form);
    login(form.email, form.password);
  };

  return (
    <div className="min-h-screen bg-background text-textprimary flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md bg-[var(--color-card)] p-8 rounded-xl shadow-xl"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">
          Log in to Your Account
        </h2>

        {/* {error && (
          <div className="bg-error text-white p-2 mb-4 rounded text-sm text-center">
            {error}
          </div>
        )} */}

        <form onSubmit={(e) => handleSubmit(e)} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded bg-background text-textprimary border border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded bg-background text-textprimary border border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <button
            type="submit"
            className={`w-full py-2 mt-2 rounded bg-primary hover:bg-secondary transition text-white font-semibold ${
              loading ? "flex justify-center items-center" : ""
            }`}
          >
            {loading ? (
              <LoaderCircle className="w-6 h-6 animate-spin" />
            ) : (
              "Log in"
            )}
          </button>
        </form>

        <p className="text-sm text-textsecondary text-center mt-4">
          Don't have an account?{" "}
          <button
            onClick={() => navigate("/register")}
            className="text-secondary hover:underline"
          >
            Register here
          </button>
        </p>
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

export default LoginPage;
