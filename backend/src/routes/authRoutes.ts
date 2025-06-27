import express from 'express';
import {
  register,
  login,
  refresh,
  logout,
  me,
  forgotPassword,
} from '../controllers/authController.js'; // make sure you use `.js`

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.get('/me', me);
router.post('/forgot-password', forgotPassword);

export default router;
