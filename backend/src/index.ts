import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { config } from './config/env';
import prisma from './config/database';
import redisClient from './config/redis';

// Routes
import authRoutes from './routes/authRoutes';
import weatherRoutes from './routes/weatherRoutes';
import cropsRoutes from './routes/cropsRoutes';
import irrigationRoutes from './routes/irrigationRoutes';
import marketRoutes from './routes/marketRoutes';
import pestDetectionRoutes from './routes/pestDetectionRoutes';
import forumRoutes from './routes/forumRoutes';
import uploadRoutes from './routes/uploadRoutes';

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: config.corsOrigin,
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/crops', cropsRoutes);
app.use('/api/irrigation', irrigationRoutes);
app.use('/api/market', marketRoutes);
app.use('/api/pest-detection', pestDetectionRoutes);
app.use('/api/forum', forumRoutes);
app.use('/api/upload', uploadRoutes);

// Serve uploaded files (development only)
if (config.nodeEnv === 'development') {
  app.use('/uploads', express.static(config.uploadDir));
}

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    ...(config.nodeEnv === 'development' && { stack: err.stack }),
  });
});

// Start server
const startServer = async () => {
  try {
    // Test database connection
    await prisma.$connect();
    console.log('✅ Database connected');

    // Test Redis connection
    if (redisClient.isOpen) {
      console.log('✅ Redis connected');
    } else {
      await redisClient.connect();
      console.log('✅ Redis connected');
    }

    // Start server
    app.listen(config.port, () => {
      console.log(`🚀 Server running on port ${config.port}`);
      console.log(`📡 Environment: ${config.nodeEnv}`);
      console.log(`🌐 CORS enabled for: ${config.corsOrigin}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM signal received: closing HTTP server');
  await prisma.$disconnect();
  await redisClient.quit();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT signal received: closing HTTP server');
  await prisma.$disconnect();
  await redisClient.quit();
  process.exit(0);
});

startServer();

