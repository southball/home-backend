import {Router} from 'express';
import {AuthLevel, authMiddleware} from './auth';
import User from '../models/user';
import * as bodyParser from 'body-parser';
import ApiError from './api-error';
import {RouterCreator} from './api';

const createUserRouter: RouterCreator = () => {
    const router = Router();

    router.get('/users', authMiddleware(AuthLevel.ADMIN), async (req, res) => {
        const users = await User.findAll({});
        res.json({
            success: true,
            users: users.map((user) => user.toJSON()),
        });
    });

    router.post('/user/create',
        authMiddleware(AuthLevel.ADMIN),
        bodyParser.json(),
        async (req, res) => {
            const user = new User({
                email: '',
                displayName: '',
                permissionLevel: 'visitor'
            });
            await user.save();
            res.json({
                success: true,
                user: user.toJSON(),
            })
        });

    router.post('/user/delete',
        authMiddleware(AuthLevel.ADMIN),
        bodyParser.json(),
        async (req, res) => {
            try {
                const {body} = req;
                if (!body.id)
                    throw new ApiError('ID is not included in the query.');

                const user = await User.findByPk(+body.id);
                if (!user)
                    throw new ApiError('ID is not found in the database.');

                await user.destroy();
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

    router.post('/user/edit',
        authMiddleware(AuthLevel.ADMIN),
        bodyParser.json(),
        async (req, res) => {
            try {
                const {body} = req;
                if (!body.id)
                    throw new ApiError('ID not included in the query.');

                const user = await User.findByPk(+body.id);
                if (!user)
                    throw new ApiError('User not found.');

                if (body.email)
                    user.email = body.email;
                if (body.permissionLevel)
                    user.permissionLevel = body.permissionLevel;
                if (body.displayName)
                    user.displayName = body.displayName;

                await user.save();

                res.json({
                    success: true,
                    user: user.toJSON(),
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

export default createUserRouter;
