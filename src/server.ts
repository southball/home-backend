import * as express from 'express';
import * as path from 'path';

import createApiRouter from './api/api';

export interface ServerConfig {
    // Required
    staticPath: string;
    frontendPath: string;
    googleClientId: string;
    googleClientSecret: string;
    googleClientCallbackURL: string;
    filesFolder: string;
    postgresUser: string;
    postgresDB: string;
    postgresPassword: string;
    postgresHost: string;
    domain: string;

    // Optional
    adminEmail?: string;
}

const createServer = (serverConfig: ServerConfig) => {
    const app = express();

    const staticPath = path.resolve(serverConfig.staticPath);
    const frontendPath = path.resolve(serverConfig.frontendPath);

    const apiRouter = createApiRouter(serverConfig);
    app.use('/api', apiRouter);

    // Serve the static files in the folder.
    app.use('/static', express.static(staticPath, {
        dotfiles: 'allow',
    }));

    app.use('/fonts', express.static(path.resolve(frontendPath, 'fonts')));

    app.use('/bundle.js', (req, res) => {
        res.sendFile(path.resolve(frontendPath, 'bundle.js'));
    });

    // This is required to make sure that the BrowserRouter in react-router works.
    app.use('*', (req, res) => {
        res.sendFile(path.resolve(frontendPath, 'index.html'));
    });

    return app;
};

export default createServer;
