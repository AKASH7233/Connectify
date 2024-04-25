import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "@/utils/ApiFetch";

const initialState = {
    bookedPosts : [] || [JSON.parse(localStorage.getItem('bookedPost'))]
}

export const toogleBookmark = createAsyncThunk('bookmark/toggleBookmark',async(data)=>{
    console.log(data);
    const response = axiosInstance.post(`/bookmark/toggleBook/${data}`)

    const BookMarkResponse = await response
    return BookMarkResponse?.data

})

export const isBooked = createAsyncThunk('bookmark/isBooked',async(data)=>{
    const response = axiosInstance.post(`/bookmark/isBooked/${data}`)

    const isBookedResponse = await response
    return isBookedResponse?.data

})

export const AllBookedPost = createAsyncThunk('bookmark/AllBookedPost',async()=>{
    const response = axiosInstance.post(`/bookmark/bookedPosts`)

    const BookedPosts = await response
    return BookedPosts?.data
})

export const bookmarkSlice = createSlice({
    name: 'bookmark',
    initialState,
    reducers:{},
    extraReducers: (builder)=>{
        builder

        .addCase(AllBookedPost.fulfilled,(action,state)=>{
            state.bookedPosts.push(action?.payload?.data)
            localStorage.setItem('bookedPost',JSON.stringify(action?.payload?.data))
        })
    }
})
