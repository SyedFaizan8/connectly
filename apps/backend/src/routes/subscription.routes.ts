import { Router, Request, Response, NextFunction } from 'express';
import {
    getSubscribedChannels,
    getUserChannelSubscribers,
    toggleSubscription,
} from "../controllers/subscription.controller";
import { verifyJWT } from "../middlewares/auth.middleware";

// Create a router instance
const router = Router();

// Apply verifyJWT middleware to all routes in this file
router.use(verifyJWT);

// Route to get or toggle subscription for a channel
router
    .route("/c/:channelId")
    .get((req: Request, res: Response, next: NextFunction) => getSubscribedChannels(req, res, next))
    .post((req: Request, res: Response, next: NextFunction) => toggleSubscription(req, res, next));

// Route to get all subscribers for a specific user
router.route("/u/:subscriberId").get((req: Request, res: Response, next: NextFunction) => getUserChannelSubscribers(req, res, next));

export default router;
