import { Router, Request, Response, NextFunction } from 'express';
import { healthcheck } from "../controllers/healthcheck.controller";

// Create a router instance
const router = Router();

// Define the route for health check
router.route('/')
    .get((req: Request, res: Response, next: NextFunction) => healthcheck(req, res, next));

export default router;
