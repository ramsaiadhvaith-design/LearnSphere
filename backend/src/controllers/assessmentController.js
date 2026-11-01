import { skillGapService } from '../services/skillGapService.js';
import { assessmentRepository } from '../repositories/assessmentRepository.js';
import { recommendationService } from '../services/recommendationService.js';
import { roadmapService } from '../services/roadmapService.js';

export const assessmentController = {
  async submitAssessment(req, res, next) {
    try {
      const { career_role_id, ratings, notes, auto_generate_roadmap } = req.body;

      if (!career_role_id) {
        return res.status(400).json({ success: false, message: 'Career role ID is required.' });
      }

      if (!ratings || (typeof ratings !== 'object' && !Array.isArray(ratings))) {
        return res.status(400).json({ success: false, message: 'Skill proficiency ratings are required.' });
      }

      const result = await skillGapService.evaluateAndSaveAssessment(
        req.user.id,
        career_role_id,
        ratings,
        notes || ''
      );

      // Find recommendations for gap skills
      const gapSkills = result.skill_results.filter(s => s.skill_gap > 0);
      const recommendations = await recommendationService.getRecommendationsForGapSkills(gapSkills);

      // Optional auto generation of initial roadmap
      let roadmap = null;
      if (auto_generate_roadmap !== false) {
        try {
          roadmap = await roadmapService.generateFromAssessment(req.user.id, result.assessment.id);
        } catch (rmErr) {
          console.warn('[Roadmap Auto-Gen Warning]:', rmErr.message);
        }
      }

      res.status(201).json({
        success: true,
        message: 'Skill gap assessment completed successfully.',
        assessment: result.assessment,
        summary: result.summary,
        skill_results: result.skill_results,
        recommendations: recommendations.recommendations,
        roadmap
      });
    } catch (err) {
      next(err);
    }
  },

  async getMyAssessments(req, res, next) {
    try {
      const assessments = await assessmentRepository.findByStudent(req.user.id);
      res.status(200).json({
        success: true,
        count: assessments.length,
        assessments
      });
    } catch (err) {
      next(err);
    }
  },

  async getAssessmentById(req, res, next) {
    try {
      const { id } = req.params;
      const assessment = await assessmentRepository.findById(id);
      if (!assessment) {
        return res.status(404).json({ success: false, message: 'Assessment record not found.' });
      }

      // Authorization check: Only owner or admin
      if (req.user.role !== 'admin' && assessment.student_id !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'Access denied: You are only authorized to view your own assessments.'
        });
      }

      // Attach recommendations for gap skills
      const gapSkills = (assessment.skill_results || []).filter(s => s.skill_gap > 0);
      const recommendations = await recommendationService.getRecommendationsForGapSkills(gapSkills);

      res.status(200).json({
        success: true,
        assessment,
        recommendations: recommendations.recommendations
      });
    } catch (err) {
      next(err);
    }
  }
};
