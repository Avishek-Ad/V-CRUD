import { Request, Response } from "express";
import { Types } from "mongoose";
import User from "../models/User";
import jwt, { JwtPayload } from "jsonwebtoken";
import radis from "../configs/radis";
import dotenv from "dotenv";
dotenv.config();

const generateTokens = (userId: Types.ObjectId) => {
  const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: "15m",
  });

  const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET!, {
    expiresIn: "7d",
  });
  return { accessToken, refreshToken };
};

const storeRefreshToken = async (
  userId: Types.ObjectId,
  refreshToken: string
) => {
  await radis.set(
    `refresh_token:${userId}`,
    refreshToken,
    "EX",
    7 * 24 * 60 * 60
  );
};

const setCookie = (
  res: Response,
  accessToken: string,
  refreshToken: string
) => {
  res.cookie("accessToken", accessToken, {
    httpOnly: true, //prevents xss attacks
    secure: process.env.NODE_ENV === "production",
    sameSite: "none", // prevents csrf attacks
    maxAge: 15 * 60 * 1000, // 15 minutes
  });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true, //prevents xss attacks
    secure: process.env.NODE_ENV === "production",
    sameSite: "none", // prevents csrf attacks
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7days
  });
};

const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password } = req.body;

    const imageUrl = req.file?.path;
    const publicId = req.file?.filename;

    if (!imageUrl || !publicId) {
      res.status(400).json({ message: "Image not uploaded" });
      return;
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400).json({ message: "User already exists" });
      return;
    }
    const user = await User.create({
      username,
      email,
      password,
      avatar: imageUrl,
    });

    //authentication
    const { accessToken, refreshToken } = generateTokens(user._id);
    await storeRefreshToken(user._id, refreshToken);
    setCookie(res, accessToken, refreshToken);

    res.status(201).json({
      success: true,
      message: "User created successfully",
    });
    return;
  } catch (error) {
    console.log("Error in register", error);
    res.status(500).json({ message: error });
    return;
  }
};

const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ message: "User does not exist" });
      return;
    }
    const isMatch = await (user as any).comparePassword(password);
    if (!isMatch) {
      res.status(400).json({ message: "Invalid (password) credentials" });
      return;
    }

    //authentication
    const { accessToken, refreshToken } = generateTokens(user._id);
    await storeRefreshToken(user._id, refreshToken);
    setCookie(res, accessToken, refreshToken);

    res.status(200).json({
      success: true,
      message: "Login successful",
    });
    return;
  } catch (error) {
    console.log("Error in login", error);
    res.status(500).json({ message: error });
    return;
  }
};

const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
      const decoded = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET!
      );
      if (typeof decoded === "object" && "userId" in decoded) {
        radis.del(`refresh_token:${decoded.userId}`);
      } else {
        // Handle the case where decoded is not an object with a userId property
        throw new Error("Invalid refresh token");
      }
    }

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.json({ success: true, message: "Logout successful" });
    return;
  } catch (error) {
    res.status(500).json({ message: error });
    return;
  }
};

const refreshToken = async (req: Request, res: Response): Promise<void> => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      res.status(401).json({ message: "No refresh token Provided" });
      return;
    }

    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET!
    ) as JwtPayload;
    const storedToken = await radis.get(`refresh_token:${decoded.userId}`);

    if (refreshToken !== storedToken) {
      res.status(401).json({ message: "Invalid refresh token" });
      return;
    }
    const accessToken = jwt.sign(
      { userId: decoded.userId },
      process.env.ACCESS_TOKEN_SECRET!,
      {
        expiresIn: "15m",
      }
    );

    res.cookie("accessToken", accessToken, {
      httpOnly: true, //prevents xss attacks
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict", // prevents csrf attacks
      maxAge: 15 * 60 * 1000, // 15 minutes
    });
    res.json({ success: true, message: "Access token refreshed" });
    return;
  } catch (error) {
    console.log("Error in Refresh ", error);
    res.status(500).json({ message: "Server error", error: error });
    return;
  }
};

const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    res.json({ success: true, user: (req as any).user });
    return;
  } catch (error) {
    console.log("Error in getProfile controller", error);
    res.status(500).json({ message: "Server error", error: error });
    return;
  }
};

export { register, login, logout, refreshToken, getProfile };
