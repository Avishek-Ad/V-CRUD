import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";

const protectRoute = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const accessToken = req.cookies.accessToken;
    if (!accessToken) {
      res.status(401).json({ message: "Unauthorized - No access token found" });
      return;
    }
    try {
      const decode = jwt.verify(
        accessToken,
        process.env.ACCESS_TOKEN_SECRET!
      ) as jwt.JwtPayload;
      const user = await User.findById(decode?.userId);
      if (!user) {
        res.status(401).json({ message: "Unauthorized - User not found" });
        return;
      }
      (req as any).user = user;
      next();
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        res
          .status(401)
          .json({ message: "Unauthorized - Access token expired" });
        return;
      }
      throw error;
    }
  } catch (error) {
    console.log("Error in protectRoute middleware", error);
    res.status(500).json({ message: "Internal Server Error" });
    return;
  }
};

const adminRoute = (req: Request, res: Response, next: NextFunction) => {
  if ((req as any).user && (req as any).user.isAdmin) {
    next();
  } else {
    res.status(401).json({ message: "Unauthorized - Admin access required" });
    return;
  }
};

export { protectRoute, adminRoute };
