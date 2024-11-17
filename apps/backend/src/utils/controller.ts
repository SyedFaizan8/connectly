import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import { User } from "../models/user.model";
import { ApiError } from "./ApiError";
import { asyncHandler } from "./asyncHandler";
import { ApiResponse } from "./ApiResponse";

// Generate access and refresh tokens
export const generateAccessAndRefereshTokens = async (userId: string) => {
    try {

        // change below to make prisma call to find the user in the prisma postgres 
        const user = await User.findById(userId);
        if (!user) {
            throw new ApiError(404, "User not found");
        }

        // generate the accessToken and refreshToken by giving 
        const accessToken = generateAccessToken(userId);
        const refreshToken = generateRefreshToken(userId);


        // change below to make a prisma call to update refreshToken
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating refresh and access token");
    }
};

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10)
    next()
})

export const getCurrentUser = asyncHandler(async (req: Request, res: Response) => {
    return res.status(200).json(new ApiResponse(200, req.user, "User fetched successfully"));
});

export const generateAccessToken = function (_id: string) {
    return jwt.sign(
        {
            _id: _id,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

export const generateRefreshToken = (_id: string) => {
    return jwt.sign(
        {
            _id: _id,

        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}