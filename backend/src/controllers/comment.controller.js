import {asyncHandler} from '../utils/asyncHandler.js'
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/apiResponse.js"
import { Comment } from '../models/comment.model.js'
import mongoose, { isValidObjectId } from 'mongoose'
import { User } from '../models/user.model.js'
import { Post } from '../models/post.model.js'


const showComments = asyncHandler( async(req,res,next)=>{
     try {
          const { postId } = req.params
          const skip = Number(req.query.skip) || 0 // to fetch the comments from the given index

          if (!isValidObjectId(postId)) {
               throw next(new ApiError(400, "Invalid PostID"))
          }

          const post = await Post.findById(postId)

          if (!post) {
               throw next(new ApiError(500, "Failed to find Post"))
          }

          const comments = await Comment.find({ post: postId })
               .populate("commentedBy", "username fullName ProfileImage")
               .sort({ createdAt: -1 })
               .skip(skip)
               .limit(20)

          //Todo: http://localhost:8000/api/v1/comment/showcomments/65bf7a791b0fe9d5822a9515

          // {
          //      "statuscode": 200,
          //           "data": [
          //                {
          //                     "_id": "65fc9b492fd97907e02e5ce1",
          //                     "post": "65bf7a791b0fe9d5822a9515",
          //                     "comment": "damdoar",
          //                     "commentedBy": {
          //                          "_id": "65fc9103595e192e82d10aae",
          //                          "username": "damodar1",
          //                          "fullName": "damodar",
          //                          "email": "damodar@gmail.com"
          //                     },
          //                     "createdAt": "2024-03-21T20:40:41.504Z",
          //                     "updatedAt": "2024-03-21T20:40:41.504Z",
          //                     "__v": 0
          //                }, ... similar objects
          //           ],
          //           "message": "Comments Fetched Successfully"
          // }


          return res
               .status(200)
               .json(
                    new ApiResponse(
                         200,
                         comments,
                         "Comments Fetched Successfully"
                    )
               )
     } catch (error) {
          return next(new ApiError(500, "Failed to load the Comments"))
     }

})


// {
// "statuscode": 201,
// "data": {
// "post": "65bf7a791b0fe9d5822a9515",
// "comment": "damdoar",
// "commentedBy": {
// "_id": "65fc9103595e192e82d10aae",
// "username": "damodar1",
// "fullName": "damodar",
// "email": "damodar@gmail.com",
// "password": "$2b$08$GFCiAk3I9EKoIMYBhCaQ.uBr1kyt1mxeyY2heLawOo0qE.Pfb8B8W",
// "coverImage": null,
// "ProfileImage": null,
// "posts": [],
// "createdAt": "2024-03-21T19:56:51.883Z",
// "updatedAt": "2024-03-21T20:27:38.967Z",
//      "__v": 0,
//           "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NWZjOTEwMzU5NWUxOTJlODJkMTBhYWUiLCJpYXQiOjE3MTEwNTI4NTgsImV4cCI6MTcxMTkxNjg1OH0.tr7GLmMih_UE0PaCfznYLBPSa72xAJCdN5rrR7I2bQY"
// },
// "_id": "65fc9b492fd97907e02e5ce1",
// "createdAt": "2024-03-21T20:40:41.504Z",
// "updatedAt": "2024-03-21T20:40:41.504Z",
// "__v": 0
// },
// "message": "Comment added successfully !!"
// }
const postComment = asyncHandler( async(req,res)=>{
    const {postId} = req.params;
    const {comment} = req.body;
    console.log(comment);

    if(!comment){
         throw new ApiError(400, "Comment is Required")
     }

   if(!isValidObjectId(postId)){
    throw new ApiError(400, "Invalid PostID")
   }

   const post = await Post.findById(postId)

   if(!post){
        throw new ApiError(500,"Failed to find Post")
   }


   const comments = await Comment.create({
        post: postId,
        comment,
        commentedBy : req.user._id
   })
   console.log(comments)

   return res
   .status(200)
   .json(
    new ApiResponse(
            201,
            comments,
            "Comment added successfully !!"
        )
   )
});


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
                         comment: newComment,
                         isEdit : true
                    }
               },
               {new:true}
          )
     }
     console.log(editedcomment);
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

const replyToComment = asyncHandler(async(req,res)=>{
     const {commentId} = req.params
     const {comment} = req.body
     if(!commentId){
          throw new ApiError(400,"Invalid Comment Id")
     }

     if(!comment){
          throw new ApiError(400,"Comment is required !")
     }

     const comments = await Comment.create({
          post : commentId,
          comment,
          commentedBy : req.user._id
     })
     console.log(comments)
  
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

const showReplyComments = asyncHandler(async (req,res,next)=>{
     try {
          const { commentId } = req.params
          const skip = Number(req.query.skip) || 0 // to fetch the comments from the given index
          console.log(commentId);
          if (!isValidObjectId(commentId)) {
               throw next(new ApiError(400, "Invalid commentId"))
          }

          const comment = await Comment.findById(commentId)

          if (!comment) {
               throw next(new ApiError(500, "Failed to find comment"))
          }

          const comments = await Comment.find({ post: commentId })
               .populate("commentedBy", "username fullName ProfileImage")
               .sort({ createdAt: -1 })
               .skip(skip)

          //Todo: http://localhost:8000/api/v1/comment/showcomments/65bf7a791b0fe9d5822a9515

          // {
          //      "statuscode": 200,
          //           "data": [
          //                {
          //                     "_id": "65fc9b492fd97907e02e5ce1",
          //                     "post": "65bf7a791b0fe9d5822a9515",
          //                     "comment": "damdoar",
          //                     "commentedBy": {
          //                          "_id": "65fc9103595e192e82d10aae",
          //                          "username": "damodar1",
          //                          "fullName": "damodar",
          //                          "email": "damodar@gmail.com"
          //                     },
          //                     "createdAt": "2024-03-21T20:40:41.504Z",
          //                     "updatedAt": "2024-03-21T20:40:41.504Z",
          //                     "__v": 0
          //                }, ... similar objects
          //           ],
          //           "message": "Comments Fetched Successfully"
          // }


          return res
               .status(200)
               .json(
                    new ApiResponse(
                         200,
                         comments,
                         "Comments Fetched Successfully"
                    )
               )
     } catch (error) {
          return next(new ApiError(500, "Failed to load the Comments"))
     }

})

export {
    postComment,
    editComment,
    deleteComment,
    showComments,
    replyToComment,
    showReplyComments
}