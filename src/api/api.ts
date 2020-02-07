import {Router} from 'express';
import {ServerConfig} from "../server";

import createAuthRouter from './auth';

const createApiRouter: (config: ServerConfig) => Router = (config: ServerConfig) => {
    const router = Router();

    router.get('/', (req, res) => {
        res.end('Hello, world! from API');
    });

    router.use('/auth', createAuthRouter(config.googleClientId, config.googleClientSecret, config.googleClientCallbackURL));

    router.all('*', (req, res) => {
        res.status(404)
            .json({message: '404 Not Found'});
    });

    return router;
};

export default createApiRouter;
