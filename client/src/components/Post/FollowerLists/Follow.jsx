import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Followers, Following } from '../../../redux/followSlice'
import { getUserData } from '../../../redux/authSlice'
import { following } from '../../../../../backend/src/controllers/follow.controller'
import Header from '../Header'
import UserHeader from '../../userHeader/UserHeader'


function Follow({userId}) {
    const dispatch = useDispatch()
    const [users,SetUsers] = useState(null)

    const load = async() => {
      let response = await dispatch(Followers(userId))
      SetUsers(response?.payload?.data)
      console.log(response);
    }
    console.log(users);

    useEffect(()=>{
      load()
    },[])
  return (
    <div>
      {users?.map((user)=>( 
        <UserHeader key={user?._id} user={user.followers} userId={user?._id}/>
      ))}
    </div>
  )
}

export default Follow