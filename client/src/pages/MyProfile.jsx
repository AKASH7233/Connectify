import React, { useEffect, useState } from 'react'
import axiosInstance from '../utils/ApiFetch'
import profileImg from '../assets/profile.png'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import ProfileHeader from '../components/ProfileHeader'

function MyProfile() {
    const navigate = useNavigate()
    let [response,setResponse] = useState({})
    const fetch = async() => {
            let data =  await axiosInstance.post('/user/profile')
            setResponse(data.data)

            if(response?.error){
              toast.error(response?.error)
              navigate('/login')
            }
}

    useEffect(()=>{
        fetch()
    },[])
    console.log(response);
  return (
    <div className='bg-black text-white'>
        <ProfileHeader username={response?.data?.username} name={response?.data?.fullName} followers={response?.data?.followers || 0 } following={response?.data?.following || 0} profileImg={response?.data?.ProfileImage} bio = {response?.data?.bio || ""}/>
    </div>
  )
}

export default MyProfile