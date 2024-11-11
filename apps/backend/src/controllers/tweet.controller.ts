import mongoose, { isValidObjectId } from "mongoose";
import { Tweet } from "../models/tweet.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Create a new tweet
const createTweet = asyncHandler(async (req, res) => {
    const { content } = req.body;
    const userId = req.user.id; // Assuming the user ID comes from the JWT payload

    if (!content || content.trim() === "") {
        throw new ApiError(400, "Tweet content is required");
    }

    // Create a new tweet document
    const newTweet = new Tweet({
        user: userId,
        content,
    });

    await newTweet.save();

    return res.status(201).json(new ApiResponse(201, newTweet, "Tweet created successfully"));
});

// Get all tweets by a user
const getUserTweets = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid user ID");
    }

    // Get all tweets from the specified user
    const userTweets = await Tweet.find({ user: userId }).populate("user", "name username"); // Assuming user has name and username fields

    return res.status(200).json(new ApiResponse(200, userTweets, "User tweets fetched successfully"));
});

// Update an existing tweet
const updateTweet = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;
    const { content } = req.body;
    const userId = req.user.id; // Assuming user is authenticated and the ID is in the JWT payload

    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid tweet ID");
    }

    if (!content || content.trim() === "") {
        throw new ApiError(400, "Tweet content is required");
    }

    // Find the tweet by ID and ensure the user is the owner of the tweet
    const tweet = await Tweet.findOne({ _id: tweetId, user: userId });

    if (!tweet) {
        throw new ApiError(404, "Tweet not found or you do not have permission to update this tweet");
    }

    // Update the tweet content
    tweet.content = content;
    await tweet.save();

    return res.status(200).json(new ApiResponse(200, tweet, "Tweet updated successfully"));
});

// Delete a tweet
const deleteTweet = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;
    const userId = req.user.id; // Assuming user is authenticated and the ID is in the JWT payload

    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid tweet ID");
    }

    // Find the tweet and ensure the user is the owner
    const tweet = await Tweet.findOne({ _id: tweetId, user: userId });

    if (!tweet) {
        throw new ApiError(404, "Tweet not found or you do not have permission to delete this tweet");
    }

    // Delete the tweet
    await tweet.delete();

    return res.status(200).json(new ApiResponse(200, null, "Tweet deleted successfully"));
});

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet,
};
