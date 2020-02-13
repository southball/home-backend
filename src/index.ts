import * as dotenv from 'dotenv';
import * as path from 'path';
import createServer from './server';
import Database from './database';

dotenv.config();

const port: number = parseInt(process.env.PORT as string) || 3000;
const frontendPath: string = path.resolve(process.env.FRONTEND_PATH as string);
const staticPath: string = path.resolve(process.env.STATIC_PATH as string);

const googleClientId = process.env.GOOGLE_CLIENT_ID as string;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET as string;
const googleClientCallbackURL = process.env.GOOGLE_CLIENT_CALLBACK_URL as string;

const filesFolder = path.resolve(process.env.FILES_FOLDER as string);
const databasePath = path.resolve(process.env.DATABASE_PATH as string);

const adminEmail = process.env.ADMIN_EMAIL as (string | undefined);

const postgresHost = process.env.POSTGRES_HOST as string;
const postgresUser = process.env.POSTGRES_USER as string;
const postgresPassword = process.env.POSTGRES_PASSWORD as string;
const postgresDB = process.env.POSTGRES_DB as string;

const serverConfig = {
    frontendPath,
    staticPath,
    googleClientId,
    googleClientSecret,
    googleClientCallbackURL,
    filesFolder,
    adminEmail,
    postgresHost,
    postgresUser,
    postgresPassword,
    postgresDB,
};

Database.init(serverConfig);

const app = createServer(serverConfig);

console.log('Serving frontend from folder %s', frontendPath);
console.log('Serving static from folder %s', staticPath);
console.log('Listening on port %d', port);

app.listen(port);