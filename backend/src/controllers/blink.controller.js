import {asyncHandler} from '../utils/asyncHandler.js'
import {ApiError} from '../utils/ApiError.js'
import {ApiResponse} from '../utils/apiResponse.js'
import { Blink } from '../models/blink.model.js'
import { ApiErrResponse } from '../utils/ApiErrResponse.js'
import { uploadToCloudinary } from '../utils/cloudinary.js'
import { Follow } from '../models/follow.model.js'
import mongoose from 'mongoose'
import { User } from '../models/user.model.js'

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
                      _id : '$_id',
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

const viewersOfBlink = asyncHandler(async (req, res) => {
    try {
        const {id} = req.params
        console.log(id);
        if(!id){
            throw new ApiError(400,'Invalid Blink Id!!')
        }

        const Viewers = await Blink.aggregate([
            {
                $match :{
                    _id : new mongoose.Types.ObjectId(id)
                }
            },
            {
                $lookup : {
                    from: "users",
                    localField: "viewer",
                    foreignField: "_id",
                    as: "viewers",
                }
            }
        ])
        console.log(Viewers);
    } catch (error) {
      return res.json(new ApiErrResponse(error));
    }
});

const BlinkViewed = asyncHandler(async (req, res) => {
    try {
        const { blinkId } = req.params;

        console.log(`blinkId`, blinkId);
        if (!blinkId) {
            throw new ApiError(400, 'Invalid Blink Id !!');
        }

        const user = await User.findById(req.user._id).select('username profileImage _id');
        console.log(user);
        if (!user) {
            throw new ApiError(404, 'User not found !!');
        }

        const blink = await Blink.findById(blinkId);

        console.log(`blink in blinkViewed: ${blink}`)
        if (!blink) {
            throw new ApiError(404, 'Blink not found !!');
        }

        // Check if the user is already in the viewers array
        const userAlreadyViewed = blink.viewer.some(viewer => viewer._id == req.user._id);

        console.log(userAlreadyViewed);
        if (!userAlreadyViewed) {
            blink.viewers.push(user);
            blink.save();
        }

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    {},
                    'Blink Viewed Successfully!!'
                )
            );
    } catch (error) {
        return res.status(200).json(
            new ApiErrResponse(error)
        );
    }
});


const currentBlinks = asyncHandler(async (req,res)=>{
    try {
        const currentDate = new Date();
        const twentyFourHoursAgo = new Date(currentDate.getTime() - (24 * 60 * 60 * 1000));
    
        const blink = await Blink.aggregate([
            { $match: { user: req.user?._id , createdAt: { $gte: twentyFourHoursAgo } } },
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
                      id : '$_id',
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
        console.log(`currentBlink`, blink);
    
        return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                blink,
                'currentBlink Fetched !!'
            )
        )
    } catch (error) {
        return res
        .json(
            new ApiErrResponse(error)
        )
    }
})

export {
    createBlink,
    deleteBlink,
    deleteAllBlink,
    myBlink,
    getBlink,
    viewersOfBlink,
    currentBlinks,
    BlinkViewed
}