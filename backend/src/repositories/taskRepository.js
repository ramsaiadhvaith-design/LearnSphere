import { query, getEngine, getMemoryStore } from '../config/database.js';

export const taskRepository = {
  async findAll(onlyActive = false) {
    if (getEngine() === 'mysql') {
      const sql = onlyActive
        ? 'SELECT * FROM practice_tasks WHERE is_active = 1 ORDER BY id ASC'
        : 'SELECT * FROM practice_tasks ORDER BY id ASC';
      const tasks = await query(sql);
      for (const t of tasks) {
        t.skills = await this.getTaskSkills(t.id);
      }
      return tasks;
    }

    const store = getMemoryStore();
    return store.practice_tasks
      .filter(t => (onlyActive ? t.is_active === 1 : true))
      .map(t => ({
        ...t,
        skills: this.getTaskSkillsSync(t.id, store)
      }));
  },

  async findById(id) {
    const numId = parseInt(id, 10);
    if (getEngine() === 'mysql') {
      const rows = await query('SELECT * FROM practice_tasks WHERE id = ?', [numId]);
      if (!rows[0]) return null;
      const task = rows[0];
      task.skills = await this.getTaskSkills(task.id);
      return task;
    }

    const store = getMemoryStore();
    const task = store.practice_tasks.find(t => t.id === numId);
    if (!task) return null;
    return {
      ...task,
      skills: this.getTaskSkillsSync(task.id, store)
    };
  },

  async getTaskSkills(taskId) {
    const numId = parseInt(taskId, 10);
    if (getEngine() === 'mysql') {
      const sql = `
        SELECT s.id, s.name, s.category
        FROM practice_task_skills pts
        JOIN skills s ON pts.skill_id = s.id
        WHERE pts.practice_task_id = ?
        ORDER BY s.name ASC
      `;
      return await query(sql, [numId]);
    }
    const store = getMemoryStore();
    return this.getTaskSkillsSync(numId, store);
  },

  getTaskSkillsSync(taskId, store) {
    const mappings = store.practice_task_skills.filter(m => m.practice_task_id === taskId);
    return mappings.map(m => {
      const s = store.skills.find(sk => sk.id === m.skill_id);
      return {
        id: m.skill_id,
        name: s ? s.name : 'Unknown Skill',
        category: s ? s.category : 'General'
      };
    });
  },

  async findBySkills(skillIds) {
    if (!skillIds || skillIds.length === 0) return [];
    const numSkillIds = skillIds.map(s => parseInt(s, 10));

    if (getEngine() === 'mysql') {
      const placeholders = numSkillIds.map(() => '?').join(',');
      const sql = `
        SELECT DISTINCT pt.*
        FROM practice_tasks pt
        JOIN practice_task_skills pts ON pt.id = pts.practice_task_id
        WHERE pts.skill_id IN (${placeholders}) AND pt.is_active = 1
        ORDER BY pt.id ASC
      `;
      const tasks = await query(sql, numSkillIds);
      for (const t of tasks) {
        t.skills = await this.getTaskSkills(t.id);
      }
      return tasks;
    }

    const store = getMemoryStore();
    const matchingTaskIds = new Set(
      store.practice_task_skills
        .filter(m => numSkillIds.includes(m.skill_id))
        .map(m => m.practice_task_id)
    );

    return store.practice_tasks
      .filter(t => matchingTaskIds.has(t.id) && t.is_active === 1)
      .map(t => ({
        ...t,
        skills: this.getTaskSkillsSync(t.id, store)
      }));
  },

  async create(taskData, skillIds = []) {
    const {
      title, description, difficulty = 'beginner', learning_objective,
      estimated_duration = '2-3 hours', suggested_steps = '', external_url = null, is_active = 1
    } = taskData;

    if (getEngine() === 'mysql') {
      const sql = `
        INSERT INTO practice_tasks (
          title, description, difficulty, learning_objective,
          estimated_duration, suggested_steps, external_url, is_active
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;
      const res = await query(sql, [
        title, description, difficulty, learning_objective,
        estimated_duration, suggested_steps, external_url, is_active ? 1 : 0
      ]);
      const taskId = res.insertId;

      for (const sId of skillIds) {
        await query('INSERT INTO practice_task_skills (practice_task_id, skill_id) VALUES (?, ?)', [taskId, parseInt(sId, 10)]);
      }
      return this.findById(taskId);
    }

    const store = getMemoryStore();
    const newId = store.practice_tasks.length ? Math.max(...store.practice_tasks.map(t => t.id)) + 1 : 1;
    const newTask = {
      id: newId,
      title,
      description,
      difficulty,
      learning_objective,
      estimated_duration,
      suggested_steps,
      external_url,
      is_active: is_active ? 1 : 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    store.practice_tasks.push(newTask);

    for (const sId of skillIds) {
      store.practice_task_skills.push({ practice_task_id: newId, skill_id: parseInt(sId, 10) });
    }

    return this.findById(newId);
  },

  async update(id, updates, skillIds = null) {
    const numId = parseInt(id, 10);
    if (getEngine() === 'mysql') {
      const allowed = ['title', 'description', 'difficulty', 'learning_objective', 'estimated_duration', 'suggested_steps', 'external_url', 'is_active'];
      const fields = [];
      const values = [];

      for (const k of allowed) {
        if (updates[k] !== undefined) {
          fields.push(`${k} = ?`);
          values.push(k === 'is_active' ? (updates[k] ? 1 : 0) : updates[k]);
        }
      }

      if (fields.length > 0) {
        values.push(numId);
        await query(`UPDATE practice_tasks SET ${fields.join(', ')} WHERE id = ?`, values);
      }

      if (skillIds !== null && Array.isArray(skillIds)) {
        await query('DELETE FROM practice_task_skills WHERE practice_task_id = ?', [numId]);
        for (const sId of skillIds) {
          await query('INSERT INTO practice_task_skills (practice_task_id, skill_id) VALUES (?, ?)', [numId, parseInt(sId, 10)]);
        }
      }

      return this.findById(numId);
    }

    const store = getMemoryStore();
    const task = store.practice_tasks.find(t => t.id === numId);
    if (!task) return null;

    Object.assign(task, updates, { updated_at: new Date().toISOString() });

    if (skillIds !== null && Array.isArray(skillIds)) {
      store.practice_task_skills = store.practice_task_skills.filter(m => m.practice_task_id !== numId);
      for (const sId of skillIds) {
        store.practice_task_skills.push({ practice_task_id: numId, skill_id: parseInt(sId, 10) });
      }
    }

    return this.findById(numId);
  }
};
