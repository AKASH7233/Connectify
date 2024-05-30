import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import axiosInstance from "../utils/ApiFetch";

const initialState = {}

export const createBlink = createAsyncThunk('blink/createBlink',async(data)=>{
    try {
        const responsePromise = axiosInstance.post(`/blink/createBlink/`,data)
        toast.promise(responsePromise,{
            loading: 'loading',
            success : (responsePromise)=>{
                return responsePromise?.data?.message
            },
            error: (error)=>{
                return error.response?.message
            }
        })
        const response = await responsePromise;
        return response.data;
    } catch (error) {
        return error
    }
})

export const deleteBlink = createAsyncThunk('blink/deleteBlink',async(data)=>{
    try {
        const responsePromise = axiosInstance.post(`/blink/deleteBlink/${data}`)
        toast.promise(responsePromise,{
            loading: 'loading',
            success : (responsePromise)=>{
                return responsePromise?.data?.message
            },
            error: (error)=>{
                return error.response?.message
            }
        })
        const response = await responsePromise;
        return response.data;
    } catch (error) {
        return error
    }
})

export const getBlink = createAsyncThunk('blink/getBlink',async()=>{
    try {
        const responsePromise = axiosInstance.get(`/blink/getBlinks`)
        toast.promise(responsePromise,{
            loading: 'loading',
            success : (responsePromise)=>{
                return responsePromise?.data?.message
            },
            error: (error)=>{
                return error.response?.message
            }
        })
        const response = await responsePromise;
        console.log(response);
        return response.data;
    } catch (error) {
        return error
    }
})

export const deleteAllBlink = createAsyncThunk('blink/deleteAllBlink',async()=>{
    try {
        const responsePromise = axiosInstance.get(`/blink/deleteAllBlink`)
        toast.promise(responsePromise,{
            loading: 'loading',
            success : (responsePromise)=>{
                return responsePromise?.data?.message
            },
            error: (error)=>{
                return error.response?.message
            }
        })
        const response = await responsePromise;
        console.log(response);
        return response.data;
    } catch (error) {
        return error
    }
})

export const myBlink = createAsyncThunk('blink/myBlink',async()=>{
    try {
        const responsePromise = axiosInstance.post(`/blink/myBlinks`)
        toast.promise(responsePromise,{
            loading: 'loading',
            success : (responsePromise)=>{
                return responsePromise?.data?.message
            },
            error: (error)=>{
                return error.response?.message
            }
        })
        const response = await responsePromise;
        return response.data;
    } catch (error) {
        return error
    }
})

export const blinkSlice = createSlice({
    name : 'blink',
    initialState,
    reducers : {},
    extraReducers : (builder )=>
        { 
            builder
            .addCase(createBlink.fulfilled,(state,action)=>{
            state.blink = action.payload
            })
        }
    
})