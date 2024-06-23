import {asyncHandler} from '../utils/asyncHandler.js'
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/apiResponse.js"
import { Like } from '../models/likes.model.js'
import  mongoose, { isValidObjectId } from 'mongoose'
import { ApiErrResponse } from '../utils/ApiErrResponse.js'
 

const toggleLike = asyncHandler( async(req,res)=>{
    try {
        const {postId} = req.params
    
        if(!isValidObjectId(postId)){
            throw new ApiError(400, "Post Id is not Valid")
        }
    
        const postliked = await Like.findOne({
            post : postId,
            likedBy : req.user?._id
        })
    
        let like;
        let unlike;
    
        if(postliked){
            unlike = await Like.deleteOne({
                post: postId,
                likedBy : req.user?._id
            })
            if(!unlike){
                throw new ApiError(500, "Failed To unlike the post")
            }
        }
        else{
            like = await Like.create({
                post: postId,
                likedBy: req.user?._id
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
        const {userId} = req.params
        // console.log(userId);
        const likedPosts = await Like.aggregate([
            {
                $match:{
                    likedBy: new mongoose.Types.ObjectId(userId)
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
                'users._id':1,
                'users.username': 1,
                'users.ProfileImage': 1,
                isLiked: 1
            }
        },

    ])

    const isliked = await Like.aggregate([
        {
            $match : {
                post: new mongoose.Types.ObjectId(postId)
            }
        },
        {
            $group: {
                _id: 'likes',
                likedBy: {
                    $push: '$likedBy'
                }
            }
        },
        {
            $addFields: {
                isLiked : {
                    $cond: {
                        if: {$in: [req.user?._id, "$likedBy"]},
                        then: true,
                        else: false
                    }
                }
            }
        },{
            $project:{
                'isLiked' : 1
            }
        }
    ])
    // console.log(`likedBy`,isliked);
    return res
    .status(200)
    .json(
        new ApiResponse(200,{likedUsers,isliked},"liked users")
    )
})

const toggleCommentsLike = asyncHandler( async(req,res)=>{
    try {
        const {CommentId} = req.params
    
        if(!isValidObjectId(CommentId)){
            throw new ApiError(400, "comment Id is not Valid")
        }
    
        const commentLiked = await Like.findOne({
            comment : CommentId,
            likedBy : req.user?._id
        })
    
        let like;
        let unlike;
    
        if(commentLiked){
            unlike = await Like.deleteOne({
                comment: CommentId,
                likedBy : req.user?._id
            })
            if(!unlike){
                throw new ApiError(500, "Failed To unlike the comment")
            }
        }
        else{
            like = await Like.create({
                comment: CommentId,
                likedBy: req.user?._id
            })
    
            if(!like){
                throw new ApiError(
                    500,
                    "something went wrong while liking the comment !!"
                )
            }
        }
        return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {},
                `User ${like ? "like" : "unlike"} Comment successfully !!`
            )
         )
    } catch (error) {
       return res.json(
        new ApiErrResponse(error)
       )   
    }
})

const commentLiked = asyncHandler( async(req,res)=>{
    console.log();
    const {CommentId} = req.params

    if(!CommentId){
        throw new ApiError(401,'Invalid commentID')
    }

    const likedUsers = await Like.aggregate([
        {
            $match: {
                comment: new mongoose.Types.ObjectId(CommentId)
            },
        },
        {
            $group:{
                _id:'comment',
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
                isLiked: 1
            }
        },

    ])

    const isliked = await Like.aggregate([
        {
            $match : {
                comment: new mongoose.Types.ObjectId(CommentId)
            }
        },
        {
            $group: {
                _id: 'likes',
                likedBy: {
                    $push: '$likedBy'
                }
            }
        },
        {
            $addFields: {
                isLiked : {
                    $cond: {
                        if: {$in: [req.user?._id, "$likedBy"]},
                        then: true,
                        else: false
                    }
                }
            }
        },{
            $project:{
                'isLiked' : 1
            }
        }
    ])
    
    return res
    .status(200)
    .json(
        new ApiResponse(200,{likedUsers,isliked},"liked users")
    )
})

export {
    toggleLike,
    likedPosts,
    userLiked,
    toggleCommentsLike,
    commentLiked,
}