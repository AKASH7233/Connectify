import { createAsyncThunk,createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

import axiosInstance from "../utils/ApiFetch";

const initialState = {
   searchedUser: {}
}

export const profile = createAsyncThunk('auth/profile',async(data)=>{
    
    const responsePromise = axiosInstance.post(`/user/userprofile/${data}`)

    const response = await responsePromise;
    return response.data;
    
})

export const userSlice = createSlice({
    name : 'user',
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder
        .addCase(profile.fulfilled,(state,action)=>{
            state.users = action.payload?.data
        })
    }
})

export default userSlice.reducer;