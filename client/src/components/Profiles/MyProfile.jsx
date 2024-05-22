import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import ProfileFooter from '../Profile/ProfileFooter'
import ProfileHeader from '../Profile/ProfileHeader'
import { getUserData } from '../../redux/authSlice'
import ProfileImage from '@/components/Profile/ProfileImage'

function MyProfile() {
  const dispatch = useDispatch()
  const response = useSelector(state => state?.auth?.user)?.user
  const [user,setUser] = useState(response)
  const [viewProfile,setViewProfile] = useState(false)
  const toggleViewProfile = () => {
    setViewProfile(prev => !prev)
  }
  useEffect(()=>{
    (async ()=>{
      let response = await dispatch(getUserData())
       setUser(response?.payload?.data[0])
      })()
  },[])
  return (

    <div>
        <div className='bg-black text-white'>
        {viewProfile ? 
          <ProfileImage img={user?.ProfileImage} toggleview={toggleViewProfile} edit={true}/>
          : 
          <div>
            <ProfileHeader user={user} toggleview={toggleViewProfile}/>
            <ProfileFooter user={user}/>
          </div>}
        </div>      
    </div>
  )
}

export default MyProfile