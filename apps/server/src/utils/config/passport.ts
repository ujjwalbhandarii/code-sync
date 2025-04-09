import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

import { envConfig } from './env.config';
import { AuthService } from '../../services/auth.service';

export const passportConfig = () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: envConfig.GOOGLE_CLIENT_ID,
        clientSecret: envConfig.GOOGLE_CLIENT_SECRET,
        callbackURL: envConfig.GOOGLE_CALLBACK_URL,
        scope: ['profile', 'email'],
      },
      async (_accessToken, _refreshToken, profile, callbackFn) => {
        try {
          // Map Google profile to our standardized social profile
          const socialProfile = {
            id: profile.id,
            email: profile._json.email as string,
            name: profile.displayName,
            image: profile._json.picture as string,
            provider: 'google',
          };

          // Process the user through our auth service
          const { user, token } = await AuthService.handleOAuthUser(
            socialProfile,
          );

          // Augment the user object with the token
          const userWithToken = {
            ...user,
            token,
          };

          return callbackFn(null, userWithToken);
        } catch (error) {
          console.error('Google auth error:', error);
          return callbackFn(error as Error);
        }
      },
    ),
  );
};
