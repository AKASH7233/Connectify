import React, { useEffect, useState } from 'react'
import { CiHeart } from "react-icons/ci";
import axiosInstance from '../../utils/ApiFetch';
import { FaHeart } from "react-icons/fa";
import getCookies from '../../utils/Cookies/GetCookie';


function Like({post}) {
  const currentuser = getCookies('user_id') 
  const [LikedBy,setLikedBy] = useState(null)
  const [isLiked,setIsLiked] = useState(false)
  useEffect(()=>{
   ( async()=>{

      let likedBy = await axiosInstance.post(`/like/postlikes/${post?._id}`)
      setLikedBy(likedBy?.data)

      if(likedBy?.data?.data.length == 0){
        setIsLiked(false)
      }else{
        if(likedBy?.data?.data.map((users)=>{
          return users.users._id == currentuser
        })) return setIsLiked(true);
      }
    })()
  },[])


      
      

  const fetch = async() => {
    await axiosInstance.post(`/like/togglelike/${post?._id}`)
    
    let likedBy = await axiosInstance.post(`/like/postlikes/${post?._id}`)
    if(likedBy?.data?.data.length == 0){
      setIsLiked(false)
    }else{
      if(likedBy?.data?.data.map((users)=>{
        return users.users._id == currentuser
      })) return setIsLiked(true);
    }
  } 


  return (
    <div className='flex gap-x-3 items-center py-4 '>
        <button onClick={fetch} className='relative'>
          {isLiked? <FaHeart className='text-red-400 mx-2 text-2xl'/> : <CiHeart className={`text-white text-3xl`}/> }
          <span className='absolute top-6 left-3 text-white'>{LikedBy?.data.length}</span></button>
        <h2 className={`${LikedBy?.data.length >= 1  ? 'block': 'invisible'} text-white`}>Liked By {LikedBy?.data[0]?.users?.username}</h2>
        <h2></h2>
    </div>
  )
}

export default Like