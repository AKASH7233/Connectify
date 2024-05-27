import {asyncHandler} from '../utils/asyncHandler.js'
import {ApiError} from '../utils/ApiError.js'
import {ApiResponse} from '../utils/apiResponse.js'
import { Blink } from '../models/blink.model.js'
import { ApiErrResponse } from '../utils/ApiErrResponse.js'
import { uploadToCloudinary } from '../utils/cloudinary.js'

const createBlink = asyncHandler(async(req,res)=>{
   
    try {
        const {title,heading,value} = req.body;
        
        const BlinkLocalPath = req.file?.path
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

export {
    createBlink,
    deleteBlink,
    deleteAllBlink,
    myBlink
}