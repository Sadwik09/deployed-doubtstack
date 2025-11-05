import express from "express";
import {
  deleteNotification,
  getNotifications,
  markAllAsRead,
  markAsRead,
} from "../controllers/notification.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// All routes are protected
router.use(protect);

// Routes
router.get("/", getNotifications);
router.put("/:id/read", markAsRead);
router.put("/read-all", markAllAsRead);
router.delete("/:id", deleteNotification);

export default router;
