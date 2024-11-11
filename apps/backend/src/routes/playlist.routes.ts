import { Router, Request, Response, NextFunction } from 'express';
import {
    addVideoToPlaylist,
    createPlaylist,
    deletePlaylist,
    getPlaylistById,
    getUserPlaylists,
    removeVideoFromPlaylist,
    updatePlaylist,
} from "../controllers/playlist.controller";
import { verifyJWT } from "../middlewares/auth.middleware";

// Create a router instance
const router = Router();

// Apply verifyJWT middleware to all routes in this file
router.use(verifyJWT);

// Route to create a new playlist
router.route("/").post((req: Request, res: Response, next: NextFunction) => createPlaylist(req, res, next));

// Route to get, update, or delete a playlist by ID
router
    .route("/:playlistId")
    .get((req: Request, res: Response, next: NextFunction) => getPlaylistById(req, res, next))
    .patch((req: Request, res: Response, next: NextFunction) => updatePlaylist(req, res, next))
    .delete((req: Request, res: Response, next: NextFunction) => deletePlaylist(req, res, next));

// Route to add a video to a playlist
router.route("/add/:videoId/:playlistId").patch((req: Request, res: Response, next: NextFunction) => addVideoToPlaylist(req, res, next));

// Route to remove a video from a playlist
router.route("/remove/:videoId/:playlistId").patch((req: Request, res: Response, next: NextFunction) => removeVideoFromPlaylist(req, res, next));

// Route to get all playlists of a user
router.route("/user/:userId").get((req: Request, res: Response, next: NextFunction) => getUserPlaylists(req, res, next));

export default router;
