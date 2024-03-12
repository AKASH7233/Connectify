import {asyncHandler} from '../utils/asyncHandler.js'
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/apiResponse.js"
import { Comment } from '../models/comment.model.js'
import mongoose, { isValidObjectId } from 'mongoose'
import { User } from '../models/user.model.js'
import { Post } from '../models/post.model.js'

const postComment = asyncHandler( async(req,res)=>{
    const {postId} = req.params;
    const {comment} = req.body;

   if(!isValidObjectId(postId)){
    throw new ApiError(400, "Invalid PostID")
   }

   const post = await Post.findById(postId)

   if(!post){
        throw new ApiError(500,"Failed to find Post")
   }

   if(!comment){
        throw new ApiError(400, "Comment is Required")
    }

   const commentedBy = await User.findById(req.user._id).select("username")

   if(!commentedBy){
    throw new ApiError(401, "Unauth request")
   }

   const comments = await Comment.create({
        post: postId,
        comment,
        commentedBy
   })

   if(!comments) {
        throw new ApiError(500, "Failed to add Comment")
   }

   return res
   .status(200)
   .json(
    new ApiResponse(
            201,
            comments,
            "Comment added successfully !!"
        )
   )
})

const editComment = asyncHandler( async(req,res)=>{
     const {newComment} = req.body
     const {commentId} = req.params
     if (!newComment) {
          throw new ApiError(400, "comment should be filled")
     }

     const usersComment = await Comment.aggregate([
          {
               $match:{
                    commentedBy : req.user._id,
                    _id: new mongoose.Types.ObjectId(commentId)
               }
          },
     ])

     let editedcomment
     if(!usersComment){
          throw new ApiError(400, "commentId is invalid")
     }
     else{
          editedcomment = await Comment.findByIdAndUpdate(
               commentId,
               {
                    $set:{
                         comment: newComment
                    }
               },
               {new:true}
          )
     }

     return res
     .status(200)
     .json(
          new ApiResponse(
               200,
               editedcomment,
               "comment edited Successfully"
          )
     )
})

const deleteComment = asyncHandler( async(req,res)=>{
     const {commentId} = req.params
     const usersComment = await Comment.aggregate([
          {
               $match:{
                    $or: [{commentedBy : req.user._id}],
                    _id: new mongoose.Types.ObjectId(commentId)
               }
          },
     ])

     if(!usersComment){
          throw new ApiError(400, "commentId is invalid")
     }
     else{
          await Comment.findByIdAndDelete(commentId)
     }

     return res
     .status(200)
     .json(
          new ApiResponse(
               200,
               {},
               "Comment Deleted Successfully !!"
          )
     )

})

export {
    postComment,
    editComment,
    deleteComment
}