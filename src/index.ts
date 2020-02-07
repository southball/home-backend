import * as dotenv from 'dotenv';
import createServer from './server';
import Database from './database';

dotenv.config();

const port: number = parseInt(process.env.PORT as string) || 3000;
const frontendPath: string = process.env.FRONTEND_PATH as string;
const staticPath: string = process.env.STATIC_PATH as string;

const googleClientId = process.env.GOOGLE_CLIENT_ID as string;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET as string;
const googleClientCallbackURL = process.env.GOOGLE_CLIENT_CALLBACK_URL as string;

const databasePath = process.env.DATABASE_PATH as string;

Database.init(databasePath);

const app = createServer({
    frontendPath,
    staticPath,
    googleClientId,
    googleClientSecret,
    googleClientCallbackURL,
});

console.log('Serving frontend from folder %s', frontendPath);
console.log('Serving static from folder %s', staticPath);
console.log('Listening on port %d', port);

app.listen(port);