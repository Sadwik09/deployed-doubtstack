import express from 'express';
import { getLeaderboard, getPlatformStats } from '../controllers/leaderboard.controller.js';

const router = express.Router();

router.get('/', getLeaderboard);
router.get('/stats', getPlatformStats);

export default router;
