import { Request, Response, NextFunction, RequestHandler } from "express";
import ErrorHandler from "../utils/errorHandler";

const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let statusCode = 500;
  let message = "Internal Server Error";

  if (err instanceof ErrorHandler) {
    statusCode = err.status;
    message = err.message;
  } else if (err instanceof Error) {
    message = err.message;
  }

  if (err.message == "CastError") {
    err.message = "Invalid ID";
  }
  res.status(statusCode).json({
    success: false,
    message,
  });
};

export default errorMiddleware;
