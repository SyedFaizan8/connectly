import mongoose from "mongoose";
import { Request, Response, NextFunction } from "express";
import { Video } from "../models/video.model";
import { Subscription } from "../models/subscription.model";
import { Like } from "../models/like.model";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";

// Get channel stats like total video views, total subscribers, total videos, total likes, etc.
const getChannelStats = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;

    try {
        // Total Videos
        const totalVideos = await Video.countDocuments({ userId });

        // Total Subscribers
        const totalSubscribers = await Subscription.countDocuments({ channelId: userId });

        // Total Likes on Videos
        const totalLikes = await Like.countDocuments({ userId });

        // Total Views (assuming each video has a `views` field)
        const totalViews = await Video.aggregate([
            { $match: { userId } },
            { $group: { _id: null, totalViews: { $sum: "$views" } } },
        ]);

        return res.status(200).json(new ApiResponse(200, {
            totalVideos,
            totalSubscribers,
            totalLikes,
            totalViews: totalViews[0]?.totalViews || 0,
        }, "Channel stats fetched successfully"));
    } catch (error) {
        return next(new ApiError(500, "Failed to fetch channel stats"));
    }
});

// Get all the videos uploaded by the channel
const getChannelVideos = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    try {
        const videos = await Video.find({ userId })
            .skip((Number(page) - 1) * Number(limit))
            .limit(Number(limit))
            .exec();

        return res.status(200).json(new ApiResponse(200, videos, "Videos fetched successfully"));
    } catch (error) {
        return next(new ApiError(500, "Failed to fetch videos"));
    }
});

export { getChannelStats, getChannelVideos };
