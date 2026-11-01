import { roadmapService } from '../services/roadmapService.js';
import { roadmapRepository } from '../repositories/roadmapRepository.js';

export const roadmapController = {
  async generateRoadmap(req, res, next) {
    try {
      const { assessment_id } = req.body;
      if (!assessment_id) {
        return res.status(400).json({ success: false, message: 'Assessment ID is required.' });
      }

      const roadmap = await roadmapService.generateFromAssessment(req.user.id, assessment_id);
      res.status(201).json({
        success: true,
        message: 'Personalized learning roadmap generated successfully.',
        roadmap
      });
    } catch (err) {
      next(err);
    }
  },

  async getLatestRoadmap(req, res, next) {
    try {
      const roadmap = await roadmapService.getLatestStudentRoadmap(req.user.id);
      if (!roadmap) {
        return res.status(200).json({
          success: true,
          roadmap: null,
          message: 'No learning roadmap found. Complete a skill assessment to generate your personalized roadmap.'
        });
      }

      const stats = await roadmapService.getStudentProgress(req.user.id);

      res.status(200).json({
        success: true,
        roadmap,
        progress: stats
      });
    } catch (err) {
      next(err);
    }
  },

  async getRoadmapById(req, res, next) {
    try {
      const { id } = req.params;
      const roadmap = await roadmapRepository.findById(id);
      if (!roadmap) {
        return res.status(404).json({ success: false, message: 'Roadmap not found.' });
      }

      // Check ownership
      if (req.user.role !== 'admin' && roadmap.student_id !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'Access denied: You can only view your own learning roadmap.'
        });
      }

      res.status(200).json({ success: true, roadmap });
    } catch (err) {
      next(err);
    }
  },

  async updateItemProgress(req, res, next) {
    try {
      const { id } = req.params; // roadmap item id
      const { status, notes } = req.body;

      if (!status || !['not_started', 'in_progress', 'completed'].includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Valid status ('not_started', 'in_progress', 'completed') is required."
        });
      }

      const updated = await roadmapService.updateItemStatus(req.user.id, id, status, notes);
      const stats = await roadmapService.getStudentProgress(req.user.id);

      res.status(200).json({
        success: true,
        message: `Activity marked as '${status}'.`,
        item: updated,
        progress: stats
      });
    } catch (err) {
      next(err);
    }
  },

  async getProgressStats(req, res, next) {
    try {
      const stats = await roadmapService.getStudentProgress(req.user.id);
      res.status(200).json({
        success: true,
        progress: stats
      });
    } catch (err) {
      next(err);
    }
  }
};
