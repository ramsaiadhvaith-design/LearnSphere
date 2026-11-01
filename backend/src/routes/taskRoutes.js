import { Router } from 'express';
import { taskController } from '../controllers/taskController.js';
import { authenticateToken, authorizeRoles } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', authenticateToken, taskController.getAllTasks);
router.get('/:id', authenticateToken, taskController.getTaskById);

// Admin-only management
router.post('/', authenticateToken, authorizeRoles('admin'), taskController.createTask);
router.put('/:id', authenticateToken, authorizeRoles('admin'), taskController.updateTask);

export default router;
