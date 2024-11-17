import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model";
import { User } from "../models/user.model";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { uploadOnCloudinary } from "../utils/cloudinary";
import { Request, Response } from "express";

// Define query params types for pagination and filtering
interface GetVideosQuery {
    page?: string;
    limit?: string;
    query?: string;
    sortBy?: string;
    sortType?: string;
    userId?: string;
}

// TODO: 
// Publish a video after uploading to Cloudinary
export const publishAVideo = asyncHandler(async (req: Request, res: Response) => {
    const { title, description } = req.body;

    if (!title || !description) {
        throw new ApiError(400, "Title and description are required");
    }

    const videoFile = req.file; // Assuming video file is being uploaded

    if (!videoFile) {
        throw new ApiError(400, "Video file is required");
    }

    // Upload video to Cloudinary
    const uploadedVideo = await uploadOnCloudinary(videoFile.path);

    if (!uploadedVideo?.url) {
        throw new ApiError(500, "Error uploading video to Cloudinary");
    }

    const video = await Video.create({
        title,
        description,
        videoUrl: uploadedVideo.url,
        user: req.user._id, // Assuming you are using authentication middleware
    });

    return res.status(201).json(new ApiResponse(201, video, "Video published successfully"));
});

