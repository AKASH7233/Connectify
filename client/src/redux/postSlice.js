import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../utils/ApiFetch";
import toast from "react-hot-toast";

const initialState = {
    posts: [] || JSON.parse(localStorage.getItem('posts')),
    postFile: null || JSON.parse(localStorage.getItem('postFile')),
    title : '' || JSON.parse(localStorage.getItem('title')),
    visitedPost : {} || JSON.parse(localStorage.getItem('visitedPost'))
}

export const getPosts = createAsyncThunk('post/getpost',async()=>{
    try {
        const responsePromise = await axiosInstance.post('/post/post')
    
        if(responsePromise?.data.message){
            toast.success(responsePromise?.data.message)
        }
        if(responsePromise?.data.error){
            toast.error(responsePromise?.data.error)
            navigate('/login')
        }
    
        const response = responsePromise
    
        return response.data
    } catch (error) {
        toast.error('Failed To Fetch Posts')
        throw error   
    }
})

export const getVisitedPosts = createAsyncThunk('post/getVisitedpost',async(data)=>{
    try {
        const responsePromise = await axiosInstance.post(`/post/visitedpost/${data}`)
    
        if(responsePromise?.data.message){
            toast.success(responsePromise?.data.message)
        }
        if(responsePromise?.data.error){
            toast.error(responsePromise?.data.error)
            navigate('/login')
        }
    
        const response = responsePromise
    
        return response.data
    } catch (error) {
        toast.error('Failed To Fetch Post')
        throw error   
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
        const responsePromise = await axiosInstance.post('/post/updatepost',data);
    
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

export const deletePost = createAsyncThunk('post/delete', async()=>{
    try {
        const responsePromise = await axiosInstance.post('/post/deletepost');
    
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