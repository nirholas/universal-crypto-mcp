import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('3001'),
  JWT_SECRET: z.string().default('your-super-secret-jwt-key'),
  DATABASE_URL: z.string().optional(),
  REDIS_URL: z.string().optional(),
  CORS_ORIGIN: z.string().default('*'),
});

const env = envSchema.parse(process.env);

export const config = {
  env: env.NODE_ENV,
  port: parseInt(env.PORT, 10),
  jwt: {
    secret: env.JWT_SECRET,
    expiresIn: '7d',
  },
  database: {
    url: env.DATABASE_URL,
  },
  redis: {
    url: env.REDIS_URL,
  },
  cors: {
    origin: env.CORS_ORIGIN === '*' ? '*' : env.CORS_ORIGIN.split(','),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  },
};
