import express from 'express';
import { register, login, getMe, updatePassword } from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { registerValidation, loginValidation } from '../middleware/validation.middleware.js';

const router = express.Router();

router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.get('/me', protect, getMe);
router.put('/updatepassword', protect, updatePassword);

export default router;
