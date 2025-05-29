// src/middleware/dbConnect.ts
import type { Request, Response, NextFunction } from "express";
import connectDB from "../configs/db";

export const dbConnectMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error("DB connection error:", err);
    res.status(500).json({ error: "Database connection failed" });
  }
};
