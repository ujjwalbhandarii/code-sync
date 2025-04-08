import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { envConfig } from "../config/env.config";
import { authService } from "@/services/auth.service";

passport.use(
  new GoogleStrategy(
    {
      clientID: envConfig.GOOGLE_CLIENT_ID,
      clientSecret: envConfig.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://www.example.com/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, cb) => {
      const email = profile._json.email as string; // TODO - This can be undefined, handle undefined case.

      try {
        const user = await authService.getUser({
          email,
        });
      } catch (error) {
        console.log(error);
      }
    }
  )
);
