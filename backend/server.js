import compression from "compression";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import { createServer } from "http";
import morgan from "morgan";
import { Server } from "socket.io";

// Load environment variables
dotenv.config();

// Import database connection
import { connectDB } from "./config/database.js";

// Import middleware
import { errorHandler } from "./middleware/errorHandler.js";

// Connect to database
connectDB();

const app = express();

// Create HTTP server and Socket.io instance
// For Vercel, we need to handle Socket.io differently
const isVercel = !!process.env.VERCEL;

// Only create server and io if not on Vercel
let server, io, connectedUsers;

if (!isVercel) {
  server = createServer(app);
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:5173",
      methods: ["GET", "POST"],
    },
  });

  // Store connected users
  connectedUsers = new Map();

  // Socket.io connection handling
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // Register user
    socket.on("register", (userId) => {
      connectedUsers.set(userId, socket.id);
      console.log(`User ${userId} registered with socket ${socket.id}`);
    });

    // Handle disconnect
    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
      // Remove user from connected users map
      for (let [userId, socketId] of connectedUsers) {
        if (socketId === socket.id) {
          connectedUsers.delete(userId);
          break;
        }
      }
    });
  });

  // Make io available to other modules
  app.set("io", io);
  app.set("connectedUsers", connectedUsers);
}

// Middleware
app.use(cors());
app.use(helmet());
app.use(compression()); // Compress responses
app.use(morgan("dev")); // Logging
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true }));

// Static files for uploads
app.use("/uploads", express.static("uploads"));

// API Routes
import answerRoutes from "./routes/answer.routes.js";
import authRoutes from "./routes/auth.routes.js";
import doubtRoutes from "./routes/doubt.routes.js";
import leaderboardRoutes from "./routes/leaderboard.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import tagRoutes from "./routes/tag.routes.js";
import userRoutes from "./routes/user.routes.js";

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/doubts", doubtRoutes);
app.use("/api/answers", answerRoutes);
app.use("/api/tags", tagRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/notifications", notificationRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "DoubtStack API is running",
    timestamp: new Date().toISOString(),
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    status: "error",
    message: "Route not found",
  });
});

// Error handling middleware
app.use(errorHandler);

// Only listen if not on Vercel
if (!isVercel) {
  const PORT = process.env.PORT || 5000;

  server.listen(PORT, () => {
    console.log(
      `🚀 Server running on port ${PORT} in ${process.env.NODE_ENV} mode`
    );
  });

  // Handle unhandled promise rejections
  process.on("unhandledRejection", (err) => {
    console.log("❌ Unhandled Rejection:", err.message);
    server.close(() => process.exit(1));
  });
}

export default app;
