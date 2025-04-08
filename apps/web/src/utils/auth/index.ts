import NextAuth from 'next-auth';
import authConfig from '@/utils/auth/auth.config';

export const { auth, handlers, signIn, signOut } = NextAuth({
  ...authConfig,
});
