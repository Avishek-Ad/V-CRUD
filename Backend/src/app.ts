import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userAuth from "./routes/user.route";
import videoAuth from "./routes/video.route";
import commentAuth from "./routes/comment.route";
import dotenv from "dotenv";
dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:5173", "https://v-crud-client.vercel.app"], // frontend URL, NOT '*'
    credentials: true, // allow cookies to be sent
  })
);

app.use("/api/users", userAuth);
app.use("/api/videos", videoAuth);
app.use("/api/comments", commentAuth);

app.get("/", (req, res) => {
  res.send("Hello World changed");
});

export default app;
