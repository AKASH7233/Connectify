import React, { useEffect, useState } from 'react'
import { FaHeart , FaRegHeart , FaRegBookmark, FaBookmark} from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import { postlikes,togglelike } from '../../../redux/likeSlice';
import { IoIosShareAlt } from "react-icons/io";
import { Link } from 'react-router-dom';

function Like({post, togglelikes, render}) {
  const dispatch = useDispatch()
  const [isAlreadyLiked,setIsAlreadyLiked] = useState(false)
  const [likedBy,setlikedBy] = useState()
  const [search , setSearch ] = useState(false)
  const [viewLike,showLikes] = useState(false)
  const [viewComment, setViewComment] = useState(false)
  const [addToBookMark,setAddToBookMark] = useState(false)
   useEffect(()=>{
   ;(async()=>{
      let postLikes = await dispatch(postlikes(post._id))
      setlikedBy(postLikes?.payload?.data?.likedUsers)
      setIsAlreadyLiked(postLikes?.payload?.data?.isliked[0]?.isLiked);
    })()
  },[search])

  const fetch = async() => {
    await dispatch((togglelike(post?._id)))
    setSearch(!search)
    render()
  } 

  let random = Math.floor(Math.random() * likedBy?.length)
  const LikedBy = likedBy?.length >= 1 ? likedBy[random].users.username : '' 

  const addBookMark = () => {
    setAddToBookMark(prev => !prev)
  }
  
    const fetchNewLikes = () =>{
      togglelikes()
    }
    
  return (
    <>
      <div className='flex gap-x-3 relative items-center mt-2 mb-4 mx-2 border-b border-gray-500 pb-1'>
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
      </div>
      <div className='text-gray-400 text-sm flex justify-evenly -my-3 pb-1 border-b mb-3 border-gray-400'>
        <Link to={`/likes/${post?._id}`}>
        <button onClick={fetchNewLikes}>{likedBy?.length} {likedBy?.length > 1 ? 'Likes': 'like'}</button>
        </Link> 
        <Link to={`/viewpost/${post?._id}/comment`}>
          <button>comments</button> 
        </Link>
        <h2 className='flex items-center gap-1'><IoIosShareAlt className='text-gray-400'/> share</h2>
      </div>
    </>
  )
}

export default Like