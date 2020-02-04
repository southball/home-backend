import * as express from 'express';
import * as dotenv from 'dotenv';

dotenv.config();

const app = express();

const port: number = +process.env.PORT || 3000;
const frontendPath: string = process.env.FRONTEND_PATH;

console.log('Serving frontend from folder %s', frontendPath);
app.use('/', express.static(frontendPath));

console.log('Listening on port %d', port);
app.listen(port);
