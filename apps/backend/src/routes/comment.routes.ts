import { Router, Request, Response, NextFunction } from 'express';
import {
    addComment,
    deleteComment,
    getVideoComments,
    updateComment,
} from "../controllers/comment.controller";
import { verifyJWT } from "../middlewares/auth.middleware";

// Create a router instance
const router = Router();

// Apply verifyJWT middleware to all routes in this file
router.use(verifyJWT);

interface VideoRequest extends Request {
    params: {
        videoId: string;
    };
}

interface CommentRequest extends Request {
    params: {
        commentId: string;
    };
}

// Define routes for getting and adding comments to a video
router.route("/:videoId")
    .get((req: VideoRequest, res: Response, next: NextFunction) => getVideoComments(req, res, next))
    .post((req: VideoRequest, res: Response, next: NextFunction) => addComment(req, res, next));

// Define routes for updating and deleting comments
router.route("/c/:commentId")
    .delete((req: CommentRequest, res: Response, next: NextFunction) => deleteComment(req, res, next))
    .patch((req: CommentRequest, res: Response, next: NextFunction) => updateComment(req, res, next));

export default router;
