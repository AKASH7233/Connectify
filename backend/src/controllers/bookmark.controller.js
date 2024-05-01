import {asyncHandler} from '../utils/asyncHandler.js'
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/apiResponse.js"
import { Like } from '../models/likes.model.js'
import  mongoose, { isValidObjectId } from 'mongoose'
import { ApiErrResponse } from '../utils/ApiErrResponse.js'
import { BookMark } from '../models/bookmark.model.js'
 

const toggleBookmark = asyncHandler(async(req,res)=>{
    const userId = req?.user?._id
    const {postId} = req.params
    console.log(postId);
    let bookMarked;
    let unBookMarked;

    let alreadyBooked = await BookMark.findOne({
        post : postId,
        bookedBy : userId
    })

    if(alreadyBooked){
        unBookMarked = await BookMark.deleteOne({
            post: postId,
            bookedBy : userId
        })

        if(!unBookMarked){
            throw new ApiError(500, "Failed To remove Bookmark !")
        }
    }
    else{
        bookMarked = await BookMark.create({
            post : postId,
            bookedBy : userId
        })
        if(!bookMarked){
            throw new ApiError(500 , "Failed To Add BookMark !!")
        }
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {},
                `User ${bookMarked ? "Added BookMark" : "Bookmark removed"} for post successfully !!`
            )
         )
})

const bookMarkedPost = asyncHandler(async (req,res)=>{
    const {postId} = req.params;

    const IsBookMark = await BookMark.aggregate([
        {
            $match: {
                post : new mongoose.Types.ObjectId(postId)
            }
        },
        {
            $group : {
             _id : 'booked',
             booked : {
                 $push : '$bookedBy'
             }
            }
         },
         {
             $addFields: {
                 isBooked : {
                     $cond: {
                         if: {$in: [req.user?._id, "$booked"]},
                         then: true,
                         else: false
                     }
                 }
             }
         },{
             $project:{
                 'isBooked' : 1
             }
         }
    ])

    // console.log(IsBookMark);
    return res
    .status(200)
    .json(
        new ApiResponse(
            200,IsBookMark, ''
        )
    )
})

const AllBookedPost = asyncHandler(async(req,res)=>{
    
    const allBookedPost = await BookMark.aggregate([
        {
            $match : {
                bookedBy : new mongoose.Types.ObjectId(req?.user?._id)
            }
        },
        {
            $lookup: {
                from: 'posts',
                localField: 'post',
                foreignField: '_id',
                as: 'BookedPost'

            }
        },
        {
            $project : {
                '_id':0,
                'BookedPost._id' : 1,
                'BookedPost.postFile' : 1,
            }
        }
    ])

    // console.log(allBookedPost);

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            allBookedPost,
            ''
        )
    )
})

export {
    toggleBookmark,
    bookMarkedPost,
    AllBookedPost
}