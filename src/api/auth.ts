import {Router} from 'express';
import {OAuth2Client} from 'google-auth-library'

import User from '../models/user';

const createAuthRouter = (
    googleClientId: string,
    googleClientSecret: string,
    googleClientCallbackURL: string,
) => {
    const router = Router();
    const getOAuth2Client = () => new OAuth2Client(
        googleClientId,
        googleClientSecret,
        googleClientCallbackURL,
    );

    router.get('/login', (req, res) => {
        const client = getOAuth2Client();
        const url = client.generateAuthUrl({
            access_type: 'offline',
            scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email']
        });

        res.redirect(url);
    });

    router.get('/oauth2callback', async (req, res) => {
        const client = getOAuth2Client();
        const code: string = req.query.code;
        const {tokens} = await client.getToken(code);
        client.setCredentials(tokens);

        const { data } = await client.request({url: 'https://openidconnect.googleapis.com/v1/userinfo'});
        const { email, name } = data;

        const user = await User.findOrCreate({
            where: {email},
            defaults: {
                displayName: name,
                email,
                permissionLevel: 'visitor'
            }
        });

        // TODO generate session token and pass to user
    });

    return router;
};

export default createAuthRouter;
