import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

import { envConfig } from "./env.config";

type UserProfile = {
  id: string;
  email: string;
  image: string;
  provider: string;
  displayName: string;
};

export const passportConfig = () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: envConfig.GOOGLE_CLIENT_ID,
        clientSecret: envConfig.GOOGLE_CLIENT_SECRET,
        callbackURL: envConfig.GOOGLE_CALLBACK_URL,
        scope: ["profile", "email"],
      },
      (_accessToken, _refreshToken, profile, callbackFn) => {
        // TODO - create the user in your database
        const userProfile: UserProfile = {
          id: profile.id,
          provider: profile.provider,
          displayName: profile.displayName,
          email: profile._json.email as string,
          image: profile._json.picture as string,
        };

        return callbackFn(null, userProfile);
      }
    )
  );
};
