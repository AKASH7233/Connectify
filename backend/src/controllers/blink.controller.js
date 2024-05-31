import {asyncHandler} from '../utils/asyncHandler.js'
import {ApiError} from '../utils/ApiError.js'
import {ApiResponse} from '../utils/apiResponse.js'
import { Blink } from '../models/blink.model.js'
import { ApiErrResponse } from '../utils/ApiErrResponse.js'
import { uploadToCloudinary } from '../utils/cloudinary.js'
import { Follow } from '../models/follow.model.js'
import mongoose from 'mongoose'

const createBlink = asyncHandler(async(req,res)=>{
   
    try {
        const {title,heading,value} = req.body;
        
        const BlinkLocalPath = req.file?.path

        if(!BlinkLocalPath){
            throw new ApiError(400,'Img/video is required !!')
        }

        let publishedBlink;

        if(!title && !BlinkLocalPath){
            throw new ApiError(`Blink can't be empty !`)
        }

        if(BlinkLocalPath){
            publishedBlink = await uploadToCloudinary(BlinkLocalPath)
        }

        const blink = await Blink.create({
            user: req.user._id,
            title,
            file: publishedBlink?.url || '',
            link:{heading,value}
        })
    
        if(!blink){
            throw new ApiError(500,'Failed to upload Blink !!')
        }

        return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                blink,
                'Blink Uploaded SuccessFully!!'
            )
        )
    } catch (error) {
        return res.json(
            new ApiErrResponse(error)
        )
    
    }
    
})

const deleteBlink = asyncHandler(async(req,res)=>{
    try {
        const {blinkId} = req.params
    
        if(!blinkId){
            throw new ApiError(401,'Invalid blinkId !!')
        }
    
        const blink = await Blink.deleteOne({
            _id : blinkId,
            user: req.user?._id
        })
    
        if(!blink){
            throw new ApiError(500,'Failed to Delete Blink!!')
        }
    
        return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {},
                'Blink deleted SuccessFully'
            )
        )
    } catch (error) {
        return res.json(
            new ApiErrResponse(error)
        )
    }

})

const deleteAllBlink = asyncHandler(async(req,res)=>{
   try {
     const blink = await Blink.deleteMany({
         user: req.user?._id
     })
 
     if(!blink){
         throw new ApiError(500, `Failed to delete all blinks !!`)
     }
 
     return res
     .status(200)
     .json(
         new ApiResponse(
             200,
             {},
             'All Blinks deleted SuccessFully !!'
         )
     )
   } catch (error) {
        return res.json(
            new ApiErrResponse(error)
        )
   }
})

const myBlink = asyncHandler(async(req,res)=>{
    try {
        const blink = await Blink.find({
            user: req.user._id
        })
        console.log(blink);
        if(!blink){
            throw new ApiError(500,`Failed to Fetch Blinks !!`)
        }
    
        return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                blink,
                'Blinks Fetched SuccessFully'
            )
        )
    } catch (error) {
        return res.json(
            new ApiErrResponse(error)
        )
    }
})

const getBlink = asyncHandler(async(req,res)=>{
   
    try {
        const followings = await Follow.aggregate([
            {
                $match: {
                    followedBy : req.user._id
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
                    'followings._id':1,
                    _id:0
                }
            },
        ])
        
        const followingsIds = followings.map(followings => followings.followings._id)
        
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
       
        const blink = await Blink.aggregate([
            { $match: { user: { $in: followingsIds }, createdAt: { $gte: twentyFourHoursAgo } } },
            { $sort: { user: 1, createdAt: -1 } },
            {
                $lookup: {
                  from: 'users',
                  localField: 'user',
                  foreignField: '_id',
                  as: 'creatorDetails'
                }
              },
              { $unwind: '$creatorDetails' },
              {
                $group: {
                  _id: '$user',
                  username: { $first: '$creatorDetails.username' },
                  profileImage: { $first: '$creatorDetails.profileImage' },
                  stories: {
                    $push: {
                      title: '$title',
                      file: '$file',
                      link : '$link',
                      createdAt: '$createdAt'
                    }
                  }
                }
              },
              {
                $project: {
                  _id: 1,
                  username: 1,
                  profileImage: 1,
                  stories: 1
                }
            },
          ]);

        console.log(`blink`,blink);
      
       return res.status(200).json(
            new ApiResponse(
                200,
                blink,
                'Blinks Fetched SuccessFully'
            )
        )
    } catch (error) {
        new ApiErrResponse(error)
    }
})

const viewBlink = asyncHandler(async (req, res) => {
    try {
      const blink = await Blink.findById(req.params.id).populate('user','username').populate('viewers','username');
      console.log(blink);
  
      if (!blink) {
        throw new ApiErrResponse({ status: 404, message: 'blink not found!' });
      }
  
      const user = await User.findById(req.user._id);
        if (!blink.viewers.some(viewer => viewer._id.equals(user._id))) {
            blink.viewers.push(user);
            await blink.save();
        }
      return res.status(200).json(new ApiResponse(200, blink, 'Blink viewed successfully'));
    } catch (error) {
      return res.json(new ApiErrResponse(error));
    }
  });


export {
    createBlink,
    deleteBlink,
    deleteAllBlink,
    myBlink,
    getBlink,
    viewBlink
}