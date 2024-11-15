import dotenv from "dotenv";
dotenv.config({ path: './.env' });

import http from 'http';
import { Server } from 'socket.io';
import { PORT, CORS_ORIGIN } from './config/env';
import app from './app';
import { initializeWebSocket } from './websocket/socket';
import { WorkerManager } from './utils/workerManager';
import { log } from './utils/logger';
import cluster from "cluster";

(async () => {
    if (cluster.isPrimary) {
        const workerManager = new WorkerManager();
        workerManager.start();

        // Graceful shutdown
        process.on('SIGINT', () => {
            log.info('SIGINT received. Shutting down gracefully...');
            workerManager.stop();
            setTimeout(() => {
                log.error("Forcefully shutting down after timeout");
                process.exit(1);
            }, 10000);
        });


    } else {
        // Worker process logic
        log.info(`Worker process ${process.pid} started.`);

        const server = http.createServer(app);
        const io = new Server(server, {
            cors: { origin: CORS_ORIGIN, credentials: true },
        });

        initializeWebSocket(io); // Initialize WebSocket with the server instance

        server.listen(PORT, () => {
            log.info(`Server is running on port ${PORT}`);
        });
    }
})()
