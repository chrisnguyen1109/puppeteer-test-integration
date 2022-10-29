import { Router } from 'express';
import passport from 'passport';
import {
    getMeController,
    loginController,
    logoutController,
} from '../../controllers';
import { checkAuth } from '../../middlewares';

export const authRouter = Router();

authRouter.get(
    '/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

authRouter.get('/google/callback', loginController);

authRouter.get('/whoami', checkAuth, getMeController);

authRouter.post('/logout', checkAuth, logoutController);
