import { skillRepository } from '../repositories/skillRepository.js';

export const skillController = {
  async getAllSkills(req, res, next) {
    try {
      const onlyActive = req.query.all !== 'true';
      const skills = await skillRepository.findAll(onlyActive);
      res.status(200).json({
        success: true,
        count: skills.length,
        skills
      });
    } catch (err) {
      next(err);
    }
  },

  async getSkillById(req, res, next) {
    try {
      const skill = await skillRepository.findById(req.params.id);
      if (!skill) {
        return res.status(404).json({ success: false, message: 'Skill not found.' });
      }
      res.status(200).json({ success: true, skill });
    } catch (err) {
      next(err);
    }
  },

  async createSkill(req, res, next) {
    try {
      const { name, category, description, is_active } = req.body;
      if (!name || !name.trim()) {
        return res.status(400).json({ success: false, message: 'Skill name is required.' });
      }

      const skill = await skillRepository.create({ name, category, description, is_active });
      res.status(201).json({
        success: true,
        message: 'Skill created successfully.',
        skill
      });
    } catch (err) {
      next(err);
    }
  },

  async updateSkill(req, res, next) {
    try {
      const { id } = req.params;
      const { name, category, description, is_active } = req.body;

      const updated = await skillRepository.update(id, { name, category, description, is_active });
      if (!updated) {
        return res.status(404).json({ success: false, message: 'Skill not found.' });
      }

      res.status(200).json({
        success: true,
        message: 'Skill updated successfully.',
        skill: updated
      });
    } catch (err) {
      next(err);
    }
  }
};
