import cors from 'cors';
import http from 'http';
import passport from 'passport';
import express, { Request, Response } from 'express';

import AuthRoutes from './routes/auth.route';
import { envConfig } from './utils/config/env.config';
import { passportConfig } from './utils/config/passport';
import { CORS_CONFIG } from './constants/config.constant';
import { initializeSocketService } from './services/socket.service';

const app = express();
const server = http.createServer(app);

app.use(passport.initialize());
passportConfig();

app.use(cors(CORS_CONFIG));
app.use(express.json());

initializeSocketService(server);

app.get('/', (_: Request, res: Response) => res.send('Server running...'));

app.use('/auth', AuthRoutes);

server.listen(envConfig.PORT, () => {
  console.log(`Server running at http://localhost:${envConfig.PORT}`);
});
