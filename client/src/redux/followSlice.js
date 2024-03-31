import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axiosInstance from "../utils/ApiFetch"
import toast from "react-hot-toast"

const initialState = {
    Followers: {},
    Following: {}
}

export const toggleFollow = createAsyncThunk('follow/toggleFollow',async(data)=>{
    try {
        const responsePromise = axiosInstance.post(`/follow/togglefollow/${data}`)
    
        toast.promise(responsePromise,{
            loading: 'Toggling Follow ...',
            success: (response)=>{
                return response?.data?.message
            },
            error : (error)=>{
                return error.response?.message || "Follow Toggling Failed ! in redux part"
            }
        })
    
        const response = await responsePromise
        return response.data;
    } catch (error) {
        toast.error(error.message)
    }
})

export const Following = createAsyncThunk('follow/Following',async(data)=>{
    try {
        console.log(`/follow/following/${data}`);
        const responsePromise = axiosInstance.post(`/follow/following/${data}`)
       
        const response = await responsePromise
        return response.data;
    } catch (error) {
        toast.error(error.message)
    }
})


export const Followers = createAsyncThunk('follow/Followers',async(data)=>{
    try {
        console.log(data);
        const responsePromise = axiosInstance.post(`/follow/followers/${data}`)
    
        const response = await responsePromise
        return response.data;
    } catch (error) {
        toast.error(error.message)
        throw error
    }
})

export const followSlice = createSlice({
    name: 'follow',
    initialState,
    reducers:{},
    extraReducers: (builder)=>{
        builder
        .addCase(Followers.fulfilled,(state,action)=>{
            state.Followers = action.payload?.data
        })
        .addCase(Following.fulfilled,(state,action)=>{
            state.Following = action.payload?.data
        })
    }
})

export default followSlice.reducer