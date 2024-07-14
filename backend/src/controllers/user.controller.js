import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/apiResponse.js"
import { User } from "../models/user.model.js"
import { uploadToCloudinary } from "../utils/cloudinary.js"
import jwt from "jsonwebtoken"
import { ApiErrResponse } from "../utils/ApiErrResponse.js"
import {Follow} from "../models/follow.model.js"
import mongoose from "mongoose"
import  logger  from '../utils/logger.js'
import path from "path"


const generateRefreshTokenAndAccessToken = async(userid) => {
    const user = await User.findById(userid)
    const accessToken =  user.generateAccessToken()
    const refreshToken =  user.generateRefreshToken()

    user.refreshToken = refreshToken
    await user.save({validateBeforeSave: false})
    console.log('accessToken',accessToken, 'refreshToken', refreshToken)
    return {accessToken, refreshToken}
}


const options = {
    // httpOnly: true,
    secure: true,
    sameSite: 'None', // Correct capitalization
    // domain: '.connectify-g8bt.onrender.com' // Ensure the domain is prefixed with a dot for broader applicability
};

const UserRegister = asyncHandler( async (req,res) => {
   
   try {
     const {fullName, email , username , password } = req.body
 
     if([fullName,email,username,password].some((field)=> field?.trim() === "")){
         throw new ApiError(400,'Every Field should be filled')
     }
 
     if(fullName.length < 3){
         throw new ApiError(401, 'FullName should have atleast 3 character')
     }
 
     if(password.length < 8){
         throw new ApiError(401, 'Password should have atleast 8 character')
     }
     
 
    if( await User.findOne({
     $or: [ {email}, {username} ]})){
         throw new ApiError(408, 'username and email already exists')
     }
 
     if(!email.includes('@' && '.com')){
         throw new ApiError(408,'email is invalid')
     }
 
     
     let ProfileImageLocalPath;
     if(req.files && Array.isArray(req.files.ProfileImage) && req.files.ProfileImage.length >0 ){
         ProfileImageLocalPath =  req.files?.ProfileImage[0]?.path;
     }
 
     let coverImageLocalPath;
     if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length >0 ){
         coverImageLocalPath =  req.files?.coverImage[0]?.path;
     }
 
 
     const ProfileImage = await uploadToCloudinary(ProfileImageLocalPath)
     const coverImage = await uploadToCloudinary(coverImageLocalPath)
 
 
     const user = await User.create({
         username: username.toLowerCase(),
         fullName,
         email,
         ProfileImage : ProfileImage?.url || null,
         coverImage : coverImage?.url || null ,
         password,
     })
 
     const createdUser = await User.findById(user._id).select(
         '-password -refreshToken'
     )
 
     if(!createdUser){
         throw new ApiError(500, 'registering Failed')
     }
 
     return res.status(201).json(
         new ApiResponse(200, createdUser , 'User Registered successfully')
     )
   } catch (error) {
        return res.json(
            new ApiErrResponse(error)
        )
   }
})  

const userLogin = asyncHandler(async (req, res, next) => {
    try {
        const { username, email, password } = req.body;

        if ([email, username, password].some((field) => field?.trim() === "")) {
            logger.warn(`Login attempt with missing fields: ${JSON.stringify({ username, email })}`);
            throw new ApiError(400, 'Every Field should be filled');
        }

        const user = await User.findOne({
            $or: [
                { username }, { email }
            ]
        });

        if (!user) {
            logger.warn(`Login attempt for non-existing user: ${username || email}`);
            throw new ApiError(401, "User does not exists !");
        }

        const isPasswordCorrect = await user.isPasswordCorrect(password);

        if (!isPasswordCorrect) {
            logger.warn(`Invalid password attempt for user: ${username || email}`);
            throw new ApiError(401, "Invalid password");
        }

        const { accessToken, refreshToken } = await generateRefreshTokenAndAccessToken(user?._id);

        const loggedInUser = await User.findById(user?._id).select('-password ');

        logger.info(`User logged in successfully: ${username || email} with ID: ${user?._id}`);

        logger.info(`accessToken, ${accessToken} and refreshToken ${refreshToken}`)

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(
                new ApiResponse(
                    201,
                    {
                        user: loggedInUser
                    },
                    "User Loggedin Successfully"
                )
            );
    } catch (error) {
        // Log the error with its stack trace
        logger.error(`Login error for user: ${req.body.username || req.body.email} - ${error.message}`, error);
        return next(new ApiError(error.statusCode || 500, error.message));
    }
});

const userLogout = asyncHandler( async(req,res)=>{
   try {
     await User.findByIdAndUpdate(
         req.user._id,
         {
             $set: {
             refreshToken : undefined
             }
         },
         {
             new: true
         }
     )
 
     return res
     .status(200)
     .clearCookie('accessToken', options)
     .clearCookie('refreshToken', options)
     .json(
         new ApiResponse (
             201,
             {},
             "User LoggedOut Successfully"
         )
     )
   } catch (error) {
        return res.json(
            new ApiErrResponse
        )
   }
})

const currentUser = asyncHandler( async(req,res)=>{
    try {
        const user  = req.user?.username
        
        if(!user){
            throw new ApiError(500,"Failed to Fetch Your Profile")
        }

        const profile = await User.aggregate([
            {
                $match: {
                    username: user?.toLowerCase()
                }
            },
            {
                $lookup:{
                    from: "follows",
                    localField: "_id",
                    foreignField: "followedTo",
                    as: "followers"
                }
            },
            {
                $lookup: {
                    from : "follows",
                    localField: "_id",
                    foreignField: "followedBy",
                    as: "following"
                }
            },
            {
                $addFields: {
                    FollowersCount:{
                        $size: "$followers"
                    },
                    FollowingCount: {
                        $size: "$following"
                    },
                }
    
            },
            {
                $lookup: {
                    from: 'posts',
                    pipeline: [
                        {
                            $match: {
                                postedBy : new mongoose.Types.ObjectId(req?.user._id)
                            }
                        },
                    ],
                    as:'posts',
                }
            },
            {
                $project:{
                    username: 1,
                    avatar:1,
                    fullName: 1,
                    ProfileImage:1,
                    FollowersCount:1,
                    FollowingCount:1,
                    "posts._id":1,
                    "posts.postFile":1,
                    Description:1
                }
            }
        ])
        
        // let post = await User.aggregate([
        //     {
        //         $lookup: {
        //             from : 'posts',
        //             localField: '_id',
        //             foreignField: 'postedBy',
        //             pipeline: [
        //                 {
        //                     $match: {
        //                         postedBy : new mongoose.Types.ObjectId(req.user?._id)
        //                     }
        //                 },8712105111
        //                 {
        //                     $group: {
                                
        //                     }
        //                 }
        //             ],
        //             as: 'post'
        //         }
        //     }
        // ])
        // console.log(post);
    
        return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                profile,
                "Fetched Profile successfully !!"
            )
        )
    } catch (error) {
        return res.json(
            new ApiErrResponse(error)
        )
    }
})

const updateAccountDetails = asyncHandler( async(req,res,next)=>{
    try {
        const finduser = req?.user
        const {username,Description,fullName} = req.body
        if(!finduser){
            throw next(new ApiError(401,"Unauthorized user"))
        }
        const usernameAlreadyExists = await User.findOne({
            username
        }) 

        const sameUser = usernameAlreadyExists?._id == req?.user?._id
      
        if(usernameAlreadyExists && sameUser){
            throw next(new ApiError(401,"Username is not available"))
        }
    
        const user = await User.findByIdAndUpdate(
            finduser?._id,
            {
                $set: {
                    username,
                    Description : Description || '',
                    fullName,
                }
            },
        ).select("-password")
    
        if(!user){
            throw next( new ApiError(500, "Failed to update Details"))
        }
        
        return res
        .status(200)
        .json(
            new ApiResponse(
                201,
                user,
            "Details update Successfully"
            )
        )
    } catch (error) {
        return res.json(
            new ApiErrResponse(error.message)
        )
    }
})

const updateCoverImage = asyncHandler( async(req,res)=>{

    try {
        const coverImageLocalPath = req.files?.coverImage[0].path
        
        if(!coverImageLocalPath){
            throw new ApiError(401, "CoverImage is Required")
        }
        const coverImage = await uploadToCloudinary(coverImageLocalPath)
        
        if(!coverImage){
            throw new ApiError(500, "Failed to upload coverImage")
        }
    
        const user = await User.findByIdAndUpdate(
            req.user?._id,
            {
                $set: {
                    coverImage: coverImage.url,
                }
            },
            {new : true}
        ).select("-password")
    
        return res
        .status(200)
        .json(
            new ApiResponse(
                202,
                user,
                "Cover Image updated Successfull"
            )
        )
    
    } catch (error) {
        return res.json(
            new ApiErrResponse(error)
        )
    }
})

const updateProfileImage = asyncHandler( async (req,res)=>{
    try {
        const ProfileImageLocalPath = req.files?.ProfileImage[0].path;
    
        if(!ProfileImageLocalPath){
            throw new ApiError(401, "Upload the Profile-Image")
        }
    
        const ProfileImage = await uploadToCloudinary(ProfileImageLocalPath)
    
        if(!ProfileImage){
            throw new ApiError(500, "Failed to upload the profile Image")
        }
    
        const user = await User.findByIdAndUpdate(
            req.user?._id,
            {
                $set:{
                    ProfileImage: ProfileImage.url
                }
            },
            { new : true }
        ).select("-password")
    
        return res
        .status(200)
        .json(
            new ApiResponse(
                201,
                user,
                "Profile Image update Successfully"
            )
        )
    } catch (error) {
        return res.json(
            new ApiErrResponse(error)
        )
    }
})

const refreshAccessToken = asyncHandler( async(req, res)=>{

    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if(!incomingRefreshToken){
        throw new ApiError(401, "unauthorized request")
    }

    try {
        const decodedToken = jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET)

        const user = await User.findById(decodedToken?._id)
    
        if(!user){
            throw new ApiError(401, "Invalid refresh Token")
        }
        
    
        const {accessToken, refreshToken} = await generateRefreshTokenAndAccessToken(user._id)
    
        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {accessToken, refreshToken},
                "Access Token refreshed"
            )
        )
    } catch (error) {
        throw new ApiError(401 , error?.message || "Invalid refresh Token || Failed")
    }

})

const updatePassword = asyncHandler ( async(req,res)=>{
    try {
        const {oldPassword, newPassword} = req.body
        if([oldPassword,newPassword].some((field)=> field.trim() == "")){
            throw new ApiError(401, `Both Fields should be Filled`)
        }
        const user = await User.findById(req.user?._id)
        const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)
    
        if(!isPasswordCorrect){
            throw new ApiError(401, "Invalid Password")
        }
    
        user.password = newPassword
        await user.save({validateBeforeSave : false})
    
        return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {},
                "Password Changed Successfully"
            )
        )
    } catch (error) {
        return res.json(
            new ApiErrResponse(error)
        )
    }

})

const deleteProfileImage = asyncHandler( async (req,res)=>{
    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                ProfileImage: null
            }
        },
        {new : true}
    ).select("-password")

    return res
    .status(200)
    .json(
        new ApiResponse(
            202,
            user,
            "Profile Image Removed"
        )
    )
})

const deletecoverImage = asyncHandler( async (req,res)=>{
    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                coverImage: null
            }
        },
        {new : true}
    ).select("-password")

    return res
    .status(200)
    .json(
        new ApiResponse(
            202,
            user,
            "cover Image Removed"
        )
    )
})

const deleteUser = asyncHandler( async (req,res)=> {
    try {
        let user = await User.deleteOne({_id :req?.user?._id})
        
        return res
        .status(200)
        .clearCookie("accessToken")
        .clearCookie("refreshToken")
        .json(
            new ApiResponse(200,{},"User deleted")
        )
    } catch (error) {
        return res
        .json( new ApiErrResponse(400,error))
    }
    
})

const getUserProfile = asyncHandler( async(req,res)=>{
    const {userId} = req.params;

    if(!userId){
        throw new ApiError(400, "Invalid userId")
    }

    const profile = await User.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $lookup:{
                from: "follows",
                localField: "_id",
                foreignField: "followedTo",
                as: "followers"
            }
        },
        {
            $lookup: {
                from : "follows",
                localField: "_id",
                foreignField: "followedBy",
                as: "following"
            }
        },
        {
            $addFields: {
                FollowersCount:{
                    $size: "$followers"
                },
                FollowingCount: {
                    $size: "$following"
                },
                isFollowed: {
                    $cond: {
                        if: {$in: [req.user?._id, "$followers.followedBy"]},
                        then: true,
                        else:false
                    }
                }
            }
        },
        {
            $lookup: {
                from: 'posts',
                pipeline: [
                    {
                        $match: {
                            postedBy : new mongoose.Types.ObjectId(userId)
                        }
                    },
                ],
                as:'posts',
            }
        },
        {
            $project:{
                username: 1,
                "posts._id":1,
                "posts.postFile": 1,
                fullName: 1,
                ProfileImage:1,
                FollowersCount:1,
                FollowingCount:1,
                isFollowed: 1,
                Description:1
            }
        }
    ])
    if(!profile){
        throw new ApiError(400,"user does not exist")
    }
    // const isFollowed = await Follow.aggregate([
    //     // {
    //     //     $match:{
    //     //         followedBy: new mongoose.Types.ObjectId(req?.user?._id)
    //     //     }
    //     // },
    //     {
    //        $group: {
    //         _id: '$followedTo',
    //         followers: {
    //             $push: '$followedBy'
    //         }
    //        }
    //     },
        
    //     {
    //         $addFields: {
    //             isFollowed: {
    //                 $cond: {
    //                     if:{$in: [req.user?._id , '$followers']},
    //                     then: true,
    //                     else: false
    //                 }
    //             }
    //         }
    //     },
    //     {
    //         $project:{
    //             _id:0,
    //             isFollowed: 1
    //         }
    //     }
    // ])
    // console.log('isfollow',isFollowed);
    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            profile,
            "User Profile Fetched Successfully"
        )
    )
})

export {
    UserRegister,
    userLogin,
    userLogout,
    currentUser,
    updateAccountDetails,
    refreshAccessToken,
    updateCoverImage,
    updateProfileImage,
    updatePassword,
    deleteProfileImage,
    deletecoverImage,
    deleteUser,
    getUserProfile
}
