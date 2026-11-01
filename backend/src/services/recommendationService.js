import { resourceRepository } from '../repositories/resourceRepository.js';
import { taskRepository } from '../repositories/taskRepository.js';
import { PROFICIENCY_LEVELS } from './skillGapService.js';

export const recommendationService = {
  /**
   * Generates integrated recommendations for skills that have an identified gap.
   * Connects the SkillBridge subsystem directly with the Academic Resource Library.
   */
  async getRecommendationsForGapSkills(gapSkills = []) {
    if (!gapSkills || gapSkills.length === 0) {
      return {
        recommendations: [],
        message: 'All assessed skills meet or exceed target proficiency levels! No urgent skill gaps detected.'
      };
    }

    const skillIds = gapSkills.map(s => parseInt(s.skill_id, 10));
    const allResources = await resourceRepository.findForSkills(skillIds);
    const allTasks = await taskRepository.findBySkills(skillIds);

    const recommendations = [];

    for (const skill of gapSkills) {
      const sId = parseInt(skill.skill_id, 10);
      const currentLevel = skill.current_proficiency;
      const targetLevel = skill.target_proficiency;
      const gap = skill.skill_gap;
      const gapPercentage = skill.gap_percentage;

      // Filter resources mapped to this skill
      const matchingResources = allResources.filter(r => 
        r.skills && r.skills.some(sk => sk.id === sId)
      );

      // Rank resources deterministically based on learner current level
      // Beginner level 1-2 -> beginner resources first
      // Level 3 -> intermediate first
      // Level 4-5 -> advanced first
      const preferredDifficulty = currentLevel <= 2 ? 'beginner' : currentLevel === 3 ? 'intermediate' : 'advanced';

      const rankedResources = matchingResources.sort((a, b) => {
        const aScore = a.difficulty === preferredDifficulty ? 2 : 1;
        const bScore = b.difficulty === preferredDifficulty ? 2 : 1;
        if (bScore !== aScore) return bScore - aScore;
        return new Date(b.created_at) - new Date(a.created_at);
      });

      // Filter tasks mapped to this skill
      const matchingTasks = allTasks.filter(t =>
        t.skills && t.skills.some(sk => sk.id === sId)
      );

      const rankedTasks = matchingTasks.sort((a, b) => {
        const aScore = a.difficulty === preferredDifficulty ? 2 : 1;
        const bScore = b.difficulty === preferredDifficulty ? 2 : 1;
        if (bScore !== aScore) return bScore - aScore;
        return a.id - b.id;
      });

      const explanation = `Recommended to close your ${gapPercentage}% gap in ${skill.skill_name} (Current: ${PROFICIENCY_LEVELS[currentLevel]}, Target: ${PROFICIENCY_LEVELS[targetLevel]}).`;

      recommendations.push({
        skill_id: sId,
        skill_name: skill.skill_name,
        skill_category: skill.skill_category,
        current_proficiency: currentLevel,
        target_proficiency: targetLevel,
        skill_gap: gap,
        gap_percentage: gapPercentage,
        explanation,
        preferred_difficulty: preferredDifficulty,
        has_resources: rankedResources.length > 0,
        resources: rankedResources,
        primary_resource: rankedResources[0] || null,
        has_tasks: rankedTasks.length > 0,
        tasks: rankedTasks,
        primary_task: rankedTasks[0] || null,
        status_note: rankedResources.length === 0 
          ? 'No matching learning resource is available for this skill yet. Try searching the resource library or contact your faculty member.'
          : null
      });
    }

    // Sort skills by largest gap first
    recommendations.sort((a, b) => b.skill_gap - a.skill_gap || b.gap_percentage - a.gap_percentage);

    return {
      total_gap_skills: recommendations.length,
      recommendations
    };
  }
};
