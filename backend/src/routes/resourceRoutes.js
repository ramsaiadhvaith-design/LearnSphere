import { Router } from 'express';
import { resourceController } from '../controllers/resourceController.js';
import { authenticateToken, authorizeRoles } from '../middleware/authMiddleware.js';
import { uploadResourceFile } from '../middleware/uploadMiddleware.js';

const router = Router();

// Resource discovery and viewing (authenticated users)
router.get('/', authenticateToken, resourceController.getAllResources);
router.get('/:id', authenticateToken, resourceController.getResourceById);
router.get('/:id/download', authenticateToken, resourceController.downloadResource);

// Creation (Faculty and Admin only)
router.post(
  '/',
  authenticateToken,
  authorizeRoles('faculty', 'admin'),
  uploadResourceFile.single('file'),
  resourceController.createResource
);

// Updates and Archival (Owner or Admin)
router.put(
  '/:id',
  authenticateToken,
  authorizeRoles('faculty', 'admin'),
  uploadResourceFile.single('file'),
  resourceController.updateResource
);

router.delete(
  '/:id',
  authenticateToken,
  authorizeRoles('faculty', 'admin'),
  resourceController.archiveResource
);

export default router;
