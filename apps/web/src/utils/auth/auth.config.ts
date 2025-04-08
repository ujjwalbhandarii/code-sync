import type { AuthOptions } from 'next-auth';

export default {
  providers: [],
  debug: process.env.NODE_ENV !== 'production',
} satisfies AuthOptions;
