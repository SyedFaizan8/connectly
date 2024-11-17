import * as multer from "multer";
import { Response, Request, NextFunction, Router } from "express";
import { getMessages } from "../controllers/controllers/getMessages.controller";
import { getGroupsChats } from "../controllers/controllers/getGroupsChats.controller";
import { handleFileUpload } from "../controllers/controllers/handleFileUpload.controller";
import { handleGetResource } from "../controllers/controllers/handleGetResource.controller";
import { handleNewGroup } from "../controllers/controllers/handleNewGroup.controller";
import { handleNewChat } from "../controllers/controllers/handleNewChat.controller";
import {
    changeCurrentPassword,
    getCurrentUser,
    logoutUser,
    refreshAccessToken,
    registerUser,
    updateAccountDetails,
    updateUserAvatar
} from "../controllers/user.controller";
import { upload } from "../middlewares/multer.middleware";
import { verifyJWT } from "../middlewares/auth.middleware";
import { publishAVideo } from "../controllers/video.controller";

// Create a router instance
const router: Router = Router();

// TODO:
// check if server is active
router.get("/", (_: any, res: any) => {
    res.json({
        active: true,
    });
});

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

// chat message files
router.get("/resources/:fileType/:key", handleGetResource);

router.post("/create-new-group", verifyJWT, handleNewGroup);

router.post("/create-new-chat", verifyJWT, handleNewChat);


// temp upload location for files
const uploadLocation = multer({ dest: "uploads/" });

// TODO:
// upload files
router.post(
    "/file-upload/:fileType",
    verifyJWT,
    uploadLocation.single("whatsapp-clone-message-file"),
    handleFileUpload
);

//TODO: FIX THIS
router
    .post("/file-upload/:fileType",
        verifyJWT,
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


// get messages of a particular chat, group
router.get("/chats/:refId", verifyJWT, getMessages);

// get chats, groups for a particular user
router.get("/chats", verifyJWT, getGroupsChats);


export default router;
