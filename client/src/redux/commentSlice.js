import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axiosInstance from '../utils/ApiFetch'
import toast from 'react-hot-toast'

const initialState = {
    comments : {} || JSON.parse(localStorage.getItem('Comment')),
    mycomment : {}
}

export const addComments = createAsyncThunk('comment/addCommments',async(data)=>{
    const responsePromise = axiosInstance.post(`/comment/addcomment/${data?.url}`, {comment :data?.comment})
    toast.promise(responsePromise,{
        loading: 'Adding Comment',
        success: (response)=>{
            return response?.data?.message || `Comment Added`
        },
        error: (error)=>{
            return (error.response?.message) || `Failed to add Comment`
        }
    })

    const response = await responsePromise;
    console.log(response);
    return response.data
}) 

export const showComments = createAsyncThunk('comment/showComments',async(data)=>{

    const responsePromise = axiosInstance.post(`/comment/showcomments/${data}`)
    
    const response = await responsePromise;
    return response.data
})

export const editComment = createAsyncThunk('comment/editComment',async(data,newcomment)=>{
    const responsePromise = axiosInstance.post(`/comment/editcomment/${data}`, newcomment)

    toast.promise(responsePromise,{
        loading: 'Editing Comment...',
        success: (response)=>{
            return response?.data?.message || `Edited the Comment`
        },
        error: (error) =>{
           return (error.response?.message) || `Failed to Edit the Comment`
        }
    })

    const response = await responsePromise;
    return response.data
})

export const deleteComment = createAsyncThunk('comment/deletecomment',async(data)=>{
    const responsePromise = axiosInstance.post(`/comment/deletecomment/${data}`)

    toast.promise(responsePromise,{
        loading: 'Deleting the Comment...',
        success: (response)=>{
            return response?.data?.message || `Deleted the Comment`
        },
        error: (error)=>{
            return  (error.response?.message) || `Failed to delete the Comment`
        }
    })

    const response = await responsePromise;
    return response.data
})

export const commentSlice = createSlice({
    name: 'comment',
    initialState,
    reducers: {},
    extraReducers: (builder)=>{
        builder
        .addCase(addComments.fulfilled,(state,action)=>{
            state.mycomment = action.payload?.data
            localStorage.setItem('my Comment',JSON.stringify(action.payload?.data))
        })
        .addCase(showComments.fulfilled,(state,action)=>{
            state.comments = action.payload?.data
            localStorage.setItem('Comment',JSON.stringify(action.payload?.data))
        })
        .addCase(editComment.fulfilled,(state,action)=>{
            state.mycomment = action.payload?.data
            localStorage.setItem('my Comment',JSON.stringify(action.payload?.data))
        })
        .addCase(deleteComment.fulfilled,(state,action)=>{
            state.mycomment = {}
            localStorage.setItem('uploading Comment',JSON.stringify({}))
        })
    }
})

export default commentSlice.reducer;