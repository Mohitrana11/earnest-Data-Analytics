import { Response } from "express";

type SendResponseData = Record<string, any>;

const sendResponse = (
  res: Response,
  statusCode: number = 200,
  message: string = "Success",
  data: SendResponseData = {},
): Response => {
  return res.status(statusCode).json({
    success: statusCode < 400,
    message,
    ...data,
  });
};

export default sendResponse;
