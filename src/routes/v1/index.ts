import { Router } from 'express';
import { authRouter } from './auth.route';
import { blogRouter } from './blog.route';

export const loadRoutesV1 = () => {
    const router = Router();

    router.use('/auth', authRouter);
    router.use('/blogs', blogRouter);

    return router;
};
