import express, { Express } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { CORS_ORIGIN } from './config/env';
import apiRouter from './routes/index';
import { log } from './utils/logger';

const app: Express = express();

// Middleware setup
app.use(cors({ origin: CORS_ORIGIN, credentials: true }));
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(cookieParser());
app.use(express.static('public'));

// API routes
app.use('/api/v1', apiRouter);

// Global error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    log.error(`Error: ${err.message}`);
    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || "Internal Server Error",
        data: null,
        errors: err.errors || [],
    });
});

export default app;


