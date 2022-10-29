import { RequestHandler } from 'express';
import passport from 'passport';
import { COOKIE_LOGIN_SUCCESS, COOKIE_TOKEN, TOKEN_EXPIRE } from '../configs';
import { login } from '../services';

export const loginController: RequestHandler = async (req, res, next) => {
    return passport.authenticate('google', async (error, user) => {
        if (error) {
            return next(error);
        }

        const accessToken = await login(user);

        res.cookie(COOKIE_TOKEN, accessToken, {
            expires: new Date(
                Date.now() + parseInt(TOKEN_EXPIRE, 10) * 60 * 60 * 24 * 1000
            ),
            httpOnly: true,
            sameSite: 'strict',
            secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
        });
        res.cookie(COOKIE_LOGIN_SUCCESS, true);

        res.status(200).send('Login success');
    })(req, res, next);
};

export const getMeController: RequestHandler = async (req, res) => {
    res.status(200).json({
        message: 'Success',
        data: {
            user: req.user,
        },
    });
};

export const logoutController: RequestHandler = async (req, res) => {
    res.clearCookie(COOKIE_TOKEN);
    res.clearCookie(COOKIE_LOGIN_SUCCESS);

    res.status(200).json({
        message: 'Success',
    });
};
