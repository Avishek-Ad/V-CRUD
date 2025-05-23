import { SearchIcon, Plus, LogIn, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { videoContext } from "../contexts/VideoContext";
import { userContext } from "../contexts/UserContext";

function NavBar() {
  const { user, logout } = useContext(userContext)!;
  const { searchVideos, setSearchQuery } = useContext(videoContext)!;
  const [query, setQuery] = useState(localStorage.getItem("query") || "");
  const navigate = useNavigate();

  const handleSubmit = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault();
    if (query) {
      localStorage.setItem("query", query);
      setSearchQuery(query);
      searchVideos(query, 1, true);
      navigate("/search");
    }
  };

  useEffect(() => {
    if (query) {
      setSearchQuery(query);
      searchVideos(query, 1, true);
    } else {
      window.location.href.includes("search") && navigate("/home");
    }
  }, []);

  return (
    <nav className="bg-background text-textprimary flex flex-wrap items-center justify-between px-6 py-4 shadow-sm sticky top-0 z-50">
      {/* Logo */}
      <h1
        className="text-primary text-2xl font-extrabold tracking-wide hover:cursor-pointer"
        onClick={() => navigate("/home")}
      >
        V-CRUD
      </h1>

      {/* Search */}
      <div className="w-full sm:w-auto mt-4 sm:mt-0 flex justify-center flex-grow sm:flex-grow-0">
        <div className="flex items-center bg-card border border-gray-600 rounded-full w-full pl-4 focus-within:ring-2 focus-within:ring-primary transition duration-300">
          <SearchIcon className="w-5 h-5 text-gray-400 mr-2 " />
          <input
            type="text"
            placeholder="Search videos..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-grow bg-transparent outline-none text-sm sm:w-72 md:w-96 px-1 py-2 text-textprimary placeholder-textsecondary"
          />
          <div
            className="flex items-center rounded-r-full px-4 py-2 bg-gray-600 hover:cursor-pointer"
            onClick={(e) => handleSubmit(e)}
          >
            <SearchIcon className="w-5 h-5 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-row items-center gap-3 mt-4 sm:mt-0">
        <button
          className="flex items-center gap-2 bg-primary hover:bg-secondary text-white px-4 py-2 rounded-full text-sm font-medium shadow-md transition duration-300"
          onClick={() => navigate("/upload")}
        >
          <Plus className="w-5 h-5" />
          <span>Upload</span>
        </button>

        {user ? (
          <div className="flex items-center gap-2">
            <img
              onClick={() => navigate("/profile")}
              title="Profile"
              src={user.avatar}
              alt={user.username}
              className="w-12 h-12 rounded-full cursor-pointer"
            />
            <button
              className="flex items-center gap-2 bg-primary hover:bg-secondary text-white px-4 py-2 rounded-full text-sm font-medium shadow-md transition duration-300"
              onClick={() => logout()}
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        ) : (
          <button
            className="flex items-center gap-2 bg-primary hover:bg-secondary text-white px-4 py-2 rounded-full text-sm font-medium shadow-md transition duration-300"
            onClick={() => navigate("/login")}
          >
            <LogIn className="w-5 h-5" />
            <span>Login</span>
          </button>
        )}
      </div>
    </nav>
  );
}

export default NavBar;
