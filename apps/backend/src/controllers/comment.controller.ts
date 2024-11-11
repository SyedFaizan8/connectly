import mongoose from "mongoose";
import { Request, Response, NextFunction } from "express";
import { Comment } from "../models/comment.model";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";

// Get all comments for a video
const getVideoComments = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { videoId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    try {
        const comments = await Comment.find({ videoId })
            .skip((Number(page) - 1) * Number(limit))
            .limit(Number(limit))
            .exec();

        return res.status(200).json(new ApiResponse(200, comments, "Comments fetched successfully"));
    } catch (error) {
        return next(new ApiError(500, "Failed to fetch comments"));
    }
});

// Add a comment to a video
const addComment = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { videoId } = req.params;
    const { content } = req.body;
    const userId = req.user.id; // Assuming the user ID is stored in the JWT token

    try {
        const newComment = new Comment({
            videoId,
            userId,
            content,
        });

        await newComment.save();
        return res.status(201).json(new ApiResponse(201, newComment, "Comment added successfully"));
    } catch (error) {
        return next(new ApiError(500, "Failed to add comment"));
    }
});

// Update a comment
const updateComment = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { commentId } = req.params;
    const { content } = req.body;

    try {
        const updatedComment = await Comment.findByIdAndUpdate(
            commentId,
            { content },
            { new: true }
        );

        if (!updatedComment) {
            return next(new ApiError(404, "Comment not found"));
        }

        return res.status(200).json(new ApiResponse(200, updatedComment, "Comment updated successfully"));
    } catch (error) {
        return next(new ApiError(500, "Failed to update comment"));
    }
});

// Delete a comment
const deleteComment = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { commentId } = req.params;

    try {
        const deletedComment = await Comment.findByIdAndDelete(commentId);

        if (!deletedComment) {
            return next(new ApiError(404, "Comment not found"));
        }

        return res.status(200).json(new ApiResponse(200, null, "Comment deleted successfully"));
    } catch (error) {
        return next(new ApiError(500, "Failed to delete comment"));
    }
});

export { getVideoComments, addComment, updateComment, deleteComment };
