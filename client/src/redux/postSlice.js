import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

import axiosInstance from "../utils/ApiFetch";

const initialState = {
    posts: [] || JSON.parse(localStorage.getItem('posts')),
    postFile: null || JSON.parse(localStorage.getItem('postFile')),
    title : '' || JSON.parse(localStorage.getItem('title')),
    visitedPost : {} || JSON.parse(localStorage.getItem('visitedPost')),
    // /myPosts : [] || JSON.parse(localStorage.getItem('myposts'))
}

export const getPosts = createAsyncThunk('post/getpost',async()=>{
    try {
        const responsePromise =  axiosInstance.post('/post/post')

        // toast.promise(responsePromise, {
        //     loading: "Getting Post...",
        //     success: (res) => {
        //         return res.data?.message || "Post Fetched Successfully";
        //     },
        //     error: (err) => {
        //         return err?.response?.error || "Failed To Fetch Post";
        //     }
        // })
        const response = await responsePromise
        return response.data
    } catch (error) {
        return error
    }
})

export const getVisitedPosts = createAsyncThunk('post/getVisitedpost',async(data)=>{
    try {
        const responsePromise = axiosInstance.post(`/post/visitedpost/${data}`)
    
        // toast.promise(responsePromise,{
        //     loading : "loading ... ",
        //     success: (res)=>{
        //         return res.data.message || "visited Post"
        //     },
        //     error : (err)=>{
        //         return err.data.message || "Failed visit"
        //     }
        // })
    
        const response = await responsePromise
    
        return response.data
    } catch (error) {
        return error 
    }
})

export const uploadPost = createAsyncThunk('post/uploadPost', async(data)=>{
    try {
        const responsePromise = await axiosInstance.post('/post/uploadpost',data);
    
        if(responsePromise?.data.message){
            toast.success(responsePromise?.data.message)
        }
        if(responsePromise?.data.error){
            toast.error(responsePromise?.data.error)
        }
    
        const response = responsePromise
        return response.data
    } catch (error) {
        toast.error(error)
        throw error
    }
})

export const EditPost = createAsyncThunk('post/edit', async(data)=>{
    try {
        const responsePromise = await axiosInstance.post(`/post/updatepost/${data.id}`,{title:data.title});
    
        if(responsePromise?.data.message){
            toast.success(responsePromise?.data.message)
        }
        if(responsePromise?.data.error){
            toast.error(responsePromise?.data.error)
        }
    
        const response = responsePromise
        return response.data
    } catch (error) {
        toast.error(error)
        throw error
    }
})

export const deletePost = createAsyncThunk('post/delete', async(data)=>{
    try {
        const responsePromise = await axiosInstance.post(`/post/deletepost/${data}`);
    
        if(responsePromise?.data.message){
            toast.success(responsePromise?.data.message)
        }
        if(responsePromise?.data.error){
            toast.error(responsePromise?.data.error)
        }
    
        const response = responsePromise
        return response.data
    } catch (error) {
        toast.error(error)
        throw error
    }
})

export const togglehidePost = createAsyncThunk('post/togglehidepost',async(data)=>{
    const response = await axiosInstance.post(`/post/togglehidepost/${data}`)
    if(response?.data?.message){
        toast.success(response?.data?.message)
    }
    if(response?.data?.error){
        toast.error(response?.data?.error)
    }
    return response.data
})

export const myPosts = createAsyncThunk('post/myposts',async(data)=>{
    console.log(data);
    let response = await axiosInstance.post(`/post/myposts/${data}`)
    
    return response.data
})

export const showHiddenPost = createAsyncThunk('post/showHiddenPost',async()=>{
    const response = await axiosInstance.post(`/post/hiddenpost`)

    return response.data
})

export const getTaggedUser = createAsyncThunk('post/getTaggedUser',async(data)=>{
    try {
        const response = await axiosInstance.post(`post/gettaggeduser/${data}`)
    
        return response.data
    } catch (error) {
        return error  
    }
})

export const getTaggedpost = createAsyncThunk('post/getTaggedpost',async(data)=>{
    try {
        const response = await axiosInstance.post(`post/gettaggedpost/${data}`)
    
        return response.data
    } catch (error) {
        return error  
    }
})

export const postSlice = createSlice({
    name: 'post',
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder
        
        .addCase(getPosts.fulfilled,(state,action)=>{
            localStorage.setItem('posts',JSON.stringify(action?.payload?.data))
            state.posts.push(action.payload.data);
        })

        .addCase(uploadPost.fulfilled,(state,action)=>{
            localStorage.setItem('PostFile',JSON.stringify(action?.payload?.file))
            localStorage.setItem('title',JSON.stringify(action?.payload?.title))
            state.postFile = action.payload.file;
            state.postFile = action.payload.title;
        })
        .addCase(getVisitedPosts.fulfilled,(state,action)=>{
            state.visitedPost = action.payload
            localStorage.setItem('visitedPost',JSON.stringify(action?.payload))
        })
    }
})

export default postSlice.reducer;