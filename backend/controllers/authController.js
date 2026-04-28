import authService from '../services/authService.js';
import { successResponse } from '../utils/response.js';

class AuthController {
  async register(req, res, next) {
    try {
      const data = await authService.register(req.body);
      successResponse(res, data, 'User registered successfully', 201);
    } catch (err) {
      next(err);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const data = await authService.login(email, password);
      successResponse(res, data, 'Login successful');
    } catch (err) {
      next(err);
    }
  }

  async getMe(req, res, next) {
    try {
      const data = await authService.getMe(req.user.id);
      successResponse(res, data);
    } catch (err) {
      next(err);
    }
  }
}

export default new AuthController();
