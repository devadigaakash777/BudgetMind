// auth.routes.ts
import express from 'express';
import {
  register,
  verifyEmail,
  login,
  refresh,
  logout,
  me,
  forgotPassword,
  resetPassword,
} from '../controllers/authController.js';

const router = express.Router();

router.post('/register', register);
router.get('/verify-email/:token', verifyEmail); 
router.post('/login', login);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.get('/me', me);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword); 

export default router;
