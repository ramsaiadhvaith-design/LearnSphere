import { careerRoleRepository } from '../repositories/careerRoleRepository.js';
import { assessmentRepository } from '../repositories/assessmentRepository.js';

export const PROFICIENCY_LEVELS = {
  1: 'Beginner',
  2: 'Basic understanding',
  3: 'Intermediate',
  4: 'Advanced',
  5: 'Highly proficient'
};

export const skillGapService = {
  /**
   * Transparent mathematical rule engine for skill-gap analysis.
   * Formula:
   *   Skill Gap = max(Target Proficiency − Current Proficiency, 0)
   *   Gap Percentage = (Skill Gap / Target Proficiency) * 100
   */
  calculateSkillGap(currentProficiency, targetProficiency) {
    const current = Math.min(Math.max(parseInt(currentProficiency, 10) || 1, 1), 5);
    const target = Math.min(Math.max(parseInt(targetProficiency, 10) || 1, 1), 5);

    const skillGap = Math.max(target - current, 0);
    const gapPercentage = target > 0 ? parseFloat(((skillGap / target) * 100).toFixed(2)) : 0;

    return {
      currentProficiency: current,
      targetProficiency: target,
      skillGap,
      gapPercentage,
      meetsTarget: skillGap === 0,
      currentLabel: PROFICIENCY_LEVELS[current] || 'Unknown',
      targetLabel: PROFICIENCY_LEVELS[target] || 'Unknown'
    };
  },

  async evaluateAndSaveAssessment(studentId, careerRoleId, submittedRatings, notes = '') {
    const role = await careerRoleRepository.findById(careerRoleId);
    if (!role) {
      throw { status: 404, message: 'Selected career role not found.' };
    }

    if (!role.skills || role.skills.length === 0) {
      throw { status: 400, message: 'The selected career role has no configured required skills.' };
    }

    // Map submitted ratings by skill_id
    const ratingsMap = new Map();
    if (Array.isArray(submittedRatings)) {
      submittedRatings.forEach(r => ratingsMap.set(parseInt(r.skill_id, 10), parseInt(r.rating, 10)));
    } else if (typeof submittedRatings === 'object' && submittedRatings !== null) {
      Object.entries(submittedRatings).forEach(([sId, rating]) => ratingsMap.set(parseInt(sId, 10), parseInt(rating, 10)));
    }

    const skillResults = [];
    let totalGapSum = 0;
    let meetingTargetCount = 0;

    for (const requiredSkill of role.skills) {
      const sId = parseInt(requiredSkill.skill_id, 10);
      const userRating = ratingsMap.has(sId) ? ratingsMap.get(sId) : 1; // Default to Beginner (1) if unrated
      const target = requiredSkill.required_proficiency;

      const calc = this.calculateSkillGap(userRating, target);

      if (calc.meetsTarget) {
        meetingTargetCount++;
      }
      totalGapSum += calc.skillGap;

      skillResults.push({
        skill_id: sId,
        skill_name: requiredSkill.skill_name,
        skill_category: requiredSkill.skill_category,
        current_proficiency: calc.currentProficiency,
        target_proficiency: calc.targetProficiency,
        skill_gap: calc.skillGap,
        gap_percentage: calc.gapPercentage,
        current_label: calc.currentLabel,
        target_label: calc.targetLabel,
        meets_target: calc.meetsTarget,
        rationale: requiredSkill.rationale
      });
    }

    const totalSkills = role.skills.length;
    const averageGap = parseFloat((totalGapSum / totalSkills).toFixed(2));

    // Persist assessment with historical snapshot
    const savedAssessment = await assessmentRepository.create(
      studentId,
      careerRoleId,
      {
        total_skills: totalSkills,
        skills_meeting_target: meetingTargetCount,
        average_gap: averageGap,
        notes
      },
      skillResults
    );

    return {
      assessment: savedAssessment,
      summary: {
        total_skills: totalSkills,
        skills_meeting_target: meetingTargetCount,
        skills_needing_improvement: totalSkills - meetingTargetCount,
        average_gap: averageGap,
        overall_readiness_percentage: Math.round((meetingTargetCount / totalSkills) * 100)
      },
      skill_results: skillResults
    };
  }
};
