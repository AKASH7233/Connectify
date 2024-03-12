import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Follow } from "../models/follow.model.js";
import mongoose from "mongoose";

const toggleFollow = asyncHandler( async(req,res)=>{
    const {userTofollow} = req.params;
    const userId = req.user._id;

    const followed = await Follow.findOne({
        followedTo : userTofollow,
        followedBy: userId
    })

    console.log(followed);

    if(!followed){
        const createfollowreq = await Follow.create({
            followedTo : userTofollow,
            followedBy: userId
        })
        return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                createfollowreq,
                "Followed"
            )
        )
    }
    else{
        const unFollow = await Follow.findOneAndDelete({
            followedTo : userTofollow,
            followedBy: userId
        })
        return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                unFollow,
                "Unfollow"
            )
        )
    }
})

const Followers = asyncHandler( async(req,res)=>{
    const {followedTo} = req.params;
    
    if(!followedTo){
        throw new ApiError(400, "Followed id does not exist")
    }

    const follower = await Follow.aggregate([
        {
            $match: {
                followedTo : new mongoose.Types.ObjectId(followedTo)
            }
        },
        {
            $group:{
                _id: "followedTo",
                followers: {$push: req?.user._id}
            }
        },
        {
            $unwind : '$followedBy'
        },
        {
            $project:{
                _id:0,
                followers: 1
            }
        }
    ])

    console.log(follower);
    if(!follower || follower.length === 0 ){
        return res
        .status(200)
        .json(new ApiResponse(200, [], "No subscribers found for the channel"));

    }

    console.log(`followers`, follower)
    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            follower,
            "Followers List Fetched succesfully !!"
        )
    )
})

const following = asyncHandler( async(req,res)=>{
    const {followingTo} = req.params;
    
    console.log(followingTo);
    if(!followingTo){
        throw new ApiError(400,"Invalid Following Id")
    }

    const followings = await Follow.aggregate([
        {
            $match: {
                followedBy : new mongoose.Types.ObjectId(req?.user?._id)
            }
        },
        {
            $group:{
                _id:"followedBy",
                following: {$push:"$followedBy"}
            }
        },
        {
            $project:{
                _id: 0,
                following:1
            }
        }
    ])

    if(!followings || followings.length === 0 ){
        return res
        .status(200)
        .json(new ApiResponse(200, [], "No subscribers found for the channel"));

    }

    console.log(`following`, followings);
    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            followings,
            "Following List Fetched succesfully !!"
        )
    )
})

export {
    toggleFollow,
    Followers,
    following
}