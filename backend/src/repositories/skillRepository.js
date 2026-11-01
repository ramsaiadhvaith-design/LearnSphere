import { query, getEngine, getMemoryStore } from '../config/database.js';

export const skillRepository = {
  async findAll(onlyActive = false) {
    if (getEngine() === 'mysql') {
      const sql = onlyActive 
        ? 'SELECT * FROM skills WHERE is_active = 1 ORDER BY name ASC'
        : 'SELECT * FROM skills ORDER BY name ASC';
      return await query(sql);
    }
    const store = getMemoryStore();
    return store.skills
      .filter(s => (onlyActive ? s.is_active === 1 : true))
      .sort((a, b) => a.name.localeCompare(b.name));
  },

  async findById(id) {
    const numId = parseInt(id, 10);
    if (getEngine() === 'mysql') {
      const rows = await query('SELECT * FROM skills WHERE id = ?', [numId]);
      return rows[0] || null;
    }
    const store = getMemoryStore();
    return store.skills.find(s => s.id === numId) || null;
  },

  async create({ name, category = 'Technical', description = '', is_active = 1 }) {
    if (getEngine() === 'mysql') {
      const res = await query(
        'INSERT INTO skills (name, category, description, is_active) VALUES (?, ?, ?, ?)',
        [name.trim(), category.trim(), description.trim(), is_active ? 1 : 0]
      );
      return { id: res.insertId, name, category, description, is_active };
    }
    const store = getMemoryStore();
    const newId = store.skills.length ? Math.max(...store.skills.map(s => s.id)) + 1 : 1;
    const newSkill = {
      id: newId,
      name: name.trim(),
      category: category.trim(),
      description: description.trim(),
      is_active: is_active ? 1 : 0
    };
    store.skills.push(newSkill);
    return newSkill;
  },

  async update(id, updates) {
    const numId = parseInt(id, 10);
    if (getEngine() === 'mysql') {
      const fields = [];
      const values = [];
      if (updates.name !== undefined) { fields.push('name = ?'); values.push(updates.name.trim()); }
      if (updates.category !== undefined) { fields.push('category = ?'); values.push(updates.category.trim()); }
      if (updates.description !== undefined) { fields.push('description = ?'); values.push(updates.description.trim()); }
      if (updates.is_active !== undefined) { fields.push('is_active = ?'); values.push(updates.is_active ? 1 : 0); }
      if (fields.length === 0) return null;
      values.push(numId);
      await query(`UPDATE skills SET ${fields.join(', ')} WHERE id = ?`, values);
      return this.findById(numId);
    }
    const store = getMemoryStore();
    const skill = store.skills.find(s => s.id === numId);
    if (!skill) return null;
    if (updates.name !== undefined) skill.name = updates.name.trim();
    if (updates.category !== undefined) skill.category = updates.category.trim();
    if (updates.description !== undefined) skill.description = updates.description.trim();
    if (updates.is_active !== undefined) skill.is_active = updates.is_active ? 1 : 0;
    return skill;
  }
};
