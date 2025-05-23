import { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { userContext } from "../contexts/UserContext";
import { LoaderCircle, User } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";

function RegisterPage() {
  const { loading, error, register } = useContext(userContext)!;
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    avatar: null as File | null,
  });
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormError("");
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setForm((prev) => ({
      ...prev,
      avatar: file,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setFormError("Passwords do not match");
      return;
    }
    if (!form.avatar) {
      setFormError("Please select an avatar");
      return;
    }
    console.log("Form submitted", form);

    register(form.username, form.email, form.password, form.avatar!);
  };

  return (
    <div className="min-h-screen bg-background text-textprimary flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md bg-card p-8 rounded-xl shadow-xl"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">
          Create an Account
        </h2>

        {formError && (
          <div className="bg-error text-white p-2 mb-4 rounded text-sm text-center">
            {formError}
          </div>
        )}

        <form onSubmit={(e) => handleSubmit(e)} className="space-y-4">
          <div className="relative flex justify-center items-center space-x-4 my-4">
            {form.avatar ? (
              <img
                src={URL.createObjectURL(form.avatar)}
                alt="avatar"
                className="w-32 h-32 rounded-full object-cover border border-gray-700"
              />
            ) : (
              <User className="w-32 h-32 rounded-full object-cover border border-gray-700" />
            )}

            <input
              title="Upload Avatar"
              type="file"
              name="avatar"
              onChange={handleFileChange}
              required
              placeholder="Upload Avatar"
              className="absolute top-0 left-0 z-10 opacity-0 w-64 md:w-96 px-4 py-13 rounded bg-background text-textprimary border border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Username</label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded bg-background text-textprimary border border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

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

          <div>
            <label className="block mb-1 text-sm font-medium">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
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
              "Register"
            )}
          </button>
        </form>

        <p className="text-sm text-textsecondary text-center mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-secondary hover:underline">
            Login here
          </a>
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

export default RegisterPage;
