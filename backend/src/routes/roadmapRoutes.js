import { Router } from 'express';
import { roadmapController } from '../controllers/roadmapController.js';
import { authenticateToken, authorizeRoles } from '../middleware/authMiddleware.js';

const router = Router();

// Student-only: generate, retrieve latest, and check progress
router.post('/generate', authenticateToken, authorizeRoles('student'), roadmapController.generateRoadmap);
router.get('/latest', authenticateToken, authorizeRoles('student'), roadmapController.getLatestRoadmap);
router.get('/stats', authenticateToken, authorizeRoles('student'), roadmapController.getProgressStats);

// Update activity status (Not Started, In Progress, Completed)
router.patch('/items/:id/progress', authenticateToken, authorizeRoles('student'), roadmapController.updateItemProgress);

// Get specific roadmap by ID (Owner or Admin)
router.get('/:id', authenticateToken, roadmapController.getRoadmapById);

export default router;
