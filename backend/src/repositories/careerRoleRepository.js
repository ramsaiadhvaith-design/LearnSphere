import { query, getEngine, getMemoryStore } from '../config/database.js';

export const careerRoleRepository = {
  async findAll(onlyActive = false) {
    if (getEngine() === 'mysql') {
      const sql = onlyActive
        ? 'SELECT * FROM career_roles WHERE is_active = 1 ORDER BY name ASC'
        : 'SELECT * FROM career_roles ORDER BY name ASC';
      const roles = await query(sql);
      for (const role of roles) {
        role.skills = await this.getRoleSkills(role.id);
      }
      return roles;
    }
    const store = getMemoryStore();
    const roles = store.career_roles
      .filter(r => (onlyActive ? r.is_active === 1 : true))
      .sort((a, b) => a.name.localeCompare(b.name));

    return roles.map(r => ({
      ...r,
      skills: this.getRoleSkillsSync(r.id, store)
    }));
  },

  async findById(id) {
    const numId = parseInt(id, 10);
    if (getEngine() === 'mysql') {
      const rows = await query('SELECT * FROM career_roles WHERE id = ?', [numId]);
      if (!rows[0]) return null;
      const role = rows[0];
      role.skills = await this.getRoleSkills(role.id);
      return role;
    }
    const store = getMemoryStore();
    const role = store.career_roles.find(r => r.id === numId);
    if (!role) return null;
    return {
      ...role,
      skills: this.getRoleSkillsSync(role.id, store)
    };
  },

  async getRoleSkills(careerRoleId) {
    const numId = parseInt(careerRoleId, 10);
    if (getEngine() === 'mysql') {
      const sql = `
        SELECT 
          crs.skill_id,
          crs.required_proficiency,
          crs.rationale,
          s.name as skill_name,
          s.category as skill_category,
          s.description as skill_description
        FROM career_role_skills crs
        JOIN skills s ON crs.skill_id = s.id
        WHERE crs.career_role_id = ?
        ORDER BY s.name ASC
      `;
      return await query(sql, [numId]);
    }
    const store = getMemoryStore();
    return this.getRoleSkillsSync(numId, store);
  },

  getRoleSkillsSync(careerRoleId, store) {
    const mappings = store.career_role_skills.filter(m => m.career_role_id === careerRoleId);
    return mappings.map(m => {
      const skill = store.skills.find(s => s.id === m.skill_id);
      return {
        skill_id: m.skill_id,
        required_proficiency: m.required_proficiency,
        rationale: m.rationale || '',
        skill_name: skill ? skill.name : 'Unknown Skill',
        skill_category: skill ? skill.category : 'General',
        skill_description: skill ? skill.description : ''
      };
    });
  },

  async create({ name, description = '', is_active = 1, skills = [] }) {
    if (getEngine() === 'mysql') {
      const res = await query(
        'INSERT INTO career_roles (name, description, is_active) VALUES (?, ?, ?)',
        [name.trim(), description.trim(), is_active ? 1 : 0]
      );
      const roleId = res.insertId;
      if (skills && skills.length > 0) {
        await this.setRoleSkills(roleId, skills);
      }
      return this.findById(roleId);
    }
    const store = getMemoryStore();
    const newId = store.career_roles.length ? Math.max(...store.career_roles.map(r => r.id)) + 1 : 1;
    const newRole = {
      id: newId,
      name: name.trim(),
      description: description.trim(),
      is_active: is_active ? 1 : 0
    };
    store.career_roles.push(newRole);

    if (skills && skills.length > 0) {
      this.setRoleSkillsSync(newId, skills, store);
    }

    return this.findById(newId);
  },

  async update(id, updates, skills = null) {
    const numId = parseInt(id, 10);
    if (getEngine() === 'mysql') {
      const fields = [];
      const values = [];
      if (updates.name !== undefined) { fields.push('name = ?'); values.push(updates.name.trim()); }
      if (updates.description !== undefined) { fields.push('description = ?'); values.push(updates.description.trim()); }
      if (updates.is_active !== undefined) { fields.push('is_active = ?'); values.push(updates.is_active ? 1 : 0); }
      if (fields.length > 0) {
        values.push(numId);
        await query(`UPDATE career_roles SET ${fields.join(', ')} WHERE id = ?`, values);
      }
      if (skills !== null) {
        await this.setRoleSkills(numId, skills);
      }
      return this.findById(numId);
    }
    const store = getMemoryStore();
    const role = store.career_roles.find(r => r.id === numId);
    if (!role) return null;
    if (updates.name !== undefined) role.name = updates.name.trim();
    if (updates.description !== undefined) role.description = updates.description.trim();
    if (updates.is_active !== undefined) role.is_active = updates.is_active ? 1 : 0;
    if (skills !== null) {
      this.setRoleSkillsSync(numId, skills, store);
    }
    return this.findById(numId);
  },

  async setRoleSkills(careerRoleId, skillsArray) {
    const numId = parseInt(careerRoleId, 10);
    if (getEngine() === 'mysql') {
      await query('DELETE FROM career_role_skills WHERE career_role_id = ?', [numId]);
      for (const item of skillsArray) {
        await query(
          'INSERT INTO career_role_skills (career_role_id, skill_id, required_proficiency, rationale) VALUES (?, ?, ?, ?)',
          [numId, parseInt(item.skill_id, 10), Math.min(Math.max(parseInt(item.required_proficiency, 10) || 1, 1), 5), item.rationale || '']
        );
      }
      return;
    }
    const store = getMemoryStore();
    this.setRoleSkillsSync(numId, skillsArray, store);
  },

  setRoleSkillsSync(careerRoleId, skillsArray, store) {
    store.career_role_skills = store.career_role_skills.filter(m => m.career_role_id !== careerRoleId);
    for (const item of skillsArray) {
      store.career_role_skills.push({
        career_role_id: careerRoleId,
        skill_id: parseInt(item.skill_id, 10),
        required_proficiency: Math.min(Math.max(parseInt(item.required_proficiency, 10) || 1, 1), 5),
        rationale: item.rationale || ''
      });
    }
  }
};
