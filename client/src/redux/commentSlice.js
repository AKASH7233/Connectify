import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axiosInstance from '../utils/ApiFetch'
import toast from 'react-hot-toast'

const initialState = {
    comments : JSON.parse(localStorage.getItem('Comment')) || [],
    mycomment : {},
    RepliedComment : JSON.parse(localStorage.getItem('comment')) || {} ,
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

    const responsePromise = axiosInstance.get(`/comment/showcomments/${data}`)
    
    const response = await responsePromise;
    return response.data
})

export const editComment = createAsyncThunk('comment/editComment',async(data,)=>{
    const responsePromise = axiosInstance.post(`/comment/editcomment/${data.url}`, {newComment:data?.comment})

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

export const replyToComment = createAsyncThunk('comment/replyToComment',async(data)=>{
    const responsePromise = axiosInstance.post(`/comment/replycomment/${data?.url}`, {comment :data?.comment})

    toast.promise(responsePromise,{
        loading: 'Adding the Comment...',
        success: (response)=>{
            return response?.data?.message || `Comment added`
        },
        error: (error)=>{
            return  (error.response?.message) || `Failed to add the Comment`
        }
    })

    const response = await responsePromise;
    return response.data
})

export const showReplyComments = createAsyncThunk('comment/showReplyComments',async(data)=>{
    console.log(data);
    const responsePromise = axiosInstance.get(`/comment/showreplycomment/${data}`)
    
    const response = await responsePromise;
    return response.data
})

export const commentSlice = createSlice({
    name: 'comment',
    initialState,
    reducers: {
        addRepliedComment : (state,action) =>{
            state.RepliedComment = action.payload
            localStorage.setItem('comment',JSON.stringify(action.payload))
        }
    },
    extraReducers: (builder)=>{
        builder
        .addCase(addComments.fulfilled,(state,action)=>{
            state.mycomment = action.payload?.data
            localStorage.setItem('my Comment',JSON.stringify(action.payload?.data))
        })
        .addCase(showComments.fulfilled,(state,action)=>{
            state.comments.push(action.payload?.data)
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

export const {addRepliedComment} = commentSlice.actions;

export default commentSlice.reducer;