import * as express from "express";
import * as multer from "multer";
import { isAuthREST } from "../middlewares/isAuthREST.middleware";
import { sendRefreshToken } from "../controllers/controllers/sendRefreshToken.controller";
import { googlelogin } from "../controllers/controllers/googleLogin.controller";
import { logout } from "../controllers/controllers/logout.controller";
import { getMessages } from "../controllers/controllers/getMessages.controller";
import { getGroupsChats } from "../controllers/controllers/getGroupsChats.controller";
import { handleFileUpload } from "../controllers/controllers/handleFileUpload.controller";
import { handleGetResource } from "../controllers/controllers/handleGetResource.controller";
import { handleNewGroup } from "../controllers/controllers/handleNewGroup.controller";
import { handleNewChat } from "../controllers/controllers/handleNewChat.controller";

const router: express.Router = express.Router();


// temp upload location for files
const uploadLocation = multer({ dest: "uploads/" });

// check if server is active
router.get("/", (_: any, res: any) => {
    res.json({
        active: true,
    });
});

// refresh access token and update the refresh token
router.get("/refresh-token", sendRefreshToken);

// signin with google
router.post("/g-auth/authenticate", googlelogin);

// logout user
router.get("/logout", isAuthREST, logout);

// get messages of a particular chat, group
router.get("/chats/:refId", isAuthREST, getMessages);

// get chats, groups for a particular user
router.get("/chats", isAuthREST, getGroupsChats);

// upload files
router.post(
    "/file-upload/:fileType",
    isAuthREST,
    uploadLocation.single("whatsapp-clone-message-file"),
    handleFileUpload
);

// chat message files
router.get("/resources/:fileType/:key", handleGetResource);

router.post("/create-new-group", isAuthREST, handleNewGroup);

router.post("/create-new-chat", isAuthREST, handleNewChat);

export default router;
