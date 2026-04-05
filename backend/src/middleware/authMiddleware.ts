// middleware/authMiddleware.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import prisma from "../config/db";
import ErrorHandler from "../utils/errorHandler";

export const isAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return next(new ErrorHandler("Please login first", 401));
    }

    const decoded: any = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET as string,
    );

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    (req as any).user = user;

    next();
  } catch (error) {
    return next(new ErrorHandler("Invalid token", 401));
  }
};
