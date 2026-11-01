import { Router } from 'express';
import { skillController } from '../controllers/skillController.js';
import { authenticateToken, authorizeRoles } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', authenticateToken, skillController.getAllSkills);
router.get('/:id', authenticateToken, skillController.getSkillById);

// Admin-only management
router.post('/', authenticateToken, authorizeRoles('admin'), skillController.createSkill);
router.put('/:id', authenticateToken, authorizeRoles('admin'), skillController.updateSkill);

export default router;
