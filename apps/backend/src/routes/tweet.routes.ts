import { Router, Request, Response, NextFunction } from 'express';
import {
    createTweet,
    deleteTweet,
    getUserTweets,
    updateTweet,
} from "../controllers/tweet.controller";
import { verifyJWT } from "../middlewares/auth.middleware";

// Create a router instance
const router = Router();

// Apply verifyJWT middleware to all routes in this file
router.use(verifyJWT);

// Route to create a new tweet
router.route("/").post((req: Request, res: Response, next: NextFunction) => createTweet(req, res, next));

// Route to get all tweets of a specific user
router.route("/user/:userId").get((req: Request, res: Response, next: NextFunction) => getUserTweets(req, res, next));

// Route to update or delete a specific tweet by its ID
router.route("/:tweetId")
    .patch((req: Request, res: Response, next: NextFunction) => updateTweet(req, res, next))
    .delete((req: Request, res: Response, next: NextFunction) => deleteTweet(req, res, next));

export default router;
