import { createAsyncThunk , createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-hot-toast';

import axiosInstance from '../utils/ApiFetch';

const initialState = {
    messages : [],
    loading : false,
    error : null
}

export const sendMessageDispatch = createAsyncThunk('messages/sendMessageDispatch', async (data)=>{
    try {
        const response =  axiosInstance.post('/message/',data);
        toast.promise(response,{
            loading : "Sending Message...",
            success : (response)=>{
                console.log(response)
            },
            error : (error)=>{
                return error.response?.message || "Message Failed ! in redux part"
            }
        })
        return ( await response).data;
    } catch (error) {
        return error.message || "cannot send message"
    }
})

export const fetchMessages = createAsyncThunk('messages/fetchMessages', async (data)=>{
    try {
        const response = await axiosInstance.post(`/message/${data}`);
        return response.data;
    } catch (error) {
        return error.message || "cannot find messages"
    }
})

export const messageSlice = createSlice({
    name : 'messages',
    initialState,
    reducers : {
        setMessages : (state,action)=>{
            state.messages = action.payload
        }
    },
    extraReducers : {
    }
})