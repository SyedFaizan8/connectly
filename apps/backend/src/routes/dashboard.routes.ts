import { Router, Request, Response, NextFunction } from 'express';
import {
    getChannelStats,
    getChannelVideos,
} from "../controllers/dashboard.controller";
import { verifyJWT } from "../middlewares/auth.middleware";

// Create a router instance
const router = Router();

// Apply verifyJWT middleware to all routes in this file
router.use(verifyJWT);

interface ChannelStatsRequest extends Request { }
interface ChannelVideosRequest extends Request { }

// Define the route for getting channel stats
router.route("/stats")
    .get((req: ChannelStatsRequest, res: Response, next: NextFunction) => getChannelStats(req, res, next));

// Define the route for getting channel videos
router.route("/videos")
    .get((req: ChannelVideosRequest, res: Response, next: NextFunction) => getChannelVideos(req, res, next));

export default router;
