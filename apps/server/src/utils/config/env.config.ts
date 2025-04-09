import { config } from 'dotenv';

config();

export const envConfig = {
  PORT: process.env.PORT || 3000,
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:3000',
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/code-sync',
  JWT_SECRET: process.env.JWT_SECRET || 'secret',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1d',
  JWT_COOKIE_EXPIRES_IN: process.env.JWT_COOKIE_EXPIRES_IN || '1d',

  GOOGLE_CLIENT_ID:
    process.env.GOOGLE_CLIENT_ID ||
    '1016654608973-1u2voc1jdijnvbojrtc60kqj1vhmomln.apps.googleusercontent.com',
  GOOGLE_CLIENT_SECRET:
    process.env.GOOGLE_CLIENT_SECRET || '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',
  GOOGLE_CALLBACK_URL:
    process.env.GOOGLE_CALLBACK_URL ||
    'http://localhost:3000/auth/google/callback',
};
