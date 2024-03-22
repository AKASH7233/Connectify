import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../utils/ApiFetch";
import toast from "react-hot-toast";

const initialState = {
    // isFollow: false || JSON.parse(localStorage.getItem('isFollow')),
    user: {} || JSON.parse(localStorage.getItem('users'))
}

export const profile = createAsyncThunk('auth/profile',async(data)=>{
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
            state.user = action.payload?.data[0]
            state.isFollow = action?.payload?.data[0]?.isFollowing
            localStorage.setItem('users',JSON.stringify(action?.payload?.data[0]))
            localStorage.setItem('isFollow',JSON.stringify(action?.payload?.data[0]?.isFollowing))
        })
    }
})

export default userSlice.reducer;