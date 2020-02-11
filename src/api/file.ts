import * as express from 'express';
import {Router} from 'express';
import {AuthLevel, authMiddleware} from './auth';
import * as path from 'path';
import * as fs from 'fs';
import File from '../models/file';
import * as bodyParser from 'body-parser';
import {RouterCreator} from './api';

interface FileEntry {
    filename: string;
    type: string;
    tags: string[];
}

const createFileRouter: RouterCreator = (config) => {
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
        const targetRel = path.relative(config.filesFolder, target);
        if (!target.startsWith(config.filesFolder)) {
            res.status(403)
                .json({success: false, message: '403 Permission Denied'});
            return;
        }

        try {
            const stats = await fs.promises.lstat(target);
            if (!stats?.isDirectory())
                throw 'Target is not directory.';

            const tagMap = new Map<string, string[]>();
            const tagEntries = await File.findAll({ where: {folder: targetRel} });
            for (const entry of tagEntries) {
                tagMap.set(entry.filename, JSON.parse(entry.tags) as string[]);
            }

            const files = await fs.promises.readdir(target);
            const rawEntries: (FileEntry | null)[] = await Promise.all(files.map(async (filename) => {
                const absolutePath = path.resolve(target, filename);
                const fileStats = await fs.promises.lstat(absolutePath);
                if (fileStats.isFile())
                    return {filename, type: 'file', tags: []};
                else if (fileStats.isDirectory())
                    return {filename, type: 'directory', tags: []};
                else
                    return null;
            }));
            const entries = rawEntries
                .filter((entry) => entry !== null)
                .map((entry: FileEntry) => {
                    // Add tags if found.
                    const tags = tagMap.get(entry.filename);
                    if (tags) {
                        return {...entry, tags};
                    } else {
                        return entry;
                    }
                });

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

    router.get('/tags', authMiddleware(AuthLevel.USER), async (req, res) => {
        const files = await File.findAll({});
        const tags = new Set();
        console.log(files.map((f) => f.toJSON()));
        files.map((file) => JSON.parse(file.tags) as string[])
            .forEach((fileTags) => {
                fileTags.forEach((tag) => {
                    tags.add(tag);
                });
            });
        res.json({
            status: 'success',
            tags: [...tags].sort()
        });
    });

    router.post('/tags/set', authMiddleware(AuthLevel.USER), bodyParser.json(), async (req, res) => {
        const filePath = req.body.file;
        const tags = req.body.tags;

        console.log(req.body);

        if (!filePath || !Array.isArray(tags) || !tags.every((val) => typeof val === 'string')) {
            res.status(400)
                .json({
                    success: false,
                    message: 'The query should contain the file as string and tags as a string array.'
                });
            return;
        }

        const absolutePath = path.resolve(config.filesFolder, filePath);

        if (!absolutePath.startsWith(config.filesFolder)) {
            res.status(403)
                .json({
                    success: false,
                    message: 'The file you are attempting to tag cannot be accessed.'
                });
            console.log(config.filesFolder, absolutePath);
            return;
        }

        const folder = path.relative(config.filesFolder, path.dirname(absolutePath));
        const filename = path.basename(absolutePath);

        const [fileEntry] = await File.findOrCreate({
            where: {folder, filename},
            defaults: {
                folder,
                filename,
                tags: '[]',
            },
        });

        const newTags = [...new Set(tags)].sort();
        fileEntry.tags = JSON.stringify(newTags);
        await fileEntry.save();

        res.json({
            success: true,
            file: fileEntry.toJSON()
        });
    });

    return router;
};

export default createFileRouter;
