import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../utils/ApiFetch";
import toast from "react-hot-toast";

const initialState = {
    LikedBy : {} || JSON.parse(localStorage.getItem('likedBy')),
    likedPost: {} || JSON.parse(localStorage.getItem('likedPosts')),
    commentLiked : {} || JSON.parse(localStorage.getItem('commentLiked'))
}

export const togglelike = createAsyncThunk('like/togglelike',async(data)=>{
    try {
            const responsePromise = await axiosInstance.post(`/like/togglelike/${data}`)
        
            const response = await responsePromise;
        
            return response.data;
    } catch (error) {
        toast.error(error.message);
        throw error
    }
})

export const postlikes = createAsyncThunk(`like/postlikes` , async(data)=>{
   try {
     const responsePromise = await axiosInstance.post(`/like/postlikes/${data}`)

     const response = await responsePromise;
     return response.data;
   } catch (error) {
        toast.error(error.message)
        throw error
   }
})

export const postliked = createAsyncThunk(`like/postliked` , async(data)=>{
    try {
        console.log(data);
      const responsePromise = await axiosInstance.post(`/like/postliked/${data}`)

      const response = await responsePromise;
  
      return response.data;
 
    } catch (error) {
         toast.error(error.message)
         throw error
    }
 })

 export const toggleCommentlike = createAsyncThunk('like/toggleCommentlike',async(data)=>{
    try {
            const responsePromise = await axiosInstance.post(`/like/toggleComment/${data}`)
        
            const response = await responsePromise;
        
            return response.data;
    } catch (error) {
        toast.error(error.message);
        throw error
    }
})

export const commentlikes = createAsyncThunk(`like/commentlikes` , async(data)=>{
    try {
      const responsePromise = await axiosInstance.post(`/like/Commentlikes/${data}`)
 
      const response = await responsePromise;
      return response.data;
    } catch (error) {
         toast.error(error.message)
         throw error
    }
 })
 
export const likeSlice = createSlice({
    name: 'like',
    initialState,
    reducers:{},
    extraReducers: (builder)=>{
        builder

        .addCase(postlikes.fulfilled ,(state,action)=>{
            state.LikedBy = action?.payload?.data?.likedUsers
            state.LikedBy = action?.payload?.data?.isliked
            localStorage.setItem('likedBy', JSON.stringify(action?.payload?.data))
            localStorage.setItem('isLiked',JSON.stringify(action?.payload?.data))
        })

        .addCase(postliked.fulfilled ,(state,action)=>{
            state.likedPost = action?.payload?.data
            localStorage.setItem('likedPosts',JSON.stringify(action?.payload?.data))
        })
        .addCase(commentlikes.fulfilled, (state,action)=>{
            state.commentLiked = action?.payload?.data
        })
    }
})

export default likeSlice.reducer;