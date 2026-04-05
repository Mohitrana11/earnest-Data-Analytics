import { Request, Response, NextFunction, RequestHandler } from "express";
const catchAsyncError = (
  func: (req: Request, res: Response, next: NextFunction) => Promise<any>,
): RequestHandler => {
  return (req, res, next) => {
    Promise.resolve(func(req, res, next)).catch(next);
  };
};

export default catchAsyncError;
