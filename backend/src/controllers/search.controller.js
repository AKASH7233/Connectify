import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { User } from "../models/user.model.js";
import { Post } from "../models/post.model.js";


const search = asyncHandler( async(req,res)=>{
    const {search} = req.params;

    if(!search){
        throw new ApiError(400,"Fill to search")
    }

    let response
    let responsePost
    if(search){
        response = await User.find({username: search.toLowerCase()}).select("username ProfileImage Description")
    }

    if(response.length === 0){
        responsePost = await Post.find({title: search})
        console.log(responsePost);
    }

    if(response.length <= 0 && responsePost.length <=0){
        throw new ApiError(400, `username ${search} does not exists also Post related to ${search} does not exist !!`)
    }
    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            response.length > 0 ? response : responsePost,
            "Search successfully !!"
        )
    )
})

export {search}