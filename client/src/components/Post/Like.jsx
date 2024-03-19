import React, { useEffect, useState } from 'react'
import { CiHeart } from "react-icons/ci";
import axiosInstance from '../../utils/ApiFetch';
import { FaHeart } from "react-icons/fa";
import getCookies from '../../utils/Cookies/GetCookie';
import { useDispatch, useSelector } from 'react-redux';
import { postlikes,togglelike } from '../../redux/likeSlice';


function Like({post}) {
  const dispatch = useDispatch()
  const [isAlreadyLiked,setIsAlreadyLiked] = useState(false)
  console.log(isAlreadyLiked);
  const [LikedBy,setLikedBy] = useState(null)
  const [search , setSearch ] = useState(false)
   useEffect(()=>{
   ;(async()=>{
      let postLikes = await dispatch(postlikes(post._id))
      setLikedBy(postLikes?.payload?.data)
      setIsAlreadyLiked(postLikes?.payload?.data?.isLiked);
    })()
  },[search])

  const fetch = async() => {
    await dispatch((togglelike(post._id)))
    setSearch(prev=> !prev)
  } 
  console.log(isAlreadyLiked);

  console.log(LikedBy);
  return (
    <div className='flex gap-x-3 items-center py-4 '>
        <button onClick={fetch} className='relative text-white'>
          {isAlreadyLiked ? 'hello' : 'hell'}
          <span className='absolute top-6 left-3 text-white'>{LikedBy?.length}</span></button>
        <h2 className={`${LikedBy?.length >= 1  ? 'block': 'invisible'} text-white`}>Liked By {LikedBy?.users?.username}</h2>
        <h2></h2>
    </div>
  )
}

export default Like