import { RequestHandler } from 'express';
import { COOKIE_TOKEN } from '../configs';
import { verifyToken } from '../services';

export const checkAuth: RequestHandler = async (req, res, next) => {
    try {
        const token = req.cookies[COOKIE_TOKEN];

        if (!token) throw new Error();

        const user = await verifyToken(token);
        if (!user) throw new Error();

        req.user = user;

        next();
    } catch (error) {
        console.log(error);

        return res.status(401).json({
            message: 'Unauthorized',
        });
    }
};
