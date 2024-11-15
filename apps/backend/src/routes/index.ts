//src/routes/index.ts
import { Router } from 'express';
import userRouter from './user.routes';
import healthcheckRouter from './healthcheck.routes';
import tweetRouter from './tweet.routes';
import subscriptionRouter from './subscription.routes';
import videoRouter from './video.routes';
import commentRouter from './comment.routes';
import likeRouter from './like.routes';
import playlistRouter from './playlist.routes';
import dashboardRouter from './dashboard.routes';

const router = Router();

router.use('/healthcheck', healthcheckRouter);
router.use('/users', userRouter);
router.use('/tweets', tweetRouter);
router.use('/subscriptions', subscriptionRouter);
router.use('/videos', videoRouter);
router.use('/comments', commentRouter);
router.use('/likes', likeRouter);
router.use('/playlist', playlistRouter);
router.use('/dashboard', dashboardRouter);

export default router;
