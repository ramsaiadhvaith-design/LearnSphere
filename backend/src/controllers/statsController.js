import { statsRepository } from '../repositories/statsRepository.js';

export const statsController = {
  async getDashboardStats(req, res, next) {
    try {
      const stats = await statsRepository.getPlatformStats();
      res.status(200).json({
        success: true,
        stats
      });
    } catch (err) {
      next(err);
    }
  }
};
