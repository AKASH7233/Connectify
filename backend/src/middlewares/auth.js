import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from 'jsonwebtoken';
import logger from "../utils/logger.js"; // Assuming this import now points to the advanced logger setup



export const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        const token = req?.cookies?.accessToken || req?.header("Authorization")?.replace("Bearer ", "");
        logger.info(`token given by user: ${token}`)
        logger.info(`cookes: ${req.cookies}`);


        if (!token) {
            logger.error(`cookes: ${req.cookies}`, { error: new Error("No token provided") });
            logger.error("No token provided", { error: new Error("No token provided") });
            throw new ApiError(401, "Unauthorized user");
        }

        const decryptedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        if (!decryptedToken) {
            throw new ApiError(500, "Failed to authenticate user");
        }

        const user = await User.findById(decryptedToken?._id);

        if (!user) {
            throw new ApiError(401, "Invalid Access Token");
        }

        req.user = user;
    } catch (error) {
        // Use the advanced logger with error stack trace
        logger.error(`Authentication error: ${error.message}`, { error });
        return res.json({
            "statuscode": error.statuscode || 500,
            "error": error.message
        });
    }
    next();
});