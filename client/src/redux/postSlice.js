import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../utils/ApiFetch";

const initialState = {
    postFile: null,
    title : ''
}

export const uploadPost = createAsyncThunk('/post/upload', async(data)=>{
    const responsePromise = await axiosInstance.post('/post/uploadpost',data);

    if
})