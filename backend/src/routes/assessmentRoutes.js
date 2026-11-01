import { Router } from 'express';
import { assessmentController } from '../controllers/assessmentController.js';
import { authenticateToken, authorizeRoles } from '../middleware/authMiddleware.js';

const router = Router();

// Student-only: submit assessment
router.post('/', authenticateToken, authorizeRoles('student'), assessmentController.submitAssessment);

// Student: view own assessment history
router.get('/my', authenticateToken, authorizeRoles('student'), assessmentController.getMyAssessments);

// View specific assessment (Owner or Admin)
router.get('/:id', authenticateToken, assessmentController.getAssessmentById);

export default router;
