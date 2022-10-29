require('dotenv').config({
    path: `.env.${process.env.NODE_ENV}`,
});

import express from 'express';
import { PORT } from './configs';

const app = express();

require('./loaders').loadApp(app);

process.on('uncaughtException', error => {
    console.log(error.name);
    console.log(error.message);
    console.log('UNCAUGHT EXCEPTION!');
    process.exit(1);
});

const server = app.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`);
});

process.on('unhandledRejection', error => {
    if (error instanceof Error) {
        console.log(error.name);
        console.log(error.message);
    }

    console.log('UNHANDLED REJECTION!');
    server.close(() => {
        process.exit(1);
    });
});
