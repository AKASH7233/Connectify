import React from 'react'
import { Navigate, Outlet } from 'react-router-dom';

const RequireAuth = () => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") || false;
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