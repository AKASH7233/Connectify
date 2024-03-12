import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from 'jsonwebtoken'

export const verifyJWT = asyncHandler( async (req,res,next) => {

    try {
        const token = req?.cookies?.accessToken || req?.header("Authorization")?.replace( "Bearer ", "")

        if(!token){
            throw new ApiError(401, "Unauthorized user")
        }

        const decryptedToken = jwt.verify(token , process.env.ACCESS_TOKEN_SECRET)

        if(!decryptedToken){
            throw new ApiError(500, "failed to auth user")
        }

        const user = await User.findById(decryptedToken?._id)

        if(!user){
            throw new ApiError(401, "Invalid Access Token")
        }

        req.user = user;
    } catch (error) {
        return res.json({
            "statuscode": error.statuscode,
            "error" : error.message
        })
    }
    
    next();



})