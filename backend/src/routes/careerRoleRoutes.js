import { Router } from 'express';
import { careerRoleController } from '../controllers/careerRoleController.js';
import { authenticateToken, authorizeRoles } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', authenticateToken, careerRoleController.getAllRoles);
router.get('/:id', authenticateToken, careerRoleController.getRoleById);

// Admin-only management
router.post('/', authenticateToken, authorizeRoles('admin'), careerRoleController.createRole);
router.put('/:id', authenticateToken, authorizeRoles('admin'), careerRoleController.updateRole);
router.put('/:id/skills', authenticateToken, authorizeRoles('admin'), careerRoleController.configureRoleSkills);

export default router;
