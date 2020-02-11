import * as express from 'express';
import * as fs from 'fs';
import {Router} from 'express';
import {ServerConfig} from '../server';

import createAuthRouter, {AuthLevel, authMiddleware} from './auth';
import createFileRouter from './file';
import createUserRouter from './user';
import createAnnouncementRouter from './announcement';

export type RouterCreator = (serverConfig: ServerConfig) => Router;

const createApiRouter: (config: ServerConfig) => Router = (config: ServerConfig) => {
    const router = Router();

    router.use(createAnnouncementRouter(config));
    router.use(createAuthRouter(config));
    router.use(createFileRouter(config));
    router.use(createUserRouter(config));

    // 404 Handler
    router.all('*', (req, res) => {
        res.status(404)
            .json({message: '404 Not Found'});
    });

    return router;
};

export default createApiRouter;
