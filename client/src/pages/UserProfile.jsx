import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { profile } from '../redux/usersSlice'
import { useParams } from 'react-router-dom'
import { toggleFollow } from '../redux/followSlice'
import ProfileHeader from '../components/Post/Profile/ProfileHeader'
import ProfileFooter from '../components/Post/Profile/ProfileFooter'

function UserProfile() {
    const dispatch = useDispatch()
    const userFromSlice = useSelector(state => state.visitedUser?.users)
    const [user,setUser] = useState(userFromSlice)
    const {userId} = useParams()
    console.log(userId);
    
    const search = async() =>{
      let response = await dispatch(profile(userId))
      setUser(response?.payload?.data[0]);
      console.log(response);
    }

    useEffect(()=>{
        search()
    },[])
    
    const toggle = async() => {
        await dispatch(toggleFollow(user?._id))
        search()
    }
  return (
    <div className='bg-black relative min-h-[100vh] text-white'>
      <ProfileHeader user={user} follow={true} toggle={toggle}/>
      <ProfileFooter user={user} />
    </div>
  )
}

export default UserProfile