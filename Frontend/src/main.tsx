// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import VideoProvider from "./contexts/VideoContext.tsx";
import UserProvider from "./contexts/UserContext.tsx";
import CommentProvider from "./contexts/CommentContext.tsx";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")!).render(
  // <StrictMode>
    <UserProvider>
      <VideoProvider>
        <CommentProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </CommentProvider>
      </VideoProvider>
    </UserProvider>
  // </StrictMode>
);
