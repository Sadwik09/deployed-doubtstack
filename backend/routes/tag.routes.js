import express from 'express';
import { getTags, suggestTags, createTag } from '../controllers/tag.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', getTags);
router.get('/suggest', suggestTags);
router.post('/', protect, authorize('admin'), createTag);

export default router;
