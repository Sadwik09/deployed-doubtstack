import express from 'express';
import {
  createAnswer,
  updateAnswer,
  deleteAnswer,
  voteAnswer,
  acceptAnswer,
  verifyAnswer
} from '../controllers/answer.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';
import { upload } from '../middleware/upload.middleware.js';
import { createAnswerValidation, voteValidation } from '../middleware/validation.middleware.js';

const router = express.Router();

// Create answer for a doubt
router.post('/doubts/:doubtId', protect, upload.array('attachments', 3), createAnswerValidation, createAnswer);

// Answer operations
router.put('/:id', protect, updateAnswer);
router.delete('/:id', protect, deleteAnswer);
router.post('/:id/vote', protect, voteValidation, voteAnswer);
router.post('/:id/accept', protect, acceptAnswer);
router.post('/:id/verify', protect, authorize('faculty', 'admin'), verifyAnswer);

export default router;
