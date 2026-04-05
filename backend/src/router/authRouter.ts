import express from "express";
import { authLimiter } from "../middleware/rateLimiter";
import { register, login, refresh, logout } from "../controller/authController";
const router = express.Router();

router.post("/register", authLimiter, register);
router.post("/login", authLimiter, login);
router.post("/refresh", refresh);
router.post("/logout", logout);

export default router;
