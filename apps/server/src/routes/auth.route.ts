import express from 'express';
import passport from 'passport';

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
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/login',
  }),
  (_, res) => {
    res.redirect('http://localhost:3001');
  },
);

export default router;
