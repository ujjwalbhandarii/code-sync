import * as argon from 'argon2';
import * as jwt from 'jsonwebtoken';
import { ROLE, User } from '@prisma/client';

import {
  GetUser,
  SignToken,
  HashPassword,
  PasswordMatch,
} from '../types/auth.type';
import { prisma } from '../utils/helpers/prisma';
import { SignupBody } from '../schema/auth.schema';
import { envConfig } from '../utils/config/env.config';

interface SocialProfile {
  id: string;
  email: string;
  name?: string;
  image?: string;
  provider: string;
}

const JWT_SECRET = process.env.JWT_SECRET ?? 'secret';
// const ACCESS_TOKEN_EXPIRATION_TIME =
//   process.env.ACCESS_TOKEN_EXPIRATION_TIME ?? "30d";

export class AuthService {
  async getUser({ email, role = 'USER' }: GetUser): Promise<User | null> {
    return await prisma.user.findFirst({
      where: { email, role: role as ROLE },
    });
  }

  async createUser({ ...data }: SignupBody): Promise<User> {
    return await prisma.user.create({
      data: {
        ...data,
        role: 'USER',
      },
    });
  }

  async passwordMatch({
    loginPassword,
    userPassword,
  }: PasswordMatch): Promise<boolean> {
    return await argon.verify(loginPassword, userPassword);
  }

  async hashPassword({ password }: HashPassword): Promise<string> {
    return await argon.hash(password);
  }

  async signToken({ userId, email, role }: SignToken): Promise<string> {
    const payload = {
      sub: userId,
      email,
      role,
    };

    // jwt.sign(payload, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRATION_TIME });

    return jwt.sign(payload, JWT_SECRET);
  }

  decodeToken({ token }: { token: string }) {
    console.log({ token });
  }

  static async handleOAuthUser(
    profile: SocialProfile,
  ): Promise<{ user: User; token: string }> {
    try {
      // Check if we already have an account with this provider
      const existingAccount = await prisma.account.findUnique({
        where: {
          provider_providerAccountId: {
            provider: profile.provider,
            providerAccountId: profile.id,
          },
        },
        include: { user: true },
      });

      // If we have an account with the provider, return the associated user
      if (existingAccount) {
        // Update the account if needed
        await prisma.account.update({
          where: {
            provider_providerAccountId: {
              provider: profile.provider,
              providerAccountId: profile.id,
            },
          },
          data: {
            updatedAt: new Date(),
          },
        });

        // Generate token
        const token = this.generateToken(existingAccount.user);
        return { user: existingAccount.user, token };
      }

      // Check if we have a user with the same email
      const existingUser = profile.email
        ? await prisma.user.findUnique({
            where: { email: profile.email },
          })
        : null;

      let user: User;

      // Start a transaction since we might need to create multiple records
      return await prisma.$transaction(async (tx) => {
        // If we have a user with this email but no account for this provider, link them
        if (existingUser) {
          user = existingUser;
        } else {
          // Create a new user
          user = await tx.user.create({
            data: {
              email: profile.email,
              name: profile.name || profile.email.split('@')[0], // Use part of email as name if needed
              image: profile.image,
              password: '', // Empty password for social login users
            },
          });
        }

        // Create a new account linked to this user
        await tx.account.create({
          data: {
            userId: user.id,
            provider: profile.provider,
            providerAccountId: profile.id,
          },
        });

        // Generate token for the user
        const token = this.generateToken(user);
        return { user, token };
      });
    } catch (error) {
      console.error('OAuth authentication error:', error);
      throw error;
    }
  }

  /**
   * Generate JWT token for authenticated user
   */
  static generateToken(user: User): string {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return jwt.sign(payload, envConfig.JWT_SECRET, { expiresIn: '7d' });
  }
}

export const authService = new AuthService();
