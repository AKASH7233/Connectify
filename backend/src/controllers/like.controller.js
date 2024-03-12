import {asyncHandler} from '../utils/asyncHandler.js'
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/apiResponse.js"
import { Like } from '../models/likes.model.js'
import  mongoose, { isValidObjectId } from 'mongoose'
import { User } from '../models/user.model.js'
import { ApiErrResponse } from '../utils/apiErrResponse.js'
import {Post} from '../models/post.model.js'
 

const toggleLike = asyncHandler( async(req,res)=>{
    try {
        const {postId} = req.params
        const post = await Post.findById(postId)
        const likedUser = await User.findById(req.user._id)
    
        if(!isValidObjectId(postId)){
            throw new ApiError(400, "Post Id is not Valid")
        }
    
        const postliked = await Like.findOne({
            likedBy : likedUser
        })
    
        let like;
        let unlike;
    
        if(postliked){
            unlike = await Like.deleteOne({
                likedBy : likedUser
            })
            if(!unlike){
                throw new ApiError(500, "Failed To unlike the post")
            }
        }
        else{
            like = await Like.create({
                post: post,
                likedBy: likedUser
            })
    
            if(!like){
                throw new ApiError(
                    500,
                    "something went wrong while like video !!"
                )
            }
        }
        return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {},
                `User ${like ? "like" : "unlike"} post successfully !!`
            )
         )
    } catch (error) {
       return res.json(
        new ApiErrResponse(error)
       )   
    }
})

const likedPosts = asyncHandler(async(req,res)=>{
try {
        const user_id = req?.user?._id
        const likedPosts = await Like.aggregate([
            {
                $match:{
                    likedBy: new mongoose.Types.ObjectId(user_id)
                }
            },
            {
               $lookup:{
                from:'posts',
                localField:'post',
                foreignField: '_id',
                as:'likedposts'
               }
            },
            {
                $unwind: '$likedposts'
            },
            {
               $match: {
                    "likedposts.isPublished" : true
               }
            },
            {
                $lookup:{
                    from: 'users',
                    let: { owner_id: "$likedposts.postedBy" },
                    pipeline: [
                    {
                        $match: {
                            $expr: {$eq : ['$_id', "$$owner_id"]}
                        }
                    },
                    {
                        $project: {
                            _id: 0,
                            username: 1,
                            ProfileImage: 1,
                            fullName: 1
                        }
                    }
                    ],
                    as:'owner'
                }
            },
            {
                $unwind: { path: "$owner", preserveNullAndEmptyArrays: true }
            },
            {
                $project: {
                    _id: "$likedposts._id",
                    title: "$likedposts.title",
                    post : "$likedposts.postFile",
                    owner: "$owner.username"
                }
            },
            {
                $group: {
                    _id: null,
                    likedposts: { $push: "$$ROOT" }
                },
            },
            {
                $unwind: '$likedposts'
            },
            {
                $project: {
                    _id: 0,
                    likedposts: 1
                }
            }
        ])
        // console.log(`likedposts`,likedPosts);
        return res
        .status(200)
        .json(new ApiResponse(200,likedPosts,"All liked Post"))
    } 
    catch (error) {
        return res.json(new ApiErrResponse(error))
    }
})

const userLiked = asyncHandler( async(req,res)=>{
    const {postId} = req.params

    if(!postId){
        throw new ApiError(401,'Invalid postId')
    }

    const likedUsers = await Like.aggregate([
        {
            $match: {
                post: new mongoose.Types.ObjectId(postId)
            },
        },
        {
            $group:{
                _id:'post',
                likedBy: {
                    $push : "$likedBy"
                }
            }
        },
        {
            $lookup:{
                from: 'users',
                localField: 'likedBy',
                foreignField: '_id',
                as: 'users'
            }
        },
        {
            $unwind: '$users'
        },
        {
            $project: {
                'users.username': 1,
                'users.ProfileImage': 1
            }
        },
        
    ])

    console.log(`likes`,likedUsers);
    return res
    .status(200)
    .json(
        new ApiResponse(200,likedUsers,"liked users")
    )

})

export {
    toggleLike,
    likedPosts,
    userLiked
}