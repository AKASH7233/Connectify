import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../utils/ApiFetch";
import toast from "react-hot-toast";

const initialState = {
    // isFollow: false || JSON.parse(localStorage.getItem('isFollow')),
    users:{}
}

export const profile = createAsyncThunk('auth/profile',async(data)=>{
    console.log(data);
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