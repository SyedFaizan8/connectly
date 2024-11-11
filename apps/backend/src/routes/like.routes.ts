import { Router, Request, Response, NextFunction } from 'express';
import {
    getLikedVideos,
    toggleCommentLike,
    toggleVideoLike,
    toggleTweetLike,
} from "../controllers/like.controller";
import { verifyJWT } from "../middlewares/auth.middleware";

// Create a router instance
const router = Router();

// Apply verifyJWT middleware to all routes in this file
router.use(verifyJWT);

// Route to toggle like for video
router.route("/toggle/v/:videoId").post((req: Request, res: Response, next: NextFunction) => toggleVideoLike(req, res, next));

// Route to toggle like for comment
router.route("/toggle/c/:commentId").post((req: Request, res: Response, next: NextFunction) => toggleCommentLike(req, res, next));

// Route to toggle like for tweet
router.route("/toggle/t/:tweetId").post((req: Request, res: Response, next: NextFunction) => toggleTweetLike(req, res, next));

// Route to get liked videos
router.route("/videos").get((req: Request, res: Response, next: NextFunction) => getLikedVideos(req, res, next));

export default router;
