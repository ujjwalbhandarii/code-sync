import express from 'express';
import passport from 'passport';

import { envConfig } from '../utils/config/env.config';

const router = express.Router();

router.post('/login', () => {});
router.post('/signup', () => {});

router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['email', 'profile'],
    session: false,
  }),
);

router.get(
  '/google/redirect',
  passport.authenticate('google', {
    session: false,
    failureRedirect: `${envConfig.FRONTEND_URL}/login?error=auth_failed`,
  }),
  async (req, res) => {
    try {
      const user = req.user as any;

      // The token is already generated in the auth service
      const token = user.token;

      // Remove sensitive information before sending
      delete user.password;
      delete user.token;

      // Redirect to frontend with token
      // Security note: in production, consider using secure HttpOnly cookies instead
      res.redirect(`${envConfig.FRONTEND_URL}?token=${token}`);
    } catch (error) {
      console.error('Auth redirect error:', error);
      res.redirect(
        `${envConfig.FRONTEND_URL}/login?error=authentication_failed`,
      );
    }
  },
);

export default router;
