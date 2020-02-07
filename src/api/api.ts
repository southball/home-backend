import * as express from 'express';
import * as fs from 'fs';
import {Router} from 'express';
import {ServerConfig} from "../server";

import createAuthRouter, {AuthLevel, authMiddleware} from './auth';
import * as path from "path";

const createApiRouter: (config: ServerConfig) => Router = (config: ServerConfig) => {
    const router = Router();

    // A separate router is needed for custom 404 handling.
    const fileRouter = Router();
    fileRouter.use(authMiddleware(AuthLevel.USER));
    fileRouter.use(express.static(config.filesFolder));
    fileRouter.all('*', (req, res) => {
        res.status(404)
            .end('404 File Not Found');
    });
    router.use('/file', fileRouter);

    router.get('/files', authMiddleware(AuthLevel.USER), async (req, res) => {
        const target = path.resolve(config.filesFolder, req.query.path || '');
        if (!target.startsWith(config.filesFolder)) {
            res.status(403)
                .json({success: false, message: '403 Permission Denied'});
            return;
        }

        try {
            const stats = await fs.promises.lstat(target);
            if (!stats?.isDirectory())
                throw "Target is not directory.";

            const files = await fs.promises.readdir(target);
            const rawEntries = await Promise.all(files.map(async (filename) => {
                const absolutePath = path.resolve(target, filename);
                const fileStats = await fs.promises.lstat(absolutePath);
                if (fileStats.isFile())
                    return {filename, type: 'file', tags: ["file-tag1", "file-tag2", "file-tag3"]};
                else if (fileStats.isDirectory())
                    return {filename, type: 'directory', tags: ["dir-tag1", "dir-tag2"]};
                else
                    return null;
            }));
            const entries = rawEntries.filter((entry) => entry !== null);

            res.json({
                success: true,
                files: entries,
            });
        } catch (err) {
            console.log(err);
            res.status(404)
                .json({ success: false, message: '404 Folder Not Found.' });
        }
    });

    router.use('/auth',
        createAuthRouter(config.googleClientId, config.googleClientSecret, config.googleClientCallbackURL));

    router.get('/files', authMiddleware(AuthLevel.USER), (req, res) => {
        res.end('OK "' + req.params.path + '"');
    });

    router.all('*', (req, res) => {
        res.status(404)
            .json({message: '404 Not Found'});
    });

    return router;
};

export default createApiRouter;
