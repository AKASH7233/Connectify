import React, { useEffect, useState } from 'react'
import { CiHeart } from "react-icons/ci";
import axiosInstance from '../../utils/ApiFetch';

function Like({post}) {
  const [likedBy,setLikedBy] = useState(null)
  useEffect(()=>{
   ( async()=>{
      let likedBy = await axiosInstance.post(`/like/postlikes/${post?._id}`)
      setLikedBy(likedBy.data)
      let likedpost = await axiosInstance.post(`like/postliked`)
      
    })()
  },[])
  console.log(likedBy);
  const fetch = async() => {
    let response = await axiosInstance.post(`/like/togglelike/${post?._id}`)
    console.log(response)
    let likedBy = await axiosInstance.post(`/like/postlikes/${post?._id}`)
    setLikedBy(likedBy.data)
  }
   
  return (
    <div className='flex gap-x-3 items-center py-4 bg-red-400'>
        <button onClick={fetch} className='relative'><CiHeart className='text-white text-3xl'/><span className='absolute top-6 left-3 text-white'>{likedBy?.data.length}</span></button>
        <h2 className={`${likedBy?.data.length >= 1  ? 'block': 'invisible'} text-white`}>Liked By {likedBy?.data[0]?.users?.username}</h2>
        <h2></h2>
    </div>
  )
}

export default Like