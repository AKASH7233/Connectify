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

    // toast.promise(responsePromise, {
    //     loading: "updating Profile...",
    //     success: (response) => {
    //         return response.data?.message
    //     },
    //     error: (error) => {
    //         return error.response?.message || "Profile Fetching Failed ! in redux part"
    //     }
    // })

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