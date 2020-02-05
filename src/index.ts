import * as dotenv from 'dotenv';
import createServer from './server';

dotenv.config();

const port: number = +process.env.PORT || 3000;
const frontendPath: string = process.env.FRONTEND_PATH;
const staticPath: string = process.env.STATIC_PATH;

const app = createServer({
    frontendPath,
    staticPath
});

console.log('Serving frontend from folder %s', frontendPath);
console.log('Serving static from folder %s', staticPath);
console.log('Listening on port %d', port);
app.listen(port);
