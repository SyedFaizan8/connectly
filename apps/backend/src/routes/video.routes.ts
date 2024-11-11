import { Router, Request, Response, NextFunction } from 'express';
import {
    deleteVideo,
    getAllVideos,
    getVideoById,
    publishAVideo,
    togglePublishStatus,
    updateVideo,
} from "../controllers/video.controller";
import { verifyJWT } from "../middlewares/auth.middleware";
import { upload } from "../middlewares/multer.middleware";

const router = Router();

// Apply verifyJWT middleware to all routes in this file
router.use(verifyJWT);

router
    .route("/")
    .get((req: Request, res: Response, next: NextFunction) => getAllVideos(req, res, next))
    .post(
        upload.fields([
            {
                name: "videoFile",
                maxCount: 1,
            },
            {
                name: "thumbnail",
                maxCount: 1,
            },
        ]),
        (req: Request, res: Response, next: NextFunction) => publishAVideo(req, res, next)
    );

router
    .route("/:videoId")
    .get((req: Request, res: Response, next: NextFunction) => getVideoById(req, res, next))
    .delete((req: Request, res: Response, next: NextFunction) => deleteVideo(req, res, next))
    .patch(upload.single("thumbnail"), (req: Request, res: Response, next: NextFunction) => updateVideo(req, res, next));

router.route("/toggle/publish/:videoId").patch((req: Request, res: Response, next: NextFunction) => togglePublishStatus(req, res, next));

export default router;
