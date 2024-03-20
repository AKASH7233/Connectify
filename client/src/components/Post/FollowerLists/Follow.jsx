import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Followers, Following } from '../../../redux/followSlice'
import { getUserData } from '../../../redux/authSlice'
import { following } from '../../../../../backend/src/controllers/follow.controller'

function Follow() {
    const dispatch = useDispatch()
    const user = useSelector(state=>state?.auth?.user)
    const userID = user[0]?._id
    useEffect(()=>{
      ;(async()=>{
        console.log(userID);
        let response = await dispatch(Followers(userID))
        console.log(response);
    })()
    },[])
  return (
    <div>

    </div>
  )
}

export default Follow