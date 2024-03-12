import { asyncHandler } from "../utils/asyncHandler.js";
import { Post } from "../models/post.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";
import { User } from "../models/user.model.js";
import mongoose from "mongoose";
import { ApiErrResponse } from "../utils/apiErrResponse.js";

const showPosts = asyncHandler( async(_,res,next)=>{
    const getAllposts = await Post.aggregate([
        {
            $match: {
                isPublished: true
            }
        },
        {
            $lookup: {
              from: "users", 
              localField: "postedBy",
              foreignField: "_id",  
              as: "owner"  
            }
        },
        {
            $unwind: "$owner"
        },
        {
            $project:{
                "owner.password": 0,
                "owner.fullName": 0,
                "owner.email": 0,
                "owner.coverImage": 0,
                "owner.posts": 0,
                "owner.createdAt": 0,
                "owner.updatedAt": 0,
                "owner.refreshToken": 0,
            }
        }
    ])

    return res.status(200)
    .json(
        new ApiResponse(
            200,
            getAllposts,
            "Get all Post"
        )
    )
    
    next()
})

const uploadPost = asyncHandler( async(req,res)=>{
        try {
            const {title} = req.body
            if(!title){
                throw new ApiError(401, "Title is Required")
            }
            
            if(!req.files.postFile){
                throw new ApiError(401, "Please upload a File")
            }

            const postLocalPath = req?.files.postFile[0].path;
            
            if(!postLocalPath){
                throw new ApiError(401, "Post should contain a Image/Video")
            }
        
            const postFile = await uploadToCloudinary(postLocalPath)
        
            if(!postFile){
                throw new ApiError(500, "Failed To upload post-file")
            }
        
            const isPublished = true
        
            const postedBy = await User.findById(req.user._id).select("username ProfileImage")

            console.log(postedBy);
        
            const post = await Post.create({
                title,
                postFile : postFile.url,
                postedBy,
                isPublished,
            })
        
            if(!post){
                throw new ApiError(500,"Failed to Upload Post")
            }
            
        
            const user = await User.findById(req.user._id)
            
            user.posts.push(post)
            user.save({validateBeforeSave : false})
        
            return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    post,
                    "Post uploaded Successfully"
                )
            )
        } catch (error) {
            return res.json(
                new ApiErrResponse(error)
            )
        }
    
})

const updatePostTitle = asyncHandler( async(req,res)=>{
    const {title} = req.body
    const {postId} = req.params || req.body
    console.log(postId);
    
    if(!postId){
        throw new ApiError(500,"Failed to find Post !")
    }
    
    if(!title){
        throw new ApiError(401,"new Title is Required")
    }

    const post = await Post.findByIdAndUpdate(
        postId,
        {
            $set: {
                title
            }
        },
        {new: true}
    )

    console.log(post);
    if(!post){
        throw new ApiError(500,"Failed to update the Title")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            202,
            post,
            "Title updated Successfully"
        )
    )
})

const deletePost = asyncHandler( async(req,res)=>{
    const {postId} = req.params || req.body

    if(!postId){
        throw new ApiError(500,"Failed to find Post !")
    }

    await Post.findByIdAndDelete(
        postId  
    )

    return res
    .status(200)
    .json(
        new ApiResponse(202,{},"Post Deleted SuccessFully")
    )
})

const hidePost = asyncHandler( async(req,res)=>{
    const {postId} = req.params || req.body
    
    await Post.findByIdAndUpdate(
        postId,
        {
            $set: {
                isPublished : false
            }
        },
        {new : true}
    )

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {},
            "Post Hide Successfully"
        )
    )
})

const showPostLikes = asyncHandler( async(req,res)=>{
    const {postId} = req.params;
    
    if(!postId){
        throw new ApiError(400, "Invalid PostID")
    }
    const Postlikes = await Post.aggregate([
        {
           $match:{
            _id: new mongoose.Types.ObjectId(postId)
           }
        },
        {
            $lookup:{
                from: "likes",
                localField: "_id",
                foreignField: "post",
                as: "likes"
            }
        },
        {
            $addFields:{
                likedCount : {
                    $size : "$likes"
                },
                likedBy: "$likes.likedBy"
                
            }
        },
        {
            $project:{
                likedCount:1,
                likedBy:1,

            }
        }
        
    ])

    if (!Postlikes) {
        throw new ApiError(400,"Invalid Post ID")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            Postlikes,
            "Liked Users"
        )
    )
})

const postComments = asyncHandler( async(req,res)=>{
    const {postId} = req.params

    if(!postId){
        throw new ApiError(400,"postId is required")
    }

    const comments = await Post.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(postId)
            }
        },
        {
            $lookup:{
                from: "comments",
                localField:"_id",
                foreignField: "post",
                as: "comments"
            }
        },
        {
            $project:{
                comments:1
            }
        }
    ])

    if(!comments){
        throw new ApiError(400, "Invalid  Post Id")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            comments,
            "Post's comments Fetched successfully !!"
        )
    )
})

export {
    uploadPost,
    updatePostTitle,
    deletePost,
    showPosts,
    hidePost,
    showPostLikes,
    postComments
}