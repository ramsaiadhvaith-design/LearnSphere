import { authService } from '../services/authService.js';
import { userRepository } from '../repositories/userRepository.js';

export const authController = {
  async register(req, res, next) {
    try {
      const { name, email, password } = req.body;
      const result = await authService.registerStudent({ name, email, password });
      res.status(201).json({
        success: true,
        message: 'Registration successful! Welcome to LearnSphere.',
        ...result
      });
    } catch (err) {
      next(err);
    }
  },

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const result = await authService.login({ email, password });
      res.status(200).json({
        success: true,
        message: 'Login successful.',
        ...result
      });
    } catch (err) {
      next(err);
    }
  },

  async getMe(req, res, next) {
    try {
      const user = await userRepository.findById(req.user.id);
      res.status(200).json({
        success: true,
        user
      });
    } catch (err) {
      next(err);
    }
  }
};
