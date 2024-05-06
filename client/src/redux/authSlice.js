import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

import axiosInstance from "../utils/ApiFetch";


const initialState = {
    isLoggedIn : localStorage.getItem("isLoggedIn") || false,
    user :JSON.parse(localStorage.getItem("data"))?.data || {}
}

export const createAccount = createAsyncThunk('auth/register', async(data)=>{
    try {
        const responsePromise = axiosInstance.post('/user/register',data);
        toast.promise(responsePromise,{
            loading : "Creating Account...",
            success : (response)=>{
                return response.data?.message
            },
            error : (response)=>{
                return response?.data?.error || "Register Failed ! in redux part"
            }
        })

        const response = await responsePromise;
        return response.data;

    } catch (error) {
        toast.error(error || "Something went Wrong !")
        throw error;
    }
})

export const login = createAsyncThunk('auth/login',async(data)=>{
    try {
        const responsePromise =  axiosInstance.post('/user/login',data)
        // toast.promise(responsePromise, {
        //     loading: "logining...",
        //     success: (response) => {
        //         return response.data?.message
        //     },
        //     error: (error) => {
        //         return error.response?.message || "Login Failed ! in redux part"
        //     }
        // })
        const response = await responsePromise;

        if(response?.data?.message){
            toast.success(response?.data?.message)
        }
        if(response?.data?.error){
            toast.error(response?.data?.error)
        }
        console.log(response)
        return response.data;
    } catch (error) {
        toast.error(error.message || "Something Went Wrong")
        throw error
    }
})

export const logout = createAsyncThunk('auth/logout',async()=>{
    try {
        const responsePromise = axiosInstance.post('/user/logout');
        toast.promise(responsePromise, {
            loading: "Logging out",
            success: (response) => {
                return response.data?.message || "Logout  SuccessFul"
            },
            error: (error) => {
                return error.response?.message || "Logout Failed ! in redux part"
            }
        })

        const response = await responsePromise;
        return response.data;
    } catch (error) {
        toast.error(error.message)
        throw error
    }
})

export const getUserData = createAsyncThunk('auth/getUserData',async()=>{
   try{
        const responsePromise = axiosInstance.post('/user/profile');
       
        const response = await responsePromise;
        return response.data;
    } catch (error) {
        toast.error(error.message)
        throw error
    }
})

export const updateProfile = createAsyncThunk('auth/updateProfile',async(data)=>{
    // try {
            const responsePromise =  axiosInstance.post('/user/updateaccount',data);
            toast.promise(responsePromise, {
                loading: "updating Profile...",
                success: (response) => {
                    return response.data?.message
                },
                error: (error) => {
                    return error.response?.message 
                }
            })

            const response = await responsePromise;
            return response.data;
    // } catch (error) {
    //     toast.error(`Failed To update`)
    //     throw error
    // }

})


export const updateProfileImg = createAsyncThunk('auth/updateProfileImg',async(data)=>{
    try {
            const responsePromise =  axiosInstance.post('/user/updateProfileImage',data);
            toast.promise(responsePromise, {
                loading: "updating ProfileImage...",
                success: (response) => {
                    return response.data?.message
                },
                error: (error) => {
                    return error.response?.message 
                }
            })

            const response = await responsePromise;
            return response.data;
    } catch (error) {
        toast.error(`Failed To update`)
        throw error
    }

})

export const deleteProfileImage = createAsyncThunk('auth/deleteProfileImage',async(data)=>{
    try {
            const responsePromise =  axiosInstance.post('/user/deleteProfileImage',data);
            toast.promise(responsePromise, {
                loading: "updating ProfileImage...",
                success: (response) => {
                    return response.data?.message
                },
                error: (error) => {
                    return error.response?.message 
                }
            })

            const response = await responsePromise;
            return response.data;
    } catch (error) {
        toast.error(`Failed To update`)
        throw error
    }

})

export const deleteUser = createAsyncThunk('auth/deleteUser',async()=>{
    try {
            const responsePromise =  axiosInstance.post('/user/deleteUser');
            toast.promise(responsePromise, {
                loading: "Deleting Account...",
                success: (response) => {
                    return response
                },
                error: (error) => {
                    return response?.error 
                }
            })
            
            const response = await responsePromise;
            console.log(response);
            return response;
    } catch (error) {
        toast.error(`Failed To update`)
        throw error
    }

})

export const updateRefreshToken = createAsyncThunk('auth/updateRefreshToken',async()=>{
    let response =  axiosInstance.post('/user/refreshToken')

    let resp =  await response
    return resp.data
})



export const authSlice = createSlice({
    name : 'auth',
    initialState,
    reducers: {},
    extraReducers:(builder) => {
        builder

        .addCase(login.fulfilled,(state,action)=>{
            localStorage.setItem('data',JSON.stringify(action?.payload));
            localStorage.setItem('isLoggedIn',true)
            state.isLoggedIn = true;
            state.user = action?.payload?.data;
        })

        .addCase(logout.fulfilled,(state)=>{
            localStorage.clear();
            state.isLoggedIn = false;
            state.user = {}
        })

        .addCase(deleteUser.fulfilled,(state)=>{
            localStorage.clear();
            state.isLoggedIn = false;
            state.user = {}
        })

        .addCase(getUserData.fulfilled,(state,action)=>{
            localStorage.setItem("data",JSON.stringify(action?.payload));
            localStorage.setItem("isLoggedIn",true);
            state.isLoggedIn=true;
            state.user=action?.payload?.data;
        })
    }
})

export default authSlice.reducer