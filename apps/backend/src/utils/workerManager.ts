import cluster from "cluster";
import { cpus } from "os";
import { Worker } from "cluster";
import { log } from './logger';

export class WorkerManager {
    private workers: Worker[] = [];
    private readonly numProcesses: number;

    constructor() {
        this.numProcesses = cpus().length;
    }

    // Spawn a new worker
    spawnWorker(i: number): void {
        const worker = cluster.fork();
        this.workers[i] = worker;

        worker.on("message", (msg) => {
            if (msg === "shutdown") {
                log.info(`Worker ${worker.process.pid} shutting down gracefully...`);
                worker.disconnect();
            }
        });

        worker.on("exit", (code, signal) => {
            log.error(`Worker ${i} exited with code ${code}, signal ${signal}. Respawning...`);
            this.spawnWorker(i); // respawn worker
        });

        log.info(`Worker ${worker.process.pid} started.`);
    }

    // Start the workers
    start(): void {
        log.info(`Primary process ${process.pid} is managing ${this.numProcesses} workers.`);
        for (let i = 0; i < this.numProcesses; i++) {
            this.spawnWorker(i);
        }
    }

    // Stop all workers
    stop(): void {
        log.info("Shutting down workers...");
        this.workers.forEach((worker) => {
            worker.send("shutdown");
        });
    }
}
