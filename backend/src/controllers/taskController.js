import { taskRepository } from '../repositories/taskRepository.js';

export const taskController = {
  async getAllTasks(req, res, next) {
    try {
      const onlyActive = req.query.all !== 'true';
      const tasks = await taskRepository.findAll(onlyActive);
      res.status(200).json({
        success: true,
        count: tasks.length,
        tasks
      });
    } catch (err) {
      next(err);
    }
  },

  async getTaskById(req, res, next) {
    try {
      const task = await taskRepository.findById(req.params.id);
      if (!task) {
        return res.status(404).json({ success: false, message: 'Practice task not found.' });
      }
      res.status(200).json({ success: true, task });
    } catch (err) {
      next(err);
    }
  },

  async createTask(req, res, next) {
    try {
      const { title, description, difficulty, learning_objective, estimated_duration, suggested_steps, external_url, is_active, skills } = req.body;

      if (!title || !description || !learning_objective) {
        return res.status(400).json({
          success: false,
          message: 'Title, description, and learning objective are required.'
        });
      }

      let skillIds = [];
      if (skills) {
        skillIds = Array.isArray(skills) ? skills : String(skills).split(',').map(s => s.trim());
      }

      const task = await taskRepository.create(
        { title, description, difficulty, learning_objective, estimated_duration, suggested_steps, external_url, is_active },
        skillIds
      );

      res.status(201).json({
        success: true,
        message: 'Practice task created successfully.',
        task
      });
    } catch (err) {
      next(err);
    }
  },

  async updateTask(req, res, next) {
    try {
      const { id } = req.params;
      const { title, description, difficulty, learning_objective, estimated_duration, suggested_steps, external_url, is_active, skills } = req.body;

      let skillIds = null;
      if (skills !== undefined) {
        skillIds = Array.isArray(skills) ? skills : String(skills).split(',').map(s => s.trim());
      }

      const updated = await taskRepository.update(
        id,
        { title, description, difficulty, learning_objective, estimated_duration, suggested_steps, external_url, is_active },
        skillIds
      );

      if (!updated) {
        return res.status(404).json({ success: false, message: 'Practice task not found.' });
      }

      res.status(200).json({
        success: true,
        message: 'Practice task updated successfully.',
        task: updated
      });
    } catch (err) {
      next(err);
    }
  }
};
