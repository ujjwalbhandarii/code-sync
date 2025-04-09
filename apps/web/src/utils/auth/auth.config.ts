import type { AuthOptions } from 'next-auth';

// import GoogleProvider from 'next-auth/providers/google';

export default {
  providers: [
    // GoogleProvider({
    //   clientId: process.env.GOOGLE_CLIENT_ID || '',
    //   clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    // }),
  ],
  debug: process.env.NODE_ENV !== 'production',
} satisfies AuthOptions;
