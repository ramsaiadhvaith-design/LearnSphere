import { Router } from 'express';
import { statsController } from '../controllers/statsController.js';
import { authenticateToken, authorizeRoles } from '../middleware/authMiddleware.js';

const router = Router();

// Admin-only dashboard platform statistics
router.get('/', authenticateToken, authorizeRoles('admin'), statsController.getDashboardStats);

export default router;
