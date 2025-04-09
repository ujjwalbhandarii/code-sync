import { CorsOptions } from 'cors';

import { envConfig } from '../utils/config/env.config';

export const CORS_CONFIG = {
  credentials: true,
  allowedHeaders: ['*'],
  methods: ['GET', 'POST'],
  origin: envConfig.CLIENT_URL,
} as CorsOptions;
