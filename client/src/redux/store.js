import { configureStore } from "@reduxjs/toolkit";
import authReducer from './authSlice.js'
import postReducer from './postSlice.js'
import likeReducer from './likeSlice.js'
import followReducer from './followSlice.js'

export const store = configureStore({
    reducer: {
        auth : authReducer,
        post : postReducer,
        like : likeReducer,
        follow : followReducer
    }
})