import mongoose, { isValidObjectId } from "mongoose";
import { User } from "../models/user.model.js";
import { Subscription } from "../models/subscription.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Toggle subscription (subscribe/unsubscribe)
const toggleSubscription = asyncHandler(async (req, res) => {
    const { channelId } = req.params;
    const userId = req.user.id;  // Assuming `userId` is in the JWT payload

    if (!isValidObjectId(channelId)) {
        throw new ApiError(400, "Invalid channel ID");
    }

    // Check if user is already subscribed to the channel
    const existingSubscription = await Subscription.findOne({ user: userId, channel: channelId });

    if (existingSubscription) {
        // If subscription exists, unsubscribe
        await existingSubscription.delete();
        return res.status(200).json(new ApiResponse(200, null, "Unsubscribed from channel"));
    }

    // If subscription does not exist, subscribe
    const newSubscription = new Subscription({
        user: userId,
        channel: channelId,
    });

    await newSubscription.save();
    return res.status(200).json(new ApiResponse(200, newSubscription, "Subscribed to channel"));
});

// Get all subscribers of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const { channelId } = req.params;

    if (!isValidObjectId(channelId)) {
        throw new ApiError(400, "Invalid channel ID");
    }

    // Find all subscriptions where the channel is the subscribed channel
    const subscribers = await Subscription.find({ channel: channelId }).populate('user', 'name email'); // Assuming you're populating user details

    return res.status(200).json(new ApiResponse(200, subscribers, "Channel subscribers fetched"));
});

// Get all channels a user has subscribed to
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params;

    if (!isValidObjectId(subscriberId)) {
        throw new ApiError(400, "Invalid subscriber ID");
    }

    // Find all subscriptions for the user and populate channel details
    const subscriptions = await Subscription.find({ user: subscriberId }).populate('channel', 'name description'); // Assuming you're populating channel details

    return res.status(200).json(new ApiResponse(200, subscriptions, "Subscribed channels fetched"));
});

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels,
};
