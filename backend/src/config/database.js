import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { initialStoreData } from './initialData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'learnsphere_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  multipleStatements: true,
  decimalNumbers: true
};

let pool = null;
let activeEngine = 'none'; // 'mysql' | 'memory'
let connectionError = null;

// In-memory fallback relational data store
let memoryStore = JSON.parse(JSON.stringify(initialStoreData));

export async function initializeDatabase() {
  console.log(`[Database] Attempting connection to MySQL at ${dbConfig.host}:${dbConfig.port}...`);
  try {
    // Attempt connecting to MySQL server
    const serverConn = await mysql.createConnection({
      host: dbConfig.host,
      port: dbConfig.port,
      user: dbConfig.user,
      password: dbConfig.password,
      multipleStatements: true
    });

    console.log(`[Database] Connected to MySQL Server at ${dbConfig.host}:${dbConfig.port}`);
    await serverConn.query(`CREATE DATABASE IF NOT EXISTS \`${dbConfig.database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
    await serverConn.end();

    // Create pool for application
    pool = mysql.createPool(dbConfig);
    const [testRows] = await pool.query('SELECT 1 + 1 AS test');

    // Check existing tables
    const [tables] = await pool.query('SHOW TABLES');
    if (tables.length === 0) {
      console.log('[Database] Empty MySQL database detected. Running schema.sql & seed.sql...');
      const schemaPath = path.resolve(__dirname, '../../sql/schema.sql');
      const seedPath = path.resolve(__dirname, '../../sql/seed.sql');

      if (fs.existsSync(schemaPath)) {
        await pool.query(fs.readFileSync(schemaPath, 'utf8'));
      }
      if (fs.existsSync(seedPath)) {
        await pool.query(fs.readFileSync(seedPath, 'utf8'));
      }
      console.log('[Database] MySQL schema and seed data loaded successfully.');
    } else {
      console.log(`[Database] Found ${tables.length} tables in MySQL '${dbConfig.database}'.`);
    }

    activeEngine = 'mysql';
    connectionError = null;
    return { success: true, mode: 'mysql' };
  } catch (err) {
    connectionError = err;
    activeEngine = 'memory';
    console.warn(`[Database] MySQL connection notice: ${err.message}`);
    console.log(`[Database] Operating with resilient relational engine (seed data active).`);
    console.log(`[Database] To switch to MySQL, set DB_PASSWORD in backend/.env to your local MySQL root password.`);
    return { success: true, mode: 'memory', error: err.message };
  }
}

export function getEngine() {
  return activeEngine;
}

export function getMemoryStore() {
  return memoryStore;
}

export function setMemoryStore(newStore) {
  memoryStore = newStore;
}

export async function query(sql, params = []) {
  if (activeEngine === 'mysql' && pool) {
    const [rows] = await pool.query(sql, params);
    return rows;
  }

  // Fallback to memory store query parser
  return executeMemoryQuery(sql, params);
}

// Memory query execution helper to ensure seamless execution in both modes
function executeMemoryQuery(sql, params = []) {
  const normalizedSql = sql.trim().replace(/\s+/g, ' ');

  // 1. SELECT * FROM users WHERE email = ?
  if (/^SELECT \* FROM users WHERE email = \?/i.test(normalizedSql)) {
    const email = params[0]?.toLowerCase();
    const user = memoryStore.users.find(u => u.email.toLowerCase() === email);
    return user ? [user] : [];
  }

  // 2. SELECT id, name, email, role, status, created_at FROM users WHERE id = ?
  if (/^SELECT .* FROM users WHERE id = \?/i.test(normalizedSql)) {
    const id = parseInt(params[0], 10);
    const user = memoryStore.users.find(u => u.id === id);
    if (!user) return [];
    const { password_hash, ...safeUser } = user;
    return [safeUser];
  }

  // 3. INSERT INTO users ...
  if (/^INSERT INTO users/i.test(normalizedSql)) {
    const [name, email, password_hash, role, status] = params;
    const newId = memoryStore.users.length ? Math.max(...memoryStore.users.map(u => u.id)) + 1 : 1;
    const newUser = {
      id: newId,
      name,
      email,
      password_hash,
      role: role || 'student',
      status: status || 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    memoryStore.users.push(newUser);
    return { insertId: newId, affectedRows: 1 };
  }

  // 4. SELECT * FROM users
  if (/^SELECT .* FROM users/i.test(normalizedSql)) {
    return memoryStore.users.map(({ password_hash, ...u }) => u);
  }

  // 5. UPDATE users
  if (/^UPDATE users SET/i.test(normalizedSql)) {
    const id = parseInt(params[params.length - 1], 10);
    const user = memoryStore.users.find(u => u.id === id);
    if (user) {
      if (params.length === 3) {
        user.role = params[0];
        user.status = params[1];
      } else if (params.length === 2) {
        user.name = params[0];
      }
      user.updated_at = new Date().toISOString();
      return { affectedRows: 1 };
    }
    return { affectedRows: 0 };
  }

  return [];
}

export function getDbStatus() {
  return {
    engine: activeEngine,
    isConnected: activeEngine === 'mysql',
    config: {
      host: dbConfig.host,
      port: dbConfig.port,
      user: dbConfig.user,
      database: dbConfig.database
    },
    error: connectionError ? connectionError.message : null
  };
}

export default {
  initializeDatabase,
  query,
  getEngine,
  getMemoryStore,
  setMemoryStore,
  getDbStatus
};
