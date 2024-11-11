import { Request, Response, NextFunction } from "express";
import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../models/like.model";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";

// Toggle like on a video
const toggleVideoLike = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { videoId } = req.params;
    const userId = req.user.id; // Assuming you get the user ID from JWT or session

    if (!isValidObjectId(videoId)) {
        return next(new ApiError(400, "Invalid video ID"));
    }

    const existingLike = await Like.findOne({ user: userId, video: videoId });
    if (existingLike) {
        // Unlike the video if already liked
        await Like.deleteOne({ user: userId, video: videoId });
        return res.status(200).json(new ApiResponse(200, null, "Video unliked"));
    } else {
        // Like the video
        const newLike = new Like({ user: userId, video: videoId });
        await newLike.save();
        return res.status(200).json(new ApiResponse(200, newLike, "Video liked"));
    }
});

// Toggle like on a comment
const toggleCommentLike = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { commentId } = req.params;
    const userId = req.user.id; // Assuming you get the user ID from JWT or session

    if (!isValidObjectId(commentId)) {
        return next(new ApiError(400, "Invalid comment ID"));
    }

    const existingLike = await Like.findOne({ user: userId, comment: commentId });
    if (existingLike) {
        // Unlike the comment if already liked
        await Like.deleteOne({ user: userId, comment: commentId });
        return res.status(200).json(new ApiResponse(200, null, "Comment unliked"));
    } else {
        // Like the comment
        const newLike = new Like({ user: userId, comment: commentId });
        await newLike.save();
        return res.status(200).json(new ApiResponse(200, newLike, "Comment liked"));
    }
});

// Toggle like on a tweet
const toggleTweetLike = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { tweetId } = req.params;
    const userId = req.user.id; // Assuming you get the user ID from JWT or session

    if (!isValidObjectId(tweetId)) {
        return next(new ApiError(400, "Invalid tweet ID"));
    }

    const existingLike = await Like.findOne({ user: userId, tweet: tweetId });
    if (existingLike) {
        // Unlike the tweet if already liked
        await Like.deleteOne({ user: userId, tweet: tweetId });
        return res.status(200).json(new ApiResponse(200, null, "Tweet unliked"));
    } else {
        // Like the tweet
        const newLike = new Like({ user: userId, tweet: tweetId });
        await newLike.save();
        return res.status(200).json(new ApiResponse(200, newLike, "Tweet liked"));
    }
});

// Get all liked videos for the user
const getLikedVideos = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user.id; // Assuming you get the user ID from JWT or session

    const likedVideos = await Like.find({ user: userId }).populate('video');
    return res.status(200).json(new ApiResponse(200, likedVideos, "Liked videos fetched"));
});

export {
    toggleVideoLike,
    toggleCommentLike,
    toggleTweetLike,
    getLikedVideos,
};
