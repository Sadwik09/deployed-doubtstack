import express from 'express';
import {
  getUserProfile,
  updateUserProfile,
  getUserDoubts,
  getUserAnswers
} from '../controllers/user.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/:id', getUserProfile);
router.put('/:id', protect, updateUserProfile);
router.get('/:id/doubts', getUserDoubts);
router.get('/:id/answers', getUserAnswers);

export default router;
