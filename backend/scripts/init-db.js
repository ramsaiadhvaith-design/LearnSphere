import { initializeDatabase, getDbStatus } from '../src/config/database.js';

async function main() {
  console.log('--- Initializing LearnSphere Database ---');
  const result = await initializeDatabase();
  const status = getDbStatus();

  if (result.success) {
    console.log('✅ Database initialization complete.');
    process.exit(0);
  } else {
    console.error('❌ Database initialization failed.');
    console.error(`Error details: ${status.error}`);
    console.error('Please verify your MySQL service and credentials in backend/.env');
    process.exit(1);
  }
}

main();
