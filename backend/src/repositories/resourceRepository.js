import { query, getEngine, getMemoryStore } from '../config/database.js';

export const resourceRepository = {
  async findAll({ search = '', subject = '', unit = '', topic = '', type = '', skillId = null, difficulty = '', status = 'active', uploaderId = null } = {}) {
    if (getEngine() === 'mysql') {
      let sql = `
        SELECT 
          r.*,
          u.name as uploader_name,
          u.email as uploader_email
        FROM resources r
        JOIN users u ON r.uploader_id = u.id
      `;
      const where = [];
      const params = [];

      if (status && status !== 'all') {
        where.push('r.status = ?');
        params.push(status);
      }
      if (uploaderId) {
        where.push('r.uploader_id = ?');
        params.push(parseInt(uploaderId, 10));
      }
      if (subject) {
        where.push('LOWER(r.subject) = LOWER(?)');
        params.push(subject.trim());
      }
      if (unit) {
        where.push('LOWER(r.unit) = LOWER(?)');
        params.push(unit.trim());
      }
      if (topic) {
        where.push('LOWER(r.topic) LIKE LOWER(?)');
        params.push(`%${topic.trim()}%`);
      }
      if (type) {
        where.push('r.type = ?');
        params.push(type);
      }
      if (difficulty) {
        where.push('r.difficulty = ?');
        params.push(difficulty);
      }
      if (skillId) {
        where.push('EXISTS (SELECT 1 FROM resource_skills rs WHERE rs.resource_id = r.id AND rs.skill_id = ?)');
        params.push(parseInt(skillId, 10));
      }
      if (search) {
        where.push('(LOWER(r.title) LIKE LOWER(?) OR LOWER(r.description) LIKE LOWER(?) OR LOWER(r.topic) LIKE LOWER(?))');
        const s = `%${search.trim()}%`;
        params.push(s, s, s);
      }

      if (where.length > 0) {
        sql += ` WHERE ${where.join(' AND ')}`;
      }
      sql += ' ORDER BY r.created_at DESC';

      const resources = await query(sql, params);
      for (const res of resources) {
        res.skills = await this.getSkillMappings(res.id);
      }
      return resources;
    }

    // In-memory filter implementation
    const store = getMemoryStore();
    return store.resources
      .filter(r => {
        if (status && status !== 'all' && r.status !== status) return false;
        if (uploaderId && r.uploader_id !== parseInt(uploaderId, 10)) return false;
        if (subject && r.subject.toLowerCase() !== subject.toLowerCase()) return false;
        if (unit && r.unit.toLowerCase() !== unit.toLowerCase()) return false;
        if (topic && !r.topic.toLowerCase().includes(topic.toLowerCase())) return false;
        if (type && r.type !== type) return false;
        if (difficulty && r.difficulty !== difficulty) return false;
        if (skillId) {
          const hasSkill = store.resource_skills.some(rs => rs.resource_id === r.id && rs.skill_id === parseInt(skillId, 10));
          if (!hasSkill) return false;
        }
        if (search) {
          const q = search.toLowerCase();
          const matches = r.title.toLowerCase().includes(q) ||
            r.description.toLowerCase().includes(q) ||
            r.topic.toLowerCase().includes(q) ||
            r.subject.toLowerCase().includes(q);
          if (!matches) return false;
        }
        return true;
      })
      .map(r => {
        const uploader = store.users.find(u => u.id === r.uploader_id);
        return {
          ...r,
          uploader_name: uploader ? uploader.name : 'Faculty Member',
          uploader_email: uploader ? uploader.email : '',
          skills: this.getSkillMappingsSync(r.id, store)
        };
      })
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  },

  async findById(id) {
    const numId = parseInt(id, 10);
    if (getEngine() === 'mysql') {
      const sql = `
        SELECT 
          r.*,
          u.name as uploader_name,
          u.email as uploader_email
        FROM resources r
        JOIN users u ON r.uploader_id = u.id
        WHERE r.id = ?
      `;
      const rows = await query(sql, [numId]);
      if (!rows[0]) return null;
      const res = rows[0];
      res.skills = await this.getSkillMappings(res.id);
      return res;
    }
    const store = getMemoryStore();
    const res = store.resources.find(r => r.id === numId);
    if (!res) return null;
    const uploader = store.users.find(u => u.id === res.uploader_id);
    return {
      ...res,
      uploader_name: uploader ? uploader.name : 'Faculty Member',
      uploader_email: uploader ? uploader.email : '',
      skills: this.getSkillMappingsSync(res.id, store)
    };
  },

  async getSkillMappings(resourceId) {
    const numId = parseInt(resourceId, 10);
    if (getEngine() === 'mysql') {
      const sql = `
        SELECT s.id, s.name, s.category
        FROM resource_skills rs
        JOIN skills s ON rs.skill_id = s.id
        WHERE rs.resource_id = ?
        ORDER BY s.name ASC
      `;
      return await query(sql, [numId]);
    }
    const store = getMemoryStore();
    return this.getSkillMappingsSync(numId, store);
  },

  getSkillMappingsSync(resourceId, store) {
    const mappings = store.resource_skills.filter(m => m.resource_id === resourceId);
    return mappings.map(m => {
      const s = store.skills.find(sk => sk.id === m.skill_id);
      return {
        id: m.skill_id,
        name: s ? s.name : 'Unknown Skill',
        category: s ? s.category : 'General'
      };
    });
  },

  async create(resourceData, skillIds = []) {
    const {
      title, description, subject, unit, topic, type, difficulty = 'beginner',
      uploader_id, file_path = null, file_name = null, file_size = null,
      mime_type = null, external_url = null, version = '1.0', status = 'active'
    } = resourceData;

    if (getEngine() === 'mysql') {
      const sql = `
        INSERT INTO resources (
          title, description, subject, unit, topic, type, difficulty,
          uploader_id, file_path, file_name, file_size, mime_type,
          external_url, version, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      const res = await query(sql, [
        title, description, subject, unit, topic, type, difficulty,
        uploader_id, file_path, file_name, file_size, mime_type,
        external_url, version, status
      ]);
      const resourceId = res.insertId;

      for (const sId of skillIds) {
        await query('INSERT INTO resource_skills (resource_id, skill_id) VALUES (?, ?)', [resourceId, parseInt(sId, 10)]);
      }
      return this.findById(resourceId);
    }

    const store = getMemoryStore();
    const newId = store.resources.length ? Math.max(...store.resources.map(r => r.id)) + 1 : 1;
    const newRes = {
      id: newId,
      title,
      description,
      subject,
      unit,
      topic,
      type,
      difficulty,
      uploader_id,
      file_path,
      file_name,
      file_size,
      mime_type,
      external_url,
      version,
      status,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    store.resources.push(newRes);

    for (const sId of skillIds) {
      store.resource_skills.push({ resource_id: newId, skill_id: parseInt(sId, 10) });
    }

    return this.findById(newId);
  },

  async update(id, updates, skillIds = null) {
    const numId = parseInt(id, 10);
    if (getEngine() === 'mysql') {
      const allowed = ['title', 'description', 'subject', 'unit', 'topic', 'type', 'difficulty', 'file_path', 'file_name', 'file_size', 'mime_type', 'external_url', 'version', 'status'];
      const fields = [];
      const values = [];

      for (const k of allowed) {
        if (updates[k] !== undefined) {
          fields.push(`${k} = ?`);
          values.push(updates[k]);
        }
      }

      if (fields.length > 0) {
        values.push(numId);
        await query(`UPDATE resources SET ${fields.join(', ')} WHERE id = ?`, values);
      }

      if (skillIds !== null && Array.isArray(skillIds)) {
        await query('DELETE FROM resource_skills WHERE resource_id = ?', [numId]);
        for (const sId of skillIds) {
          await query('INSERT INTO resource_skills (resource_id, skill_id) VALUES (?, ?)', [numId, parseInt(sId, 10)]);
        }
      }

      return this.findById(numId);
    }

    const store = getMemoryStore();
    const res = store.resources.find(r => r.id === numId);
    if (!res) return null;

    Object.assign(res, updates, { updated_at: new Date().toISOString() });

    if (skillIds !== null && Array.isArray(skillIds)) {
      store.resource_skills = store.resource_skills.filter(m => m.resource_id !== numId);
      for (const sId of skillIds) {
        store.resource_skills.push({ resource_id: numId, skill_id: parseInt(sId, 10) });
      }
    }

    return this.findById(numId);
  },

  async archive(id) {
    return this.update(id, { status: 'archived' });
  },

  async delete(id) {
    const numId = parseInt(id, 10);
    if (getEngine() === 'mysql') {
      await query('DELETE FROM resources WHERE id = ?', [numId]);
      return true;
    }
    const store = getMemoryStore();
    store.resources = store.resources.filter(r => r.id !== numId);
    store.resource_skills = store.resource_skills.filter(m => m.resource_id !== numId);
    return true;
  },

  async findForSkills(skillIds) {
    if (!skillIds || skillIds.length === 0) return [];
    const numSkillIds = skillIds.map(s => parseInt(s, 10));

    if (getEngine() === 'mysql') {
      const placeholders = numSkillIds.map(() => '?').join(',');
      const sql = `
        SELECT DISTINCT r.*, u.name as uploader_name
        FROM resources r
        JOIN resource_skills rs ON r.id = rs.resource_id
        JOIN users u ON r.uploader_id = u.id
        WHERE rs.skill_id IN (${placeholders}) AND r.status = 'active'
        ORDER BY r.created_at DESC
      `;
      const resources = await query(sql, numSkillIds);
      for (const res of resources) {
        res.skills = await this.getSkillMappings(res.id);
      }
      return resources;
    }

    const store = getMemoryStore();
    const matchingResourceIds = new Set(
      store.resource_skills
        .filter(rs => numSkillIds.includes(rs.skill_id))
        .map(rs => rs.resource_id)
    );

    return store.resources
      .filter(r => matchingResourceIds.has(r.id) && r.status === 'active')
      .map(r => {
        const uploader = store.users.find(u => u.id === r.uploader_id);
        return {
          ...r,
          uploader_name: uploader ? uploader.name : 'Faculty Member',
          skills: this.getSkillMappingsSync(r.id, store)
        };
      });
  }
};
