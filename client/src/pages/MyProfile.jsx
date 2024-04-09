import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Follow from '../components/Post/FollowerLists/Follow'
import ProfileFooter from '../components/Post/Profile/ProfileFooter'
import ProfileHeader from '../components/Post/Profile/ProfileHeader'
import { getUserData } from '../redux/authSlice'

function MyProfile() {
  const dispatch = useDispatch()
  const response = useSelector(state => state?.auth?.user)?.user
  const [user,setUser] = useState(response)
  useEffect(()=>{
    (async ()=>{
      let response = await dispatch(getUserData())
       setUser(response?.payload?.data[0])
      })()
  },[])
  console.log(user);  
  return (
    <div className='bg-black text-white'>
        <ProfileHeader user={user}/>
        <ProfileFooter user={user}/>
    </div>
  )
}

export default MyProfile