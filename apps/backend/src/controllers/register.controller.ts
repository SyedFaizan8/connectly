import { User } from "../models/user.model";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import { Request, Response } from "express";
import { uploadOnCloudinary } from "../utils/cloudinary";
import { ApiResponse } from "../utils/ApiResponse";

// Register a new user
export const registerUser = asyncHandler(async (req: Request, res: Response) => {
    const { fullName, email, password } = req.body;

    if ([fullName, email, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    // replace this with prisma postgres
    const existedUser = await User.findOne({
        $or: [{ email }],
    });

    if (existedUser) {
        throw new ApiError(409, "User with email already exists");
    }

    let avatarLocalPath;
    if (req.files?.avatar && Array.isArray(req.files.avatar) && req.files.avatar.length > 0) {
        avatarLocalPath = req.files.avatar[0].path;
    }

    const avatar = avatarLocalPath ? await uploadOnCloudinary(avatarLocalPath) : null;

    // replace this with prisma postgres
    const user = await User.create({
        fullName,
        avatar: avatar?.url || "",
        email,
        password,
    });

    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user");
    }

    return res.status(201).json(new ApiResponse(200, createdUser, "User registered successfully"));
});