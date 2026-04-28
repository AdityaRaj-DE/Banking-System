import express from 'express';
import authController from '../controllers/authController.js';
import { authenticateToken } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';

const router = express.Router();

const registerSchema = {
  name: { required: true },
  email: { required: true, pattern: /^\S+@\S+\.\S+$/ },
  password: { required: true, min: 6 }
};

const loginSchema = {
  email: { required: true },
  password: { required: true }
};

router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.get('/me', authenticateToken, authController.getMe);

export default router;
