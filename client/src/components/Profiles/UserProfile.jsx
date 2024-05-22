import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { profile } from '../../redux/usersSlice'
import { useParams } from 'react-router-dom'
import { toggleFollow } from '../../redux/followSlice'
import ProfileHeader from '../Profile/ProfileHeader'
import ProfileFooter from '../Profile/ProfileFooter'
import ProfileImage from '@/components/Profile/ProfileImage'

function UserProfile() {
    const dispatch = useDispatch()
    const userFromSlice = useSelector(state => state.visitedUser?.searchedUser)
    const [user,setUser] = useState(userFromSlice)
    const {userId} = useParams()
    
    const search = async() =>{
      let response = await dispatch(profile(userId))
      setUser(response?.payload?.data[0]);
    }

    useEffect(()=>{
        search()
    },[])
    
    const toggle = async() => {
        await dispatch(toggleFollow(user?._id))
        search()
    }
    const [viewProfile,setViewProfile] = useState(false)

    const toggleViewProfile = () => {
      setViewProfile(prev => !prev)
    }
  return (
    <div className='bg-black relative min-h-[100vh] text-white'>
      {viewProfile ? 
          <ProfileImage img={user?.ProfileImage} toggleview={toggleViewProfile}/>
          : 
          <div>
            <ProfileHeader user={user} follow={true} toggle={toggle} toggleview={toggleViewProfile}/>
            <ProfileFooter user={user}/>
          </div>}
    </div>
  )
}

export default UserProfile