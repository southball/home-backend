import * as express from 'express';
import * as path from 'path';

import createApiRouter from './api';

interface ServerConfig {
    staticPath: string;
    frontendPath: string;
}

const createServer = (serverConfig: ServerConfig) => {
    const app = express();

    const staticPath = path.resolve(serverConfig.staticPath);
    const frontendPath = path.resolve(serverConfig.frontendPath);

    const apiRouter = createApiRouter();
    app.use('/api', apiRouter);

    // Serve the static files in the folder.
    app.use('/static', express.static(staticPath));

    // This is required to make sure that the BrowserRouter in react-router works.
    app.use('*', (req, res) => {
        res.sendFile(frontendPath);
    });

    return app;
};

export default createServer;
