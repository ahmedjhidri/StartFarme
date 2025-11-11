import { createClient } from 'redis';

const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
});

redisClient.on('error', (err) => {
  console.error('Redis Client Error:', err);
});

redisClient.on('connect', () => {
  console.log('Redis Client Connected');
});

// Connect to Redis
if (!redisClient.isOpen) {
  redisClient.connect().catch(console.error);
}

export default redisClient;

// OTP Storage in Redis (5 minutes TTL)
export const otpStorage = {
  set: async (phone: string, code: string, ttl: number = 300) => {
    await redisClient.setEx(`otp:${phone}`, ttl, code);
  },
  get: async (phone: string): Promise<string | null> => {
    return await redisClient.get(`otp:${phone}`);
  },
  delete: async (phone: string) => {
    await redisClient.del(`otp:${phone}`);
  },
};

// Cache storage
export const cache = {
  set: async (key: string, value: string, ttl: number = 3600) => {
    await redisClient.setEx(key, ttl, value);
  },
  get: async (key: string): Promise<string | null> => {
    return await redisClient.get(key);
  },
  delete: async (key: string) => {
    await redisClient.del(key);
  },
};

