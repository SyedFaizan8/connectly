import { Router, Request, Response, NextFunction } from "express";
import {
    loginUser,
    logoutUser,
    registerUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateUserAvatar,
    updateUserCoverImage,
    getUserChannelProfile,
    getWatchHistory,
    updateAccountDetails
} from "../controllers/user.controller";
import { upload } from "../middlewares/multer.middleware";
import { verifyJWT } from "../middlewares/auth.middleware";

// Create a router instance
const router = Router();

// Route to register a user with avatar and cover image upload
router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    (req: Request, res: Response, next: NextFunction) => registerUser(req, res, next)
);

// Route to login a user
router.route("/login").post((req: Request, res: Response, next: NextFunction) => loginUser(req, res, next));

// Secured routes
router.route("/logout").post(verifyJWT, (req: Request, res: Response, next: NextFunction) => logoutUser(req, res, next));
router.route("/refresh-token").post((req: Request, res: Response, next: NextFunction) => refreshAccessToken(req, res, next));
router.route("/change-password").post(verifyJWT, (req: Request, res: Response, next: NextFunction) => changeCurrentPassword(req, res, next));
router.route("/current-user").get(verifyJWT, (req: Request, res: Response, next: NextFunction) => getCurrentUser(req, res, next));
router.route("/update-account").patch(verifyJWT, (req: Request, res: Response, next: NextFunction) => updateAccountDetails(req, res, next));

// Routes for avatar and cover image update
router.route("/avatar").patch(verifyJWT, upload.single("avatar"), (req: Request, res: Response, next: NextFunction) => updateUserAvatar(req, res, next));
router.route("/cover-image").patch(verifyJWT, upload.single("coverImage"), (req: Request, res: Response, next: NextFunction) => updateUserCoverImage(req, res, next));

// Route to get a user channel profile
router.route("/c/:username").get(verifyJWT, (req: Request, res: Response, next: NextFunction) => getUserChannelProfile(req, res, next));

// Route to get watch history
router.route("/history").get(verifyJWT, (req: Request, res: Response, next: NextFunction) => getWatchHistory(req, res, next));

export default router;
