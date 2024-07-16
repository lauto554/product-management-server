import express from 'express';
import router from './router';
import swaggerUi from 'swagger-ui-express';
import cors, { CorsOptions } from 'cors';
import morgan from 'morgan';
import { connectDB } from './config/db';
import swaggerSpec, { swaggerUiOptions } from './config/swagger';

connectDB();

const server = express();

const corsOptions: CorsOptions = {
  origin: function (origin, callback) {
    if (origin === process.env.FRONTEND_URL) {
      callback(null, true);
    } else {
      callback(new Error('Error de CORS'));
    }
  },
};

server.use(cors(corsOptions));

server.use(express.json());

server.use(morgan('dev'));

server.use('/api', router);

// Docs
server.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerUiOptions));

export default server;
