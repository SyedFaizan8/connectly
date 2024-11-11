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

// Get all videos with query, pagination, and sorting
const getAllVideos = asyncHandler(async (req: Request<{}, {}, {}, GetVideosQuery>, res: Response) => {
    const { page = "1", limit = "10", query, sortBy, sortType, userId } = req.query;

    // TODO: get all videos based on query, sort, pagination
    // Example logic
    const pageNum = parseInt(page);
    const pageSize = parseInt(limit);
    const skip = (pageNum - 1) * pageSize;

    // Fetch videos from database (implement query and sort logic as needed)
    const videos = await Video.find({}).skip(skip).limit(pageSize).sort({ [sortBy || 'createdAt']: sortType === 'desc' ? -1 : 1 });

    return res.status(200).json(new ApiResponse(200, videos, "Videos fetched successfully"));
});

// Publish a video after uploading to Cloudinary
const publishAVideo = asyncHandler(async (req: Request, res: Response) => {
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

// Get a video by ID
const getVideoById = asyncHandler(async (req: Request, res: Response) => {
    const { videoId } = req.params;

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    const video = await Video.findById(videoId);

    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    return res.status(200).json(new ApiResponse(200, video, "Video fetched successfully"));
});

// Update video details like title, description, and thumbnail
const updateVideo = asyncHandler(async (req: Request, res: Response) => {
    const { videoId } = req.params;
    const { title, description } = req.body;

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    const video = await Video.findById(videoId);

    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    if (title) video.title = title;
    if (description) video.description = description;

    // If there's a new thumbnail uploaded
    const thumbnailFile = req.file;
    if (thumbnailFile) {
        const uploadedThumbnail = await uploadOnCloudinary(thumbnailFile.path);
        video.thumbnailUrl = uploadedThumbnail?.url || "";
    }

    await video.save();

    return res.status(200).json(new ApiResponse(200, video, "Video updated successfully"));
});

// Delete a video
const deleteVideo = asyncHandler(async (req: Request, res: Response) => {
    const { videoId } = req.params;

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    const video = await Video.findByIdAndDelete(videoId);

    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    return res.status(200).json(new ApiResponse(200, {}, "Video deleted successfully"));
});

// Toggle the publish status of a video
const togglePublishStatus = asyncHandler(async (req: Request, res: Response) => {
    const { videoId } = req.params;

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    const video = await Video.findById(videoId);

    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    video.isPublished = !video.isPublished;
    await video.save();

    return res.status(200).json(new ApiResponse(200, video, `Video ${video.isPublished ? "published" : "unpublished"} successfully`));
});

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
};
