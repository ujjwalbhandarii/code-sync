import { CorsOptions } from 'cors';

export const ROUTES = {
  PORT: process.env.PORT || 9999,
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:3000',
} as const;

export const CORS_CONFIG = {
  credentials: true,
  allowedHeaders: ['*'],
  methods: ['GET', 'POST'],
  origin: ROUTES.CLIENT_URL,
} as CorsOptions;
