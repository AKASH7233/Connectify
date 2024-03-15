import React, { useEffect, useState } from 'react'
import axiosInstance from '../utils/ApiFetch'
import profileImg from '../assets/profile.png'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import ProfileHeader from '../components/ProfileHeader'
import { useDispatch, useSelector } from 'react-redux'

function MyProfile() {
    const navigate = useNavigate()
    const user = useSelector(state => state?.auth?.user).user
    console.log(user);
  return (
    <div className='bg-black text-white'>
        <ProfileHeader username={user?.username} name={user?.fullName} followers={user?.followers || 0 } following={user?.following || 0} profileImg={user?.ProfileImage} bio = {user?.bio || ""}/>
    </div>
  )
}

export default MyProfile