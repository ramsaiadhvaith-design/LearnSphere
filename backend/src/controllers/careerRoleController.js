import { careerRoleRepository } from '../repositories/careerRoleRepository.js';

export const careerRoleController = {
  async getAllRoles(req, res, next) {
    try {
      const onlyActive = req.query.all !== 'true';
      const roles = await careerRoleRepository.findAll(onlyActive);
      res.status(200).json({
        success: true,
        count: roles.length,
        roles
      });
    } catch (err) {
      next(err);
    }
  },

  async getRoleById(req, res, next) {
    try {
      const role = await careerRoleRepository.findById(req.params.id);
      if (!role) {
        return res.status(404).json({ success: false, message: 'Career role not found.' });
      }
      res.status(200).json({ success: true, role });
    } catch (err) {
      next(err);
    }
  },

  async createRole(req, res, next) {
    try {
      const { name, description, is_active, skills } = req.body;
      if (!name || !name.trim()) {
        return res.status(400).json({ success: false, message: 'Role name is required.' });
      }

      const role = await careerRoleRepository.create({ name, description, is_active, skills });
      res.status(201).json({
        success: true,
        message: 'Career role created successfully.',
        role
      });
    } catch (err) {
      next(err);
    }
  },

  async updateRole(req, res, next) {
    try {
      const { id } = req.params;
      const { name, description, is_active, skills } = req.body;

      const updated = await careerRoleRepository.update(id, { name, description, is_active }, skills);
      if (!updated) {
        return res.status(404).json({ success: false, message: 'Career role not found.' });
      }

      res.status(200).json({
        success: true,
        message: 'Career role updated successfully.',
        role: updated
      });
    } catch (err) {
      next(err);
    }
  },

  async configureRoleSkills(req, res, next) {
    try {
      const { id } = req.params;
      const { skills } = req.body;

      if (!Array.isArray(skills)) {
        return res.status(400).json({ success: false, message: 'Skills must be an array of { skill_id, required_proficiency, rationale }.' });
      }

      await careerRoleRepository.setRoleSkills(id, skills);
      const updated = await careerRoleRepository.findById(id);

      res.status(200).json({
        success: true,
        message: 'Career role skill requirements configured successfully.',
        role: updated
      });
    } catch (err) {
      next(err);
    }
  }
};
