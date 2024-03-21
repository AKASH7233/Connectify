import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Follow } from "../models/follow.model.js";

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
    
    console.log(followedTo);
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
            $lookup:{
                from: "users",
                localField: "followedBy",
                foreignField: "_id",
                as: "followers",
            }
        },
        {
            $unwind: '$followers'
        },
        {
            $project:{
                _id:0,
                'followers.username': 1,
                'followers.fullName': 1,
                'followers.ProfileImage': 1
            }
        },
    ])

    console.log('followerss',follower);
    if(!follower || follower.length === 0 ){
        return res
        .status(200)
        .json(new ApiResponse(200, [], "No Followers found for the channel"));

    }

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
    const {followingBy} = req.params;
    
    console.log(followingBy);
    if(!followingBy){
        throw new ApiError(400,"Invalid Following Id")
    }

    const followings = await Follow.aggregate([
        {
            $match: {
                followedBy : new mongoose.Types.ObjectId(req?.user?._id)
            }
        },
        {
            $lookup:{
                from: "users",
                localField: "followedTo",
                foreignField: "_id",
                as: "followings",
            }
        },
        {
            $unwind: '$followings'
        },
        {
            $project:{
                _id:0,
                'followings.username': 1,
                'followings.fullName': 1,
                'followings.ProfileImage': 1
            }
        },
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