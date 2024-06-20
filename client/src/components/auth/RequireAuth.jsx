import React from 'react'
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const RequireAuth = () => {
    const isLoggedIn = useSelector(state => state.auth.isLoggedIn) || false;
    console.log(isLoggedIn
        , 'login'
    )
  return (
    <>
      {isLoggedIn ? <Outlet /> : <Navigate to='/login' />}
    </>
  )
}

export default RequireAuth