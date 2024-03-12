import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/apiResponse.js"
import { User } from "../models/user.model.js"
import { uploadToCloudinary } from "../utils/cloudinary.js"
import jwt from "jsonwebtoken"
import { ApiErrResponse } from "../utils/apiErrResponse.js"

const generateRefreshTokenAndAccessToken = async(userid) => {
    const user = await User.findById(userid)
    console.log('roken',user);
    const accessToken =  user.generateAccessToken()
    console.log(accessToken);
    const refreshToken =  user.generateRefreshToken()

    user.refreshToken = refreshToken
    await user.save({validateBeforeSave: false})

    return {accessToken, refreshToken}
}


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
 
     console.log(req.files);
     
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

const userLogin = asyncHandler( async(req,res) => {
    try {
        const {username, email , password} = req.body
    
        if([email,username,password].some((field)=> field?.trim() === "")){
            throw new ApiError(400,'Every Field should be filled')
        }
    
        if(password.length < 8){
            throw new ApiError(401, "Password should contain atleast 8 characters")
        }
        const user = await User.findOne({
            $or: [
                {username}, {email}
            ]
        })
    
        if(!user){
            throw new ApiError(401, "User does not exists !")
        }
    
        
      
        const isPasswordCorrect = await user.isPasswordCorrect(password)
        
        if(!isPasswordCorrect){
            throw new ApiError(401, "Invalid password")
        }
    
        const {accessToken,refreshToken} = await generateRefreshTokenAndAccessToken(user?._id)
    
        const loggedInUser = await User.findById(user?._id).select('-password ')
    
        const options = {
            httpOnly: true,
            secure : true,
            SameSite : "None"
        }
    
        res
        .status(200)
        .cookie("accessToken", accessToken,options )
        .cookie("refreshToken", refreshToken , options)
        .json(
            new ApiResponse(
                201,
                {
                    user: loggedInUser, accessToken, refreshToken
                },
                "User Loggedin Successfully"
            )
        )
    } catch (error) {
        return res.json(
            new ApiErrResponse(error)
        )
    }
})

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
 
     const options = {
         httpOnly: true,
         secure : true,
     }
 
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
        const user  = await User.findById(req.user._id).select("-password -refreshToken -email")
    
        if(!user){
            throw new ApiError(500,"Failed to Fetch Your Profile")
        }
    
        return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                user,
                "Fetched Profile successfully !!"
            )
        )
    } catch (error) {
        return res.json(
            new ApiErrResponse(error)
        )
    }
})

const updateAccountDetails = asyncHandler( async(req,res)=>{
    try {
        const finduser = req?.user
        const {username,Description,fullName,email} = req.body
        console.log(username);
        if(!finduser){
            throw new ApiError(401,"Unauthorized user")
        }
    
        const user = await User.findByIdAndUpdate(
            finduser?._id,
            {
                $set: {
                    username,
                    Description,
                    fullName,
                    email
                }
            },
            {
                new : true
            }
        ).select("-password")
    
        if(!user){
            throw new ApiError(500, "Failed to update Details")
        }
        res
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
            new ApiErrResponse(error)
        )
    }
})

const updateCoverImage = asyncHandler( async(req,res)=>{

    try {
        const coverImageLocalPath = req.files?.coverImage[0].path
        
        console.log(coverImageLocalPath);
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
    console.log('token',incomingRefreshToken);
    if(!incomingRefreshToken){
        throw new ApiError(401, "unauthorized request")
    }

    try {
        const decodedToken = jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET)

        const user = await User.findById(decodedToken?._id)
    
        console.log( user.refreshToken);
        if(!user){
            throw new ApiError(401, "Invalid refresh Token")
        }
        
        const options = {
            httpOnly:true,
            secure: true,
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
    await User.findByIdAndDelete(
        req.user?._id,
    )

    return res
    .status(200)
    .clearCookie("accessToken")
    .clearCookie("refreshToken")
    .json(
        new ApiResponse(200,{},"User deleted")
    )
    
})

const getUserProfile = asyncHandler( async(req,res)=>{
    const {username} = req.params;

    if(!username){
        throw new ApiError(400, "Invalid Username")
    }

    const profile = await User.aggregate([
        {
            $match: {
                username: username?.toLowerCase()
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
                isFollowing:{
                    $cond: {
                        if: {$in: [req?.user?._id, "$followers.following"]},
                        then: true,
                        else: false
                    }
                }
            }

        },
        {
            $project:{
                username: 1,
                avatar:1,
                fullName: 1,
                coverImage:1,
                FollowersCount:1,
                FollowingCount:1,
                isFollowing:1,
                posts:1,
            }
        }
    ])

    if(!profile){
        throw new ApiError(400,"user does not exist")
    }

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