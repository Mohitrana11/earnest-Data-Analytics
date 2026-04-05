import { Response } from "express";
import catchAsyncError from "../middleware/catchAsync";
import sendResponse from "../utils/sendResponse";
import ErrorHandler from "../utils/errorHandler";
import prisma from "../config/db";
import redisClient from "../config/redis";

// CREATE TASK
export const createTask = catchAsyncError(async (req: any, res: Response) => {
  const { title, description, dueDate, priority } = req.body;

  if (!title) throw new ErrorHandler("Title is required", 400);

  const task = await prisma.task.create({
    data: {
      title,
      description,
      dueDate: dueDate ? new Date(dueDate) : null,
      priority: priority || "MEDIUM",
      userId: req.user.id,
    },
  });

  return sendResponse(res, 201, "Task created", { task });
});

// GET ALL TASKS (pagination + filter + search)
export const getTasks = catchAsyncError(async (req: any, res: Response) => {
  const { page = 1, limit = 5, status, search, priority } = req.query;

  const skip = (Number(page) - 1) * Number(limit);
  const userId = req.user.id;
  const cacheKey = `tasks:${userId}:${page}:${limit}:${status}:${search}:${priority}`;
  const cached = await redisClient.get(cacheKey);
  if (cached) {
    const { tasks } = JSON.parse(cached);
    return sendResponse(res, 200, "Tasks fetched", { tasks });
  }

  const tasks = await prisma.task.findMany({
    where: {
      userId: req.user.id,
      ...(status && { status }),
      ...(priority && { priority }),
      ...(search && {
        title: {
          contains: search as string,
        },
      }),
    },
    skip,
    take: Number(limit),
    orderBy: { createdAt: "desc" },
  });

  await redisClient.set(cacheKey, JSON.stringify({ tasks }), { EX: 60 });
  return sendResponse(res, 200, "Tasks fetched", { tasks });
});

// GET SINGLE TASK
export const getTaskById = catchAsyncError(async (req: any, res: Response) => {
  const { id } = req.params;
  const cacheKey = `task:${req.user.id}:${id}`;
  const cached = await redisClient.get(cacheKey);
  if (cached) {
    const { task } = JSON.parse(cached);
    return sendResponse(res, 200, "Task fetched", { task });
  }
  const task = await prisma.task.findFirst({
    where: { id, userId: req.user.id },
  });

  if (!task) throw new ErrorHandler("Task not found", 404);
  await redisClient.set(cacheKey, JSON.stringify({ task }), { EX: 60 });
  return sendResponse(res, 200, "Task fetched", { task });
});

// UPDATE TASK
export const updateTask = catchAsyncError(async (req: any, res: Response) => {
  const { id } = req.params;
  const { title, description, status, dueDate, priority } = req.body;

  const task = await prisma.task.findFirst({
    where: { id, userId: req.user.id },
  });

  if (!task) throw new ErrorHandler("Task not found", 404);
  await redisClient.del(`tasks:${req.user.id}`);
  await redisClient.del(`task:${req.user.id}:${id}`);

  const updatedTask = await prisma.task.update({
    where: { id },
    data: {
      title,
      description,
      status,
      dueDate: dueDate ? new Date(dueDate) : null,
      priority,
    },
  });

  return sendResponse(res, 200, "Task updated", { updatedTask });
});

// DELETE TASK
export const deleteTask = catchAsyncError(async (req: any, res: Response) => {
  const { id } = req.params;

  const task = await prisma.task.findFirst({
    where: { id, userId: req.user.id },
  });

  if (!task) throw new ErrorHandler("Task not found", 404);
  await redisClient.del(`tasks:${req.user.id}`);
  await redisClient.del(`task:${req.user.id}:${id}`);

  await prisma.task.delete({ where: { id } });

  return sendResponse(res, 200, "Task deleted");
});

// TOGGLE TASK STATUS
export const toggleTask = catchAsyncError(async (req: any, res: Response) => {
  const { id } = req.params;

  const task = await prisma.task.findFirst({
    where: { id, userId: req.user.id },
  });

  if (!task) throw new ErrorHandler("Task not found", 404);
  await redisClient.del(`tasks:${req.user.id}`);
  await redisClient.del(`task:${req.user.id}:${id}`);

  const updatedTask = await prisma.task.update({
    where: { id },
    data: {
      isCompleted: !task.isCompleted,
      status: task.isCompleted ? "PENDING" : "COMPLETED",
    },
  });

  return sendResponse(res, 200, "Task toggled", { updatedTask });
});
