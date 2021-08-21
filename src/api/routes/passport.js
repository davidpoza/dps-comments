import passport from 'passport';
import { Router } from 'express';
import { signToken } from '../../services/auth.js';
import middlewares from '../middlewares/index.js';

const route = Router();

export default (app) => {
  app.use('/auth/google', route);

  route.get(
    '/',
    passport.authenticate('google', {
      session: false,
      scope: ['profile', 'email'],
      accessType: 'offline',
      approvalPrompt: 'force'
    })
  );

  // callback url upon successful google authentication
  route.get(
    '/callback',
    passport.authenticate('google', { session: false }),
    (req, res) => {
      signToken(req, res);
    }
  );

  route.get(
    '/protected',
    middlewares.isAuth,
    (req, res) => {
      res.send('<h1>Protected route</h1>');
    }
  );
}