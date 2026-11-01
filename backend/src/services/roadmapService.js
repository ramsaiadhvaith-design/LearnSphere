import { roadmapRepository } from '../repositories/roadmapRepository.js';
import { assessmentRepository } from '../repositories/assessmentRepository.js';
import { recommendationService } from './recommendationService.js';

export const roadmapService = {
  /**
   * Generates a sequenced, personalized learning roadmap from an assessment.
   */
  async generateFromAssessment(studentId, assessmentId) {
    const assessment = await assessmentRepository.findById(assessmentId);
    if (!assessment) {
      throw { status: 404, message: 'Assessment not found.' };
    }

    if (assessment.student_id !== parseInt(studentId, 10)) {
      throw { status: 403, message: 'Access denied: You can only generate roadmaps for your own assessments.' };
    }

    // Filter skills with gap > 0
    const gapSkills = (assessment.skill_results || []).filter(r => r.skill_gap > 0);

    // If student has 0 gaps, create an enrichment item or empty roadmap
    if (gapSkills.length === 0) {
      const title = `${assessment.career_role_name} Proficiency Roadmap (Target Achieved)`;
      return await roadmapRepository.create(studentId, assessmentId, title, []);
    }

    // Get recommendations for gap skills
    const { recommendations } = await recommendationService.getRecommendationsForGapSkills(gapSkills);

    // Build sequenced roadmap items
    // Priority order: Higher skill gap comes first
    const roadmapItems = [];

    recommendations.forEach((rec, index) => {
      const priority = index + 1;
      const resource = rec.primary_resource;
      const task = rec.primary_task;

      // Estimate duration based on gap size
      const durationHours = rec.skill_gap * 3 + 2; // e.g. gap 1 -> ~5 hrs, gap 2 -> ~8 hrs
      const estimated_duration = `${durationHours}-${durationHours + 3} hours`;

      roadmapItems.push({
        skill_id: rec.skill_id,
        resource_id: resource ? resource.id : null,
        practice_task_id: task ? task.id : null,
        priority,
        status: index === 0 ? 'in_progress' : 'not_started', // First item automatically in progress
        estimated_duration,
        notes: `Focus on closing ${rec.gap_percentage}% gap in ${rec.skill_name}.`
      });
    });

    const title = `${assessment.career_role_name} Personalized Learning Roadmap`;
    const newRoadmap = await roadmapRepository.create(studentId, assessmentId, title, roadmapItems);

    return newRoadmap;
  },

  async getLatestStudentRoadmap(studentId) {
    return await roadmapRepository.getLatestByStudent(studentId);
  },

  async updateItemStatus(studentId, itemId, status, notes = null) {
    const item = await roadmapRepository.getItemById(itemId);
    if (!item) {
      throw { status: 404, message: 'Roadmap activity item not found.' };
    }

    if (item.student_id !== parseInt(studentId, 10)) {
      throw { status: 403, message: 'Access denied: You can only update your own roadmap activities.' };
    }

    const updated = await roadmapRepository.updateItemStatus(itemId, status, notes);
    return updated;
  },

  async getStudentProgress(studentId) {
    return await roadmapRepository.getProgressStats(studentId);
  }
};
