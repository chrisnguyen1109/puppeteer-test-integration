import cookieParser from 'cookie-parser';
import express, { Express } from 'express';
import path from 'path';
import { ENV } from '../configs';
import { loadPassports } from './passport.loader';
import { connectRedisDB } from './redis.loader';
import { loadRoutes } from './route.loader';

export const loadApp = async (app: Express) => {
    await connectRedisDB();

    app.use(cookieParser());

    app.use(express.json());
    app.use(
        express.urlencoded({
            extended: true,
        })
    );

    loadPassports();

    loadRoutes(app);

    if (ENV !== 'dev') {
        app.use(express.static(path.join(__dirname, '../../build')));

        app.get('*', (_req, res) => {
            res.sendFile(path.join(__dirname, '../../build', 'index.html'));
        });
    }
};
