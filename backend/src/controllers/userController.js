import { userRepository } from '../repositories/userRepository.js';
import { authService } from '../services/authService.js';

export const userController = {
  async getAllUsers(req, res, next) {
    try {
      const users = await userRepository.findAll();
      res.status(200).json({
        success: true,
        count: users.length,
        users
      });
    } catch (err) {
      next(err);
    }
  },

  async getUserById(req, res, next) {
    try {
      const { id } = req.params;
      // Allow user to view their own profile or Admin to view any
      if (req.user.role !== 'admin' && req.user.id !== parseInt(id, 10)) {
        return res.status(403).json({
          success: false,
          message: 'Access denied: You can only view your own profile.'
        });
      }

      const user = await userRepository.findById(id);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found.' });
      }

      res.status(200).json({ success: true, user });
    } catch (err) {
      next(err);
    }
  },

  async createUser(req, res, next) {
    try {
      const { name, email, password, role } = req.body;
      const user = await authService.createPrivilegedUser({ name, email, password, role });
      res.status(201).json({
        success: true,
        message: `User created successfully with role '${role}'.`,
        user
      });
    } catch (err) {
      next(err);
    }
  },

  async updateUser(req, res, next) {
    try {
      const { id } = req.params;
      const { role, status, name } = req.body;

      // Prevent Admin from deactivating themselves or changing their own role to prevent lockout
      if (req.user.id === parseInt(id, 10) && (status === 'inactive' || (role && role !== 'admin'))) {
        return res.status(400).json({
          success: false,
          message: 'Self-lockout prevented: You cannot deactivate or revoke your own Admin role.'
        });
      }

      const updated = await userRepository.update(id, { role, status, name });
      if (!updated) {
        return res.status(404).json({ success: false, message: 'User not found.' });
      }

      res.status(200).json({
        success: true,
        message: 'User account updated successfully.',
        user: updated
      });
    } catch (err) {
      next(err);
    }
  },

  async updateProfile(req, res, next) {
    try {
      const { name } = req.body;
      if (!name || !name.trim()) {
        return res.status(400).json({ success: false, message: 'Name is required.' });
      }

      const updated = await userRepository.update(req.user.id, { name: name.trim() });
      res.status(200).json({
        success: true,
        message: 'Profile updated successfully.',
        user: updated
      });
    } catch (err) {
      next(err);
    }
  }
};
