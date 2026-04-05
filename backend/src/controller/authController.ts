import { Request, Response } from "express";
import * as authService from "../services/authService";
import catchAsyncError from "../middleware/catchAsync";
import sendResponse from "../utils/sendResponse";
import ErrorHandler from "../utils/errorHandler";

// REGISTER
export const register = catchAsyncError(async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    throw new ErrorHandler("All fields are required", 400);
  }

  const user = await authService.registerUser(username, email, password);

  return sendResponse(res, 201, "User registered successfully", {
    user,
  });
});

//  LOGIN
export const login = catchAsyncError(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ErrorHandler("Email and password are required", 400);
  }

  const data = await authService.loginUser(email, password);

  return sendResponse(res, 200, "Login successful", data);
});

//  REFRESH TOKEN
export const refresh = catchAsyncError(async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    throw new ErrorHandler("Refresh token is required", 400);
  }

  const data = await authService.refreshAccessToken(refreshToken);

  return sendResponse(res, 200, "Token refreshed", data);
});

//  LOGOUT
export const logout = catchAsyncError(async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    throw new ErrorHandler("Refresh token is required", 400);
  }

  await authService.logoutUser(refreshToken);

  return sendResponse(res, 200, "Logged out successfully");
});
