import express from "express";
import {
  register,
  login,
  logout,
  refreshToken,
  getProfile,
} from "../controllers/user.controller";
import { protectRoute } from "../middlewares/authMiddleware";
import { avatarUpload } from "../middlewares/upload";

const router = express.Router();

router.post("/register", avatarUpload.single("avatar"), register);
router.post("/login", login);
router.post("/logout", protectRoute, logout);
router.post("/refresh-token", refreshToken);
router.get("/profile", protectRoute, getProfile);

export default router;
