import http from 'http';
import { Server } from 'socket.io';
import { PORT, CORS_ORIGIN } from './config/env';
import app from './app';
import { initializeWebSocket } from './websocket/socket';
import { log } from './utils/logger';


export const startServer = () => {
    // Function to create and start the HTTP server
    const server = http.createServer(app);
    const io = new Server(server, {
        cors: { origin: CORS_ORIGIN, credentials: true },
    });

    initializeWebSocket(io); // Initialize WebSocket with the server instance

    server.listen(PORT, () => {
        log.info(`Server is running on port ${PORT}`);
    });

    return server;
};