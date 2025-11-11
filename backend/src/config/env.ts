import dotenv from 'dotenv';

dotenv.config();

export const config = {
  // Server
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5174',

  // Database
  databaseUrl: process.env.DATABASE_URL || '',

  // JWT
  jwtSecret: process.env.JWT_SECRET || 'change-me-in-production',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'change-me-in-production',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',

  // Redis
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',

  // SMS
  smsApiKey: process.env.SMS_API_KEY || '',
  smsApiUrl: process.env.SMS_API_URL || '',
  smsSender: process.env.SMS_SENDER || 'StartFarme',

  // File Upload
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '5242880', 10), // 5MB
  uploadDir: process.env.UPLOAD_DIR || './uploads',

  // Weather API
  weatherApiKey: process.env.WEATHER_API_KEY || '',
  weatherApiUrl: process.env.WEATHER_API_URL || 'https://api.openweathermap.org/data/2.5',

  // Payment Gateway
  paymentGatewayUrl: process.env.PAYMENT_GATEWAY_URL || '',
  paymentGatewayKey: process.env.PAYMENT_GATEWAY_KEY || '',

  // AI/ML
  aiApiUrl: process.env.AI_API_URL || '',
  aiApiKey: process.env.AI_API_KEY || '',

  // AWS S3
  awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
  awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  awsRegion: process.env.AWS_REGION || 'us-east-1',
  awsS3Bucket: process.env.AWS_S3_BUCKET || '',

  // Cloudinary
  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY || '',
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET || '',
};

// Validate required environment variables
const requiredEnvVars = [
  'DATABASE_URL',
  'JWT_SECRET',
];

if (config.nodeEnv === 'production') {
  requiredEnvVars.forEach((varName) => {
    if (!process.env[varName]) {
      throw new Error(`Missing required environment variable: ${varName}`);
    }
  });
}

