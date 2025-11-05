import express from "express";
import {
  createDoubt,
  deleteDoubt,
  followDoubt,
  getDoubtById,
  getDoubts,
  resolveDoubt,
  updateDoubt,
  voteDoubt,
} from "../controllers/doubt.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import {
  createDoubtValidation,
  updateDoubtValidation,
  voteValidation,
} from "../middleware/validation.middleware.js";

const router = express.Router();

// Public routes
router.get("/", getDoubts);
router.get("/:id", getDoubtById);

// Protected routes
router.post("/", protect, createDoubtValidation, createDoubt);
router.put("/:id", protect, updateDoubtValidation, updateDoubt);
router.delete("/:id", protect, deleteDoubt);
router.put("/:id/resolve", protect, resolveDoubt);
router.post("/:id/vote", protect, voteValidation, voteDoubt);
router.post("/:id/follow", protect, followDoubt);

export default router;
