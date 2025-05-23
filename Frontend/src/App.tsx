import { Routes, Route, Navigate } from "react-router-dom";
import MainPageLayout from "./layouts/MainPageLayout";
import WatchVideoPageLayout from "./layouts/WatchVideoPageLayout";
import WatchVideoPage from "./pages/WatchVideoPage";
import MainPage from "./pages/MainPage";
import UploadPage from "./pages/UploadPage";
import NotFound from "./pages/NotFound";
import LandingPage from "./pages/LandingPage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";

import { useContext, useEffect } from "react";
import { userContext } from "./contexts/UserContext";
import ProfilePageLayout from "./layouts/ProfilePageLayout";
import ProfilePage from "./pages/ProfilePage";
import SearchResultPageLayout from "./layouts/SearchResultPageLayout";
import SearchResultPage from "./pages/SearchResultPage";
import { LoaderCircle } from "lucide-react";

function App() {
  const { getuser, user, loading } = useContext(userContext)!;

  useEffect(() => {
    getuser();
    // console.log(user);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-background">
        <LoaderCircle className="animate-spin w-10 h-10 text-primary" />
      </div>
    );
  }
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      {/* MainPage layout route */}
      <Route path="/home" element={<MainPageLayout />}>
        <Route index element={<MainPage />} />{" "}
        {/* "index" for default child route */}
      </Route>

      {/* ProfilePage layout route */}
      <Route
        path="/profile"
        element={user ? <ProfilePageLayout /> : <Navigate to={"/home"} />}
      >
        <Route index element={<ProfilePage />} />{" "}
        {/* "index" for default child route */}
      </Route>

      {/* SearchPage layout route */}
      <Route path="/search" element={<SearchResultPageLayout />}>
        <Route index element={<SearchResultPage />} />{" "}
        {/* "index" for default child route */}
      </Route>

      {/* Watch Video layout route */}
      <Route path="/watch" element={<WatchVideoPageLayout />}>
        <Route path=":id" element={<WatchVideoPage />} />
      </Route>

      {/* User routes */}
      <Route
        path="/register"
        element={user ? <Navigate to={"/home"} /> : <RegisterPage />}
      />
      <Route
        path="/login"
        element={user ? <Navigate to={"/home"} /> : <LoginPage />}
      />

      {/* Upload route */}
      <Route
        path="/upload"
        element={user ? <UploadPage /> : <Navigate to={"/login"} />}
      />

      {/* Catch-all route for Not Found */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
