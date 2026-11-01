import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { resourceRepository } from '../repositories/resourceRepository.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.resolve(__dirname, '../../uploads');

export const resourceController = {
  async getAllResources(req, res, next) {
    try {
      const { search, subject, unit, topic, type, skillId, difficulty, status, uploaderId } = req.query;

      // Students can only see active resources
      const resolvedStatus = req.user.role === 'student' ? 'active' : (status || 'all');

      const resources = await resourceRepository.findAll({
        search,
        subject,
        unit,
        topic,
        type,
        skillId,
        difficulty,
        status: resolvedStatus,
        uploaderId
      });

      res.status(200).json({
        success: true,
        count: resources.length,
        resources
      });
    } catch (err) {
      next(err);
    }
  },

  async getResourceById(req, res, next) {
    try {
      const resource = await resourceRepository.findById(req.params.id);
      if (!resource) {
        return res.status(404).json({ success: false, message: 'Resource not found.' });
      }

      // If resource is archived and user is student, deny access
      if (resource.status === 'archived' && req.user.role === 'student') {
        return res.status(404).json({ success: false, message: 'This academic resource has been archived.' });
      }

      res.status(200).json({ success: true, resource });
    } catch (err) {
      next(err);
    }
  },

  async createResource(req, res, next) {
    try {
      const {
        title, description, subject, unit, topic, type, difficulty = 'beginner',
        external_url, version = '1.0', skills
      } = req.body;

      if (!title || !subject || !unit || !topic || !type) {
        return res.status(400).json({
          success: false,
          message: 'Title, subject, unit, topic, and resource type are required.'
        });
      }

      let file_path = null;
      let file_name = null;
      let file_size = null;
      let mime_type = null;

      if (req.file) {
        file_path = req.file.filename;
        file_name = req.file.originalname;
        file_size = req.file.size;
        mime_type = req.file.mimetype;
      }

      let skillIds = [];
      if (skills) {
        skillIds = Array.isArray(skills) ? skills : String(skills).split(',').map(s => s.trim());
      }

      const resource = await resourceRepository.create(
        {
          title: title.trim(),
          description: (description || '').trim(),
          subject: subject.trim(),
          unit: unit.trim(),
          topic: topic.trim(),
          type,
          difficulty,
          uploader_id: req.user.id,
          file_path,
          file_name,
          file_size,
          mime_type,
          external_url: external_url ? external_url.trim() : null,
          version: version || '1.0',
          status: 'active'
        },
        skillIds
      );

      res.status(201).json({
        success: true,
        message: 'Academic resource published successfully.',
        resource
      });
    } catch (err) {
      next(err);
    }
  },

  async updateResource(req, res, next) {
    try {
      const { id } = req.params;
      const existing = await resourceRepository.findById(id);
      if (!existing) {
        return res.status(404).json({ success: false, message: 'Resource not found.' });
      }

      // Check authorization: Owner or Admin
      if (req.user.role !== 'admin' && existing.uploader_id !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'Access denied: You are only authorized to edit your own resources.'
        });
      }

      const {
        title, description, subject, unit, topic, type, difficulty,
        external_url, version, status, skills
      } = req.body;

      const updates = {};
      if (title !== undefined) updates.title = title.trim();
      if (description !== undefined) updates.description = description.trim();
      if (subject !== undefined) updates.subject = subject.trim();
      if (unit !== undefined) updates.unit = unit.trim();
      if (topic !== undefined) updates.topic = topic.trim();
      if (type !== undefined) updates.type = type;
      if (difficulty !== undefined) updates.difficulty = difficulty;
      if (external_url !== undefined) updates.external_url = external_url ? external_url.trim() : null;
      if (version !== undefined) updates.version = version;
      if (status !== undefined) updates.status = status;

      // Handle file replacement if uploaded
      if (req.file) {
        updates.file_path = req.file.filename;
        updates.file_name = req.file.originalname;
        updates.file_size = req.file.size;
        updates.mime_type = req.file.mimetype;
      }

      let skillIds = null;
      if (skills !== undefined) {
        skillIds = Array.isArray(skills) ? skills : String(skills).split(',').map(s => s.trim());
      }

      const updated = await resourceRepository.update(id, updates, skillIds);

      res.status(200).json({
        success: true,
        message: 'Resource updated successfully.',
        resource: updated
      });
    } catch (err) {
      next(err);
    }
  },

  async archiveResource(req, res, next) {
    try {
      const { id } = req.params;
      const existing = await resourceRepository.findById(id);
      if (!existing) {
        return res.status(404).json({ success: false, message: 'Resource not found.' });
      }

      // Check authorization: Owner or Admin
      if (req.user.role !== 'admin' && existing.uploader_id !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'Access denied: You are only authorized to archive your own resources.'
        });
      }

      const archived = await resourceRepository.archive(id);
      res.status(200).json({
        success: true,
        message: 'Resource archived successfully.',
        resource: archived
      });
    } catch (err) {
      next(err);
    }
  },

  async downloadResource(req, res, next) {
    try {
      const { id } = req.params;
      const resource = await resourceRepository.findById(id);
      if (!resource) {
        return res.status(404).json({ success: false, message: 'Resource not found.' });
      }

      if (resource.status === 'archived' && req.user.role === 'student') {
        return res.status(403).json({ success: false, message: 'Archived resources cannot be downloaded.' });
      }

      // If resource only has external link
      if (!resource.file_path) {
        if (resource.external_url) {
          return res.redirect(resource.external_url);
        }
        return res.status(404).json({ success: false, message: 'No file attachment exists for this resource.' });
      }

      // Path traversal prevention: strip any directory components
      const safeFilename = path.basename(resource.file_path);
      const fullPath = path.join(uploadDir, safeFilename);

      if (!fs.existsSync(fullPath)) {
        return res.status(404).json({
          success: false,
          message: 'The physical file for this resource could not be found on the server.'
        });
      }

      res.download(fullPath, resource.file_name || safeFilename);
    } catch (err) {
      next(err);
    }
  }
};
