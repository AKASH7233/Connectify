import React, { useEffect, useState } from 'react'
import LikedBy from './viewPost/viewPost';
import { FaHeart , FaRegHeart , FaRegBookmark, FaBookmark} from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import { postlikes,togglelike } from '../../redux/likeSlice';
import { TbMessage } from "react-icons/tb"
import { IoIosShareAlt } from "react-icons/io";

function Like({post, toggle}) {
  const dispatch = useDispatch()
  const [isAlreadyLiked,setIsAlreadyLiked] = useState(false)
  const [likedBy,setlikedBy] = useState()
  const [search , setSearch ] = useState(false)
  const [viewLike,showLikes] = useState(false)
  const [addToBookMark,setAddToBookMark] = useState(false)
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

  let random = Math.floor(Math.random() * likedBy?.length)
  const LikedBy = likedBy?.length >= 1 ? likedBy[random].users.username : '' 

  const addBookMark = () => {
    setAddToBookMark(prev => !prev)
  }
  
    const togglelike = () =>{
      toggle()
    }
  return (
    <>
      <div className='flex gap-x-3 relative items-center my-4 mx-2 border-b border-gray-500 pb-1'>
        <button onClick={fetch}  className='mx-2 text-xl'>
          {isAlreadyLiked ? <FaHeart className='  text-red-400'/> : <FaRegHeart className='text-white'/>}
        </button>
         <div className='flex items-center gap-1'>
            <h2 className='text-sm text-white'>Liked By</h2>
            <h2 onClick = {showLikes} className={`${likedBy?.length >= 1  ? 'block': 'invisible'} text-white text-md`}>{LikedBy}</h2>
          </div>
          <button onClick={addBookMark} className='text-md absolute right-3 text-gray-300'>
            {addToBookMark ? <FaBookmark/> : <FaRegBookmark />}
          </button>
          {/* //<FaBookmark/> */}
      </div>
      <div className='text-gray-400 text-sm flex justify-evenly -my-3 pb-1 border-b mb-3 border-gray-400'>
        <button onClick={togglelike}>{likedBy?.length} {likedBy?.length > 1 ? 'Likes': 'like'}</button>
        <h2>comments</h2>
        <h2 className='flex items-center gap-1'><IoIosShareAlt className='text-gray-400'/> share</h2>
      </div>
    </>
  )
}

export default Like