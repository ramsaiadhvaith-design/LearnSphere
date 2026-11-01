import { query, getEngine, getMemoryStore } from '../config/database.js';

export const userRepository = {
  async findByEmail(email) {
    if (getEngine() === 'mysql') {
      const rows = await query('SELECT * FROM users WHERE LOWER(email) = LOWER(?)', [email.trim()]);
      return rows[0] || null;
    }
    const store = getMemoryStore();
    return store.users.find(u => u.email.toLowerCase() === email.trim().toLowerCase()) || null;
  },

  async findById(id) {
    const numId = parseInt(id, 10);
    if (getEngine() === 'mysql') {
      const rows = await query('SELECT id, name, email, role, status, created_at, updated_at FROM users WHERE id = ?', [numId]);
      return rows[0] || null;
    }
    const store = getMemoryStore();
    const user = store.users.find(u => u.id === numId);
    if (!user) return null;
    const { password_hash, ...safe } = user;
    return safe;
  },

  async create({ name, email, password_hash, role = 'student', status = 'active' }) {
    if (getEngine() === 'mysql') {
      const res = await query(
        'INSERT INTO users (name, email, password_hash, role, status) VALUES (?, ?, ?, ?, ?)',
        [name, email.toLowerCase().trim(), password_hash, role, status]
      );
      return { id: res.insertId, name, email, role, status };
    }
    const store = getMemoryStore();
    const newId = store.users.length ? Math.max(...store.users.map(u => u.id)) + 1 : 1;
    const newUser = {
      id: newId,
      name,
      email: email.toLowerCase().trim(),
      password_hash,
      role,
      status,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    store.users.push(newUser);
    const { password_hash: _, ...safe } = newUser;
    return safe;
  },

  async findAll() {
    if (getEngine() === 'mysql') {
      return await query('SELECT id, name, email, role, status, created_at, updated_at FROM users ORDER BY created_at DESC');
    }
    const store = getMemoryStore();
    return store.users
      .map(({ password_hash, ...u }) => u)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  },

  async update(id, updates) {
    const numId = parseInt(id, 10);
    if (getEngine() === 'mysql') {
      const fields = [];
      const values = [];
      if (updates.name !== undefined) { fields.push('name = ?'); values.push(updates.name); }
      if (updates.role !== undefined) { fields.push('role = ?'); values.push(updates.role); }
      if (updates.status !== undefined) { fields.push('status = ?'); values.push(updates.status); }
      if (fields.length === 0) return null;
      values.push(numId);
      await query(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`, values);
      return this.findById(numId);
    }
    const store = getMemoryStore();
    const user = store.users.find(u => u.id === numId);
    if (!user) return null;
    if (updates.name !== undefined) user.name = updates.name;
    if (updates.role !== undefined) user.role = updates.role;
    if (updates.status !== undefined) user.status = updates.status;
    user.updated_at = new Date().toISOString();
    const { password_hash, ...safe } = user;
    return safe;
  },

  async countStats() {
    if (getEngine() === 'mysql') {
      const rows = await query(`
        SELECT 
          COUNT(*) as total_users,
          SUM(CASE WHEN role = 'student' THEN 1 ELSE 0 END) as students,
          SUM(CASE WHEN role = 'faculty' THEN 1 ELSE 0 END) as faculty,
          SUM(CASE WHEN role = 'admin' THEN 1 ELSE 0 END) as admins,
          SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active_users
        FROM users
      `);
      return rows[0];
    }
    const store = getMemoryStore();
    return {
      total_users: store.users.length,
      students: store.users.filter(u => u.role === 'student').length,
      faculty: store.users.filter(u => u.role === 'faculty').length,
      admins: store.users.filter(u => u.role === 'admin').length,
      active_users: store.users.filter(u => u.status === 'active').length
    };
  }
};
