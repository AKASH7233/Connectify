import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axiosInstance from "../utils/ApiFetch"
import toast from "react-hot-toast"

const initialState = {
    users: {}
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
                return error.response?.message || "Register Failed ! in redux part"
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
       
        toast.promise(responsePromise,{
            loading: 'Fetching Following List...',
            success: (response)=>{
                return response?.data?.message
            },
            error : (error)=>{
                return error.response?.message || "Register Failed ! in redux part"
            }
        })
    
        const response = await responsePromise
        return response.data;
    } catch (error) {
        toast.error(error.message)
    }
})


export const Followers = createAsyncThunk('follow/Followers',async(data)=>{
    try {
        const responsePromise = axiosInstance.post(`/follow/followers/${data}`)
    
        toast.promise(responsePromise,{
            loading: 'Fetching Followers List...',
            success: (response)=>{
                return response?.data?.message
            },
            error : (error)=>{
                return error.response?.message || "Register Failed ! in redux part"
            }
        })
    
        const response = await responsePromise
        return response.data;
    } catch (error) {
        toast.error(error.message)
    }
})

export const followSlice = createSlice({
    name: 'follow',
    initialState,
    reducers:{},
    extraReducers: (builder)=>{
        builder
        .addCase(toggleFollow.fulfilled,(state,action)=>{
            state.users = action.payload?.data
        })
    }
})

export default followSlice.reducer