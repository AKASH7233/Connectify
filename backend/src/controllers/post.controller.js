import { asyncHandler } from "../utils/asyncHandler.js";
import { Post } from "../models/post.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";
import { User } from "../models/user.model.js";
import mongoose, { isValidObjectId } from "mongoose";
import { ApiErrResponse } from "../utils/ApiErrResponse.js";

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

    // console.log(getAllposts);
    return res.status(200)
    .json(
        new ApiResponse(
            200,
            getAllposts,
            "Get all Post"
        )
    )
    
})

const uploadPost = asyncHandler( async(req,res)=>{
        try {
            const {title} = req.body
            if(!title){
                throw new ApiError(401, "Title is Required")
            }
            if(!req.files){
                throw new ApiError(401, "Please upload a File")
            }
            console.log(req?.files);

            const fileKeys = Object.keys(req.files);
            const uploadedFiles = [];
    
            for (const key of fileKeys) {
                const file = req.files[key];
    
                if (!Array.isArray(file)) {
                    throw new ApiError(400, "Invalid file format.");
                }
    
                for (const singleFile of file) {
                    const filePath = singleFile.path;
                    const cloudinaryResponse = await uploadToCloudinary(filePath);
    
                    if (!cloudinaryResponse || !cloudinaryResponse.url) {
                        throw new ApiError(500, "Failed to upload file to Cloudinary.");
                    }
    
                    uploadedFiles.push(cloudinaryResponse.url);
                }
            }
            console.log(uploadedFiles);
            // let postLocalPath = []
            // req?.files?.postFile.map((file)=>(
            //    postLocalPath.push(file.path)
            // ));
            // console.log(postLocalPath);
            // if(!postLocalPath){
            //     throw new ApiError(401, "Post should contain a Image/Video")
            // }
            
            // const postFile = []
            // for (const filePath of postLocalPath) {
            //     const uploadedFile = await uploadToCloudinary(filePath);
            //     if (!uploadedFile || !uploadedFile.url) {
            //         throw new ApiError(500, "Failed To upload post-file");
            //     }
            //     postFile.push(uploadedFile.url);
            // }
        
            if(!uploadedFiles){
                throw new ApiError(500, "Failed To upload post-file")
            }
        
            // const isPublished = true
        
            const postedBy = await User.findById(req.user._id).select("username ProfileImage")

            // console.log(postedBy);
            // console.log(postFile.url);
            const post = await Post.create({
                title,
                postFile : uploadedFiles,
                postedBy,
                isPublished: true,
            })
        
            if(!post){
                throw new ApiError(500,"Failed to Upload Post")
            }
            
            // const user = await User.findById(req.user._id)
        
            // user.posts.push(await post.populate())
            // user.save({validateBeforeSave : false})
        
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
                title:title,
                isEdit : true
            }
        },
        {new: true}
    )

    console.log(`post`,post);
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

const togglehidePost = asyncHandler( async(req,res)=>{
    const {postId} = req.params 

    if(!isValidObjectId(postId)){
        throw new ApiError(401,'Invalid Post Id !!')
    }

    let AlreadyHidden = await Post.findOne({
        _id: postId,
        isPublished : false
    })

    let hidden;
    let unhidden;

    if(!AlreadyHidden){
        hidden = await Post.findByIdAndUpdate(
            postId,
            {
                $set: {
                    isPublished : false
                }
            },
            {new : true}
        )
        if(!hidden){
            throw new ApiError(501,"Failed to hide the post")
        }
    }else{
        unhidden =  await Post.findByIdAndUpdate(
            postId,
            {
                $set: {
                    isPublished : true
                }
            },
            {new :true}
        )
        if(!unhidden){
            throw new ApiError(501,"Failed to unhide the post")
        }
    }

    console.log('hide',hidden);
    console.log('unhide',unhidden);
    
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {},
                `post ${hidden ? "hidden" : "unhiden"} successfully !!`
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

const visitedPost = asyncHandler(async (req,res)=>{
    const {postId} = req.params

    if(!postId){
        throw new ApiError('Invalid PostID')
    }

    const post = await Post.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(postId)
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
    console.log(post);
    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            post,
            'Visited Post'
        )
    )
})

const myPosts = asyncHandler(async (req,res)=>{
    const {userId} = req.params
    let posts = await Post.find({
        postedBy : userId,
        isPublished: true
    })

    return res
    .json(
        new ApiResponse(200,posts,'post Fetch SuccessFully !')
    )
})

const hiddenPost = asyncHandler(async (req,res)=>{
    const posts = await Post.find({
        postedBy: req?.user?._id,
        isPublished: false
    })

    return res
    .json(
        new ApiResponse (200, posts, 'Fetched Hidden Posts') 
    )
})

export {
    uploadPost,
    updatePostTitle,
    deletePost,
    showPosts,
    togglehidePost,
    showPostLikes,
    postComments,
    visitedPost,
    myPosts,
    hiddenPost
}