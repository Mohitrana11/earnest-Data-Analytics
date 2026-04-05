import express from "express";
import dotenv from "dotenv";
dotenv.config();
import bodyParser from "body-parser";
import cors from "cors";
import { connectRedis } from "./config/redis";
connectRedis(); // connect to redis

// middleware :
import { apiLimiter } from "./middleware/rateLimiter";
import errorMiddleware from "./middleware/error";
import authRoutes from "./router/authRouter";
import taskRoutes from "./router/taskRouter";

const app = express();
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
); // enable CORS
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/api", apiLimiter); // apply rate limiter to all API routes

// routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

app.use(errorMiddleware); // error handling middleware
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
