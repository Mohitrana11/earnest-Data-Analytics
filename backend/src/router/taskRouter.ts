import express from "express";
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  toggleTask,
} from "../controller/taskController";
import { isAuthenticated } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/", isAuthenticated, createTask);
router.get("/", isAuthenticated, getTasks);
router.get("/:id", isAuthenticated, getTaskById);
router.patch("/:id", isAuthenticated, updateTask);
router.delete("/:id", isAuthenticated, deleteTask);
router.patch("/:id/toggle", isAuthenticated, toggleTask);

export default router;
