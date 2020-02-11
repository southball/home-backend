import {Router} from 'express';
import Announcement from '../models/announcement';
import {AuthLevel, authMiddleware} from './auth';
import * as bodyParser from 'body-parser';
import ApiError from './api-error';
import {RouterCreator} from './api';

const createAnnouncementRouter: RouterCreator = () => {
    const router = Router();

    router.get('/announcements', async (req, res) => {
        const announcements = await Announcement.findAll({});
        res.json({
            success: true,
            announcements: announcements.map((announcement) => announcement.toJSON()),
        });
    });

    router.post('/announcement/create',
        authMiddleware(AuthLevel.ADMIN),
        bodyParser.json(),
        async (req, res) => {
            const announcement = new Announcement({
                title: '',
                content: '',
                priority: 0,
            });
            await announcement.save();
            res.json({
                success: true,
                announcement: announcement.toJSON(),
            });
        });

    router.post('/announcement/delete',
        authMiddleware(AuthLevel.ADMIN),
        bodyParser.json(),
        async (req, res) => {
            try {
                const {body} = req;
                if (!body.id)
                    throw new ApiError('ID is not included in the query.');

                const announcement = await Announcement.findByPk(+body.id);
                if (!announcement)
                    throw new ApiError('ID is not found in the database.');

                await announcement.destroy({});
                res.json({
                    success: true,
                });
            } catch (err) {
                console.error(err);
                res.json({
                    success: false,
                    message: err instanceof ApiError ? err.message : 'Unknown API error.',
                });
            }
        });

    router.post('/announcement/edit',
        authMiddleware(AuthLevel.ADMIN),
        bodyParser.json(),
        async (req, res) => {
            try {
                const {body} = req;
                if (!body.id)
                    throw new ApiError('ID not included in the query.');

                const announcement = await Announcement.findByPk(+body.id);
                if (!announcement)
                    throw new ApiError('Announcement not found.');

                if (body.title)
                    announcement.title = body.title;
                if (body.content)
                    announcement.content = body.content;
                if (body.priority)
                    announcement.priority = +body.priority;

                await announcement.save();

                res.json({
                    success: true,
                    announcement: announcement.toJSON(),
                });
            } catch (err) {
                console.error(err);
                res.json({
                    success: false,
                    message: err instanceof ApiError ? err.message : 'Unknown API error.',
                });
            }
        });

    return router;
};

export default createAnnouncementRouter;
