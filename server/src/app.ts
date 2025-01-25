import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import notFoundMiddleware from '@/middlewares/errors/notFound';
import errorHandlerMiddleware from '@/middlewares/errors/errorHandler';

// handle unhandled rejection error
import '@/middlewares/errors/unhandledRejection';

// Import Routes
import api from '@/api';

const app = express();

dotenv.config();

app.use(morgan('dev'));

// Set security HTTP headers
app.use(helmet());

// body parser
app.use(express.json({ limit: '50mb' }));

// cookie parser
app.use(cookieParser());

// cors
app.use(
    cors({
        origin: process.env.ORIGIN
    })
);

// Limit requests from same API
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 1000 * 1000,
    message: 'Too many requests from this IP, please try again in one hour!'
});
app.use('/api', limiter);

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Serve all static files inside public directory.
app.use('/static', express.static('public'));

// Routes which Should handle the requests
app.use('/api', api);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

export default app;
