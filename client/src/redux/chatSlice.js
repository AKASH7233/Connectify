import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { toast } from 'react-hot-toast'

import axiosInstance from '../utils/ApiFetch'


const initialState = {
    messages: [],
    users: [],
    selectedUser: null,
    selectedUserMessages: [],
    loading: false,
    error: null,
}

export const fetchChatId = createAsyncThunk('chat/fetchChatId', async ( data )=>{
    try {
        const response = await axiosInstance.post('/chat/chat',data);
        return response.data;
    } catch (error) {
        toast.error(error.message || "cannot find chat id")
    }
})

export const fetchPerson = createAsyncThunk('chat/fetchPerson', async ( data )=>{
    try {
        const response = await axiosInstance.get(`/chat/${data}`);
        return response.data;
    } catch (error) {
        toast.error(error.message || "cannot find person")
    }
})

export const ChatSlice = createSlice({
    name : 'chat',
    initialState,
    reducers:{
        setMessages: (state,action) => {
            state.messages = action.payload
        },
        setUsers: (state,action) => {
            state.users = action.payload
        },
        setSelectedUser: (state,action) => {
            state.selectedUser = action.payload
        },
        setSelectedUserMessages: (state,action) => {
            state.selectedUserMessages = action.payload
        },
        setLoading: (state,action) => {
            state.loading = action.payload
        },
        setError: (state,action) => {
            state.error = action.payload
        },
    },
    extraReducers:(builder) => {
        builder
        .addCase(fetchChatId.fulfilled,(state,action)=>{
            state.chatId = action?.payload?.data;
        })
        .addCase(fetchPerson.fulfilled,(state,action)=>{
            localStorage.setItem('person',JSON.stringify(action.payload));
        })
    }
})