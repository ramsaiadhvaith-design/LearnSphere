import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import { initializeDatabase, getDbStatus } from './config/database.js';
import { errorHandler } from './middleware/errorMiddleware.js';

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import skillRoutes from './routes/skillRoutes.js';
import careerRoleRoutes from './routes/careerRoleRoutes.js';
import resourceRoutes from './routes/resourceRoutes.js';
import assessmentRoutes from './routes/assessmentRoutes.js';
import roadmapRoutes from './routes/roadmapRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import statsRoutes from './routes/statsRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: (origin, callback) => {
    // Allow local development origins
    callback(null, true);
  },
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health and DB status endpoint
app.get('/api/health', (req, res) => {
  const dbStatus = getDbStatus();
  res.status(200).json({
    status: 'healthy',
    platform: 'LearnSphere API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    database: dbStatus
  });
});

// Mount modular REST APIs
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/career-roles', careerRoleRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/assessments', assessmentRoutes);
app.use('/api/roadmaps', roadmapRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/stats', statsRoutes);

// 404 Route Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.originalUrl}`
  });
});

// Centralized Error Handling Middleware
app.use(errorHandler);

// Start server after initializing database
async function startServer() {
  try {
    const dbResult = await initializeDatabase();
    console.log(`[LearnSphere] Database initialized successfully (Mode: ${dbResult.mode}).`);

    app.listen(PORT, () => {
      console.log(`=======================================================`);
      console.log(`  🎓 LearnSphere Server is running on port ${PORT}`);
      console.log(`  🔗 REST API Base: http://localhost:${PORT}/api`);
      console.log(`  🩺 Health Check: http://localhost:${PORT}/api/health`);
      console.log(`=======================================================`);
    });
  } catch (err) {
    console.error('Failed to start LearnSphere server:', err);
    process.exit(1);
  }
}

startServer();

export default app;
