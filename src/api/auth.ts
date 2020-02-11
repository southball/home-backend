import {Router, RequestHandler} from 'express';
import {OAuth2Client} from 'google-auth-library'

import User from '../models/user';
import {RouterCreator} from './api';

export enum AuthLevel {
    NONE = -1,
    VISITOR = 0,
    USER = 1,
    ADMIN = 2
}

export function toAuthLevel(permissionLevel?: string): AuthLevel {
    if (permissionLevel === 'visitor')
        return AuthLevel.VISITOR;
    if (permissionLevel === 'user')
        return AuthLevel.USER;
    if (permissionLevel === 'admin')
        return AuthLevel.ADMIN;
    return AuthLevel.NONE;
}

export function authMiddleware(requiredLevel: AuthLevel): RequestHandler {
    return async (req, res, next) => {
        const token = req.query.token || '';
        const user = await User.findOne({where:{lastSessionId: token}});
        if (user && toAuthLevel(user.permissionLevel) >= requiredLevel) {
            next();
        } else {
            res.status(403)
                .json({
                    message: 'Permission denied.'
                });
        }
    };
}

const createAuthRouter: RouterCreator = (config) => {
    const router = Router();

    const {googleClientId, googleClientSecret, googleClientCallbackURL} = config;
    const getOAuth2Client = () => new OAuth2Client(
        googleClientId,
        googleClientSecret,
        googleClientCallbackURL,
    );

    router.get('/auth/login', (req, res) => {
        const client = getOAuth2Client();
        const url = client.generateAuthUrl({
            access_type: 'offline',
            scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email']
        });

        res.redirect(url);
    });

    router.get('/auth/oauth2callback', async (req, res) => {
        const client = getOAuth2Client();
        const code: string = req.query.code;
        const {tokens} = await client.getToken(code);
        client.setCredentials(tokens);

        const { data } = await client.request({url: 'https://openidconnect.googleapis.com/v1/userinfo'});
        const { email, name } = data;

        // Find user by email.
        const [user] = await User.findOrCreate({
            where: {email},
            defaults: {
                email,
                displayName: name,
                permissionLevel: 'visitor'
            }
        });

        if (email === config.adminEmail) {
            user.permissionLevel = 'admin';
        }

        await user.updateSession();

        // Pass session ID to user.
        res.cookie('session-token', user.lastSessionId);
        res.cookie('session-permissionLevel', user.permissionLevel);
        res.redirect('/');
    });

    return router;
};

export default createAuthRouter;
