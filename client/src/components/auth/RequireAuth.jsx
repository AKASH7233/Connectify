import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import Cookies from 'js-cookie';

import { updateRefreshToken } from '@/redux/authSlice';

const RequireAuth = () => {
    const dispatch = useDispatch();
    // Use useSelector to get the current state of isLoggedIn
    const accessToken = Cookies.get('accessToken');
    let isLoggedIn = !!accessToken;
    
    useEffect(() => {
        const checkAndRefreshToken = async () => {
            try {
                if(isLoggedIn){
                    await dispatch(updateRefreshToken());
                }
            } catch (error) {
                console.error("Error updating refresh token, Token Expire", error);
                // Handle error or state update through redux action if needed
            }
        };
        checkAndRefreshToken();
    }, [isLoggedIn,dispatch]); // Add dispatch to the dependency array to adhere to exhaustive-deps rule
    console.log("Is logged in", isLoggedIn)
    return isLoggedIn ? <Outlet /> : <Navigate to='/login' />;
}

export default RequireAuth;