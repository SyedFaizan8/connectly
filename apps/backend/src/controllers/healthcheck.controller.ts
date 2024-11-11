import { Request, Response, NextFunction } from "express";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";

// Healthcheck endpoint to verify if the server is running
const healthcheck = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
        return res.status(200).json(new ApiResponse(200, null, "OK"));
    } catch (error) {
        return next(new ApiError(500, "Failed to perform healthcheck"));
    }
});

export { healthcheck };
