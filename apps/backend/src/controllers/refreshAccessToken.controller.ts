import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import jwt from "jsonwebtoken";
import { generateAccessAndRefereshTokens } from "../utils/controller";
import { ApiResponse } from "../utils/ApiResponse";
import { User } from "../models/user.model";


export const refreshAccessToken = asyncHandler(async (req: Request, res: Response) => {

    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorized request");
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET!
        ) as { _id: string };

        // change it to prisma check
        const user = await User.findById(decodedToken._id);

        if (!user) {
            throw new ApiError(401, "Invalid refresh token");
        }

        if (incomingRefreshToken !== user.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used");
        }

        const options = {
            httpOnly: true,
            secure: true,
        };

        const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user._id);

        return res.status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(new ApiResponse(200, { accessToken, refreshToken: refreshToken }, "Access token refreshed"));

    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token");
    }
});