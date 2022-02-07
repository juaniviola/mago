import 'dotenv/config';

export const NODE_ENV = process.env.NODE_ENV || 'dev';
export const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';
export const PORT = process.env.PORT || 8001;
