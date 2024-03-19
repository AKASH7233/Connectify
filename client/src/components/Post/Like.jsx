import React, { useEffect, useState } from 'react'
import LikedBy from './LikedBy';
import { FaHeart , FaRegHeart } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import { postlikes,togglelike } from '../../redux/likeSlice';


function Like({post}) {
  const dispatch = useDispatch()
  const [isAlreadyLiked,setIsAlreadyLiked] = useState(false)
  const [likedBy,setlikedBy] = useState()
  const [search , setSearch ] = useState(false)
   useEffect(()=>{
   ;(async()=>{
      let postLikes = await dispatch(postlikes(post._id))
      setlikedBy(postLikes?.payload?.data?.likedUsers)
      setIsAlreadyLiked(postLikes?.payload?.data?.isliked[0]?.isLiked);
    })()
  },[search])

  const fetch = async() => {
    await dispatch((togglelike(post._id)))
    setSearch(prev=> !prev)
  } 

  return (
    <div className='flex gap-x-3 relative items-center py-4 '>
        <button onClick={fetch}  className='mx-2 text-2xl'>
          {isAlreadyLiked ? <FaHeart className='  text-[#C147E9]'/> : <FaRegHeart className='text-white'/>}
        </button>
          <span className='absolute top-10 left-4 text-white'>{likedBy?.length}</span>
          <LikedBy likedBy={likedBy}/>
    </div>
  )
}

export default Like