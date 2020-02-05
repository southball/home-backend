import { Router } from 'express';

const createApiRouter: () => Router = () => {
    const router = Router();

    router.get('/', (req, res) => {
        res.end('Hello, world! from API');
    });

    return router;
};

export default createApiRouter;

