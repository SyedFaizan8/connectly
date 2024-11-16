import dotenv from "dotenv";
dotenv.config({ path: './.env' });

import { log } from './utils/logger';
import cluster from 'cluster';
import { cpus } from 'os';
import { WorkerManager } from './utils/workerManager';
import { startServer } from "./server";

const numCpus = cpus().length;

const setupGracefulShutdown = (workerManager: WorkerManager | null) => {
    // Graceful shutdown to stop workers and clean resources
    process.on('SIGINT', () => {
        log.info('SIGINT received. Shutting down gracefully...');
        try {
            if (workerManager) workerManager.stop(); // Stop workers
            log.info('Workers stopped successfully');
        } catch (error) {
            log.error('Error during worker shutdown:', error);
        }
        setTimeout(() => {
            log.error("Forcefully shutting down after timeout");
            process.exit(1); // Force shutdown if graceful shutdown fails
        }, 10000);
    });
};

(async () => {
    if (cluster.isPrimary) {
        log.info(`Primary process ${process.pid} started.`);

        if (numCpus > 1) {
            // Multi-core system: spawn workers
            const workerManager = new WorkerManager();
            workerManager.start();
            setupGracefulShutdown(workerManager); // Set up graceful shutdown for workers
        } else {
            // Single-core system: run in non-clustered mode
            log.info('Single core detected, running in non-clustered mode');
            startServer();
        }
    } else {
        // Worker process logic
        log.info(`Worker process ${process.pid} started.`);
        startServer();
    }
})();
