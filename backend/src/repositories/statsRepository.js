import { query, getEngine, getMemoryStore } from '../config/database.js';

export const statsRepository = {
  async getPlatformStats() {
    if (getEngine() === 'mysql') {
      const [u] = await query(`
        SELECT 
          COUNT(*) as total_users,
          SUM(CASE WHEN role = 'student' THEN 1 ELSE 0 END) as students,
          SUM(CASE WHEN role = 'faculty' THEN 1 ELSE 0 END) as faculty,
          SUM(CASE WHEN role = 'admin' THEN 1 ELSE 0 END) as admins
        FROM users
      `);
      const [r] = await query('SELECT COUNT(*) as total_resources, SUM(CASE WHEN status = "active" THEN 1 ELSE 0 END) as active_resources FROM resources');
      const [cr] = await query('SELECT COUNT(*) as total_roles FROM career_roles WHERE is_active = 1');
      const [s] = await query('SELECT COUNT(*) as total_skills FROM skills WHERE is_active = 1');
      const [a] = await query('SELECT COUNT(*) as total_assessments FROM assessments');
      const [ri] = await query(`
        SELECT 
          COUNT(*) as total_activities,
          SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_activities
        FROM roadmap_items
      `);

      return {
        total_users: parseInt(u.total_users, 10) || 0,
        students: parseInt(u.students, 10) || 0,
        faculty: parseInt(u.faculty, 10) || 0,
        admins: parseInt(u.admins, 10) || 0,
        total_resources: parseInt(r.total_resources, 10) || 0,
        active_resources: parseInt(r.active_resources, 10) || 0,
        total_career_roles: parseInt(cr.total_roles, 10) || 0,
        total_skills: parseInt(s.total_skills, 10) || 0,
        total_assessments: parseInt(a.total_assessments, 10) || 0,
        total_activities: parseInt(ri.total_activities, 10) || 0,
        completed_activities: parseInt(ri.completed_activities, 10) || 0
      };
    }

    const store = getMemoryStore();
    return {
      total_users: store.users.length,
      students: store.users.filter(u => u.role === 'student').length,
      faculty: store.users.filter(u => u.role === 'faculty').length,
      admins: store.users.filter(u => u.role === 'admin').length,
      total_resources: store.resources.length,
      active_resources: store.resources.filter(r => r.status === 'active').length,
      total_career_roles: store.career_roles.filter(cr => cr.is_active === 1).length,
      total_skills: store.skills.filter(s => s.is_active === 1).length,
      total_assessments: store.assessments.length,
      total_activities: store.roadmap_items.length,
      completed_activities: store.roadmap_items.filter(ri => ri.status === 'completed').length
    };
  }
};
