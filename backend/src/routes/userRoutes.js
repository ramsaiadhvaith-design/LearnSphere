import { Router } from 'express';
import { userController } from '../controllers/userController.js';
import { authenticateToken, authorizeRoles } from '../middleware/authMiddleware.js';

const router = Router();

// Profile self-update (authenticated user)
router.put('/profile', authenticateToken, userController.updateProfile);

// Admin-only user management routes
router.get('/', authenticateToken, authorizeRoles('admin'), userController.getAllUsers);
router.post('/', authenticateToken, authorizeRoles('admin'), userController.createUser);
router.patch('/:id', authenticateToken, authorizeRoles('admin'), userController.updateUser);
router.get('/:id', authenticateToken, userController.getUserById);

export default router;
