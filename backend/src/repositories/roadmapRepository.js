import { query, getEngine, getMemoryStore } from '../config/database.js';

export const roadmapRepository = {
  async create(studentId, assessmentId, title, items = []) {
    const numStudentId = parseInt(studentId, 10);
    const numAssessmentId = parseInt(assessmentId, 10);

    if (getEngine() === 'mysql') {
      const sqlRoadmap = 'INSERT INTO roadmaps (student_id, assessment_id, title, status) VALUES (?, ?, ?, ?)';
      const res = await query(sqlRoadmap, [numStudentId, numAssessmentId, title, 'active']);
      const roadmapId = res.insertId;

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        await query(`
          INSERT INTO roadmap_items (
            roadmap_id, skill_id, resource_id, practice_task_id, priority, status, estimated_duration, notes
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          roadmapId,
          parseInt(item.skill_id, 10),
          item.resource_id ? parseInt(item.resource_id, 10) : null,
          item.practice_task_id ? parseInt(item.practice_task_id, 10) : null,
          item.priority || (i + 1),
          item.status || 'not_started',
          item.estimated_duration || '2-4 hours',
          item.notes || ''
        ]);
      }

      return this.findById(roadmapId);
    }

    const store = getMemoryStore();
    const newId = store.roadmaps.length ? Math.max(...store.roadmaps.map(r => r.id)) + 1 : 1;
    const newRoadmap = {
      id: newId,
      student_id: numStudentId,
      assessment_id: numAssessmentId,
      title,
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    store.roadmaps.push(newRoadmap);

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const newItemId = store.roadmap_items.length ? Math.max(...store.roadmap_items.map(ri => ri.id)) + 1 : 1;
      store.roadmap_items.push({
        id: newItemId,
        roadmap_id: newId,
        skill_id: parseInt(item.skill_id, 10),
        resource_id: item.resource_id ? parseInt(item.resource_id, 10) : null,
        practice_task_id: item.practice_task_id ? parseInt(item.practice_task_id, 10) : null,
        priority: item.priority || (i + 1),
        status: item.status || 'not_started',
        estimated_duration: item.estimated_duration || '2-4 hours',
        completion_date: null,
        notes: item.notes || '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    }

    return this.findById(newId);
  },

  async getLatestByStudent(studentId) {
    const numId = parseInt(studentId, 10);
    if (getEngine() === 'mysql') {
      const rows = await query('SELECT * FROM roadmaps WHERE student_id = ? ORDER BY created_at DESC LIMIT 1', [numId]);
      if (!rows[0]) return null;
      return this.findById(rows[0].id);
    }

    const store = getMemoryStore();
    const studentRoadmaps = store.roadmaps
      .filter(r => r.student_id === numId)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    if (studentRoadmaps.length === 0) return null;
    return this.findById(studentRoadmaps[0].id);
  },

  async findById(id) {
    const numId = parseInt(id, 10);
    if (getEngine() === 'mysql') {
      const rows = await query(`
        SELECT r.*, a.career_role_id, cr.name as career_role_name
        FROM roadmaps r
        JOIN assessments a ON r.assessment_id = a.id
        JOIN career_roles cr ON a.career_role_id = cr.id
        WHERE r.id = ?
      `, [numId]);
      if (!rows[0]) return null;
      const roadmap = rows[0];
      roadmap.items = await this.getItems(roadmap.id);
      return roadmap;
    }

    const store = getMemoryStore();
    const roadmap = store.roadmaps.find(r => r.id === numId);
    if (!roadmap) return null;
    const assessment = store.assessments.find(a => a.id === roadmap.assessment_id);
    const role = assessment ? store.career_roles.find(cr => cr.id === assessment.career_role_id) : null;

    return {
      ...roadmap,
      career_role_id: assessment ? assessment.career_role_id : null,
      career_role_name: role ? role.name : 'Target Role',
      items: this.getItemsSync(roadmap.id, store)
    };
  },

  async findByStudent(studentId) {
    const numId = parseInt(studentId, 10);
    if (getEngine() === 'mysql') {
      const rows = await query(`
        SELECT r.*, a.career_role_id, cr.name as career_role_name
        FROM roadmaps r
        JOIN assessments a ON r.assessment_id = a.id
        JOIN career_roles cr ON a.career_role_id = cr.id
        WHERE r.student_id = ?
        ORDER BY r.created_at DESC
      `, [numId]);
      for (const rm of rows) {
        rm.items = await this.getItems(rm.id);
      }
      return rows;
    }

    const store = getMemoryStore();
    return store.roadmaps
      .filter(r => r.student_id === numId)
      .map(r => {
        const assessment = store.assessments.find(a => a.id === r.assessment_id);
        const role = assessment ? store.career_roles.find(cr => cr.id === assessment.career_role_id) : null;
        return {
          ...r,
          career_role_id: assessment ? assessment.career_role_id : null,
          career_role_name: role ? role.name : 'Target Role',
          items: this.getItemsSync(r.id, store)
        };
      })
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  },

  async getItems(roadmapId) {
    const numId = parseInt(roadmapId, 10);
    if (getEngine() === 'mysql') {
      const sql = `
        SELECT 
          ri.*,
          s.name as skill_name,
          s.category as skill_category,
          r.title as resource_title,
          r.type as resource_type,
          r.difficulty as resource_difficulty,
          r.file_path as resource_file_path,
          r.external_url as resource_external_url,
          pt.title as task_title,
          pt.description as task_description,
          pt.difficulty as task_difficulty,
          pt.estimated_duration as task_duration,
          pt.external_url as task_external_url
        FROM roadmap_items ri
        JOIN skills s ON ri.skill_id = s.id
        LEFT JOIN resources r ON ri.resource_id = r.id
        LEFT JOIN practice_tasks pt ON ri.practice_task_id = pt.id
        WHERE ri.roadmap_id = ?
        ORDER BY ri.priority ASC, ri.id ASC
      `;
      return await query(sql, [numId]);
    }
    const store = getMemoryStore();
    return this.getItemsSync(numId, store);
  },

  getItemsSync(roadmapId, store) {
    return store.roadmap_items
      .filter(ri => ri.roadmap_id === roadmapId)
      .map(ri => {
        const skill = store.skills.find(s => s.id === ri.skill_id);
        const resource = ri.resource_id ? store.resources.find(r => r.id === ri.resource_id) : null;
        const task = ri.practice_task_id ? store.practice_tasks.find(pt => pt.id === ri.practice_task_id) : null;

        return {
          ...ri,
          skill_name: skill ? skill.name : 'Skill',
          skill_category: skill ? skill.category : 'General',
          resource_title: resource ? resource.title : null,
          resource_type: resource ? resource.type : null,
          resource_difficulty: resource ? resource.difficulty : null,
          resource_file_path: resource ? resource.file_path : null,
          resource_external_url: resource ? resource.external_url : null,
          task_title: task ? task.title : null,
          task_description: task ? task.description : null,
          task_difficulty: task ? task.difficulty : null,
          task_duration: task ? task.estimated_duration : null,
          task_external_url: task ? task.external_url : null
        };
      })
      .sort((a, b) => a.priority - b.priority || a.id - b.id);
  },

  async getItemById(itemId) {
    const numId = parseInt(itemId, 10);
    if (getEngine() === 'mysql') {
      const rows = await query(`
        SELECT ri.*, r.student_id
        FROM roadmap_items ri
        JOIN roadmaps r ON ri.roadmap_id = r.id
        WHERE ri.id = ?
      `, [numId]);
      return rows[0] || null;
    }

    const store = getMemoryStore();
    const item = store.roadmap_items.find(ri => ri.id === numId);
    if (!item) return null;
    const roadmap = store.roadmaps.find(r => r.id === item.roadmap_id);
    return {
      ...item,
      student_id: roadmap ? roadmap.student_id : null
    };
  },

  async updateItemStatus(itemId, status, notes = null) {
    const numId = parseInt(itemId, 10);
    const validStatus = ['not_started', 'in_progress', 'completed'].includes(status) ? status : 'in_progress';
    const completionDate = validStatus === 'completed' ? new Date().toISOString().slice(0, 19).replace('T', ' ') : null;

    if (getEngine() === 'mysql') {
      let sql = 'UPDATE roadmap_items SET status = ?, completion_date = ?';
      const params = [validStatus, completionDate];

      if (notes !== null) {
        sql += ', notes = ?';
        params.push(notes);
      }
      sql += ' WHERE id = ?';
      params.push(numId);

      await query(sql, params);
      return this.getItemById(numId);
    }

    const store = getMemoryStore();
    const item = store.roadmap_items.find(ri => ri.id === numId);
    if (!item) return null;

    item.status = validStatus;
    item.completion_date = validStatus === 'completed' ? new Date().toISOString() : null;
    if (notes !== null) item.notes = notes;
    item.updated_at = new Date().toISOString();

    return item;
  },

  async getProgressStats(studentId) {
    const numId = parseInt(studentId, 10);
    if (getEngine() === 'mysql') {
      const sql = `
        SELECT 
          COUNT(ri.id) as total_activities,
          SUM(CASE WHEN ri.status = 'completed' THEN 1 ELSE 0 END) as completed_activities,
          SUM(CASE WHEN ri.status = 'in_progress' THEN 1 ELSE 0 END) as in_progress_activities,
          SUM(CASE WHEN ri.status = 'not_started' THEN 1 ELSE 0 END) as not_started_activities
        FROM roadmaps r
        JOIN roadmap_items ri ON r.id = ri.roadmap_id
        WHERE r.student_id = ?
      `;
      const rows = await query(sql, [numId]);
      const res = rows[0] || {};
      const total = parseInt(res.total_activities, 10) || 0;
      const completed = parseInt(res.completed_activities, 10) || 0;
      const in_progress = parseInt(res.in_progress_activities, 10) || 0;
      const not_started = parseInt(res.not_started_activities, 10) || 0;
      const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

      return { total, completed, in_progress, not_started, percentage };
    }

    const store = getMemoryStore();
    const studentRoadmapIds = new Set(store.roadmaps.filter(r => r.student_id === numId).map(r => r.id));
    const items = store.roadmap_items.filter(ri => studentRoadmapIds.has(ri.roadmap_id));

    const total = items.length;
    const completed = items.filter(ri => ri.status === 'completed').length;
    const in_progress = items.filter(ri => ri.status === 'in_progress').length;
    const not_started = items.filter(ri => ri.status === 'not_started').length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { total, completed, in_progress, not_started, percentage };
  }
};
