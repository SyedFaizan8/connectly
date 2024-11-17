import { User } from "../models/user.model";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { Request, Response } from "express";
import bcrypt from "bcryptjs"

// Change current password
export const changeCurrentPassword = asyncHandler(async (req: Request, res: Response) => {
    const { oldPassword, newPassword } = req.body;

    //replace this with prisma postgres
    const user = await User.findById(req.user._id);
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    //replace this with prisma postgres
    const password = await User.findById(req.user.password);

    if (oldPassword != password) {
        throw new ApiError(404, "oldPassword is not correct");
    }

    const isPasswordCorrect = await bcrypt.compare(newPassword, password)

    if (!isPasswordCorrect) {
        throw new ApiError(400, "Invalid old password");
    }


    // replace this with prisma postgres update the password
    user.password = newPassword;
    await user.save({ validateBeforeSave: false });

    return res.status(200).json(new ApiResponse(200, {}, "Password changed successfully"));
});


// Update account details
export const updateAccountDetails = asyncHandler(async (req: Request, res: Response) => {
    const { email } = req.body;

    if (!email) {
        throw new ApiError(400, "All fields are required");
    }

    // replace this with prisma postgres
    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: { email },
        },
        { new: true }
    ).select("-password");

    return res.status(200).json(new ApiResponse(200, user, "Account details updated successfully"));
});

// Update user avatar
export const updateUserAvatar = asyncHandler(async (req: Request, res: Response) => {
    const avatarLocalPath = req.file?.path;

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is missing");
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);

    if (!avatar?.url) {
        throw new ApiError(400, "Error uploading avatar");
    }

    // replace this with prisma 
    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: { avatar: avatar.url },
        },
        { new: true }
    ).select("-password");

    return res.status(200).json(new ApiResponse(200, user, "Avatar updated successfully"));
});


