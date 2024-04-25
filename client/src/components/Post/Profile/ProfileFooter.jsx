import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { FaRegImages } from "react-icons/fa6";
import { FaHeart } from "react-icons/fa6";
import { FaBookmark } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { postliked } from '@/redux/likeSlice';
import { AllBookedPost } from '@/redux/bookMark';


function ProfileFooter({user}) {
  const dispatch = useDispatch()
  const [options,setOptions] = useState('post')
  const [likedposts,setlikedPosts] = useState()
  const [bookedPosts,setBookedPosts] = useState()
  const [render,setRender] = useState(false)
  useEffect(()=>{
    ;(async()=>{
      let response = await dispatch(AllBookedPost())
      console.log(response);
      setBookedPosts(response?.payload?.data)
    })()
  },[])

  useEffect(()=>{
    ;(async()=>{
     let response = await dispatch(postliked(user?._id))
     console.log(response);
     setlikedPosts(response?.payload?.data)
   })()
   },[render])
 
  // console.log(options);
  // console.log(bookedPosts);

  return (
    <div className='bg-black mt-2'>
        <div className='flex justify-evenly items-center text-xl'>
          <button onClick={(e)=>{setOptions('post')}} className={`text-gray-400 hover:bg-gray-900 hover:bg-opacity-90 hover:border-2 hover:border-gray-700 hover:text-white px-10 py-2 rounded-[10px] ${options == 'post' ? ' bg-gray-900 bg-opacity-90 border-2 border-gray-700 text-white' : ''}`}  name='post'><FaRegImages /></button>
          
          <button onClick={(e)=>{setOptions('liked');setRender(prev => !prev)}} className={`text-gray-400 hover:bg-gray-900 hover:bg-opacity-90 hover:border-2 hover:border-gray-700 hover:text-white px-10 py-2 rounded-[10px] ${options == 'liked' ? ' bg-gray-900 bg-opacity-90 border-2 border-gray-700 text-white' : ''}`} name='liked'><FaHeart /></button>
          
          <button onClick={(e)=>{setOptions('bookmark')}} className={`text-gray-400 hover:bg-gray-900 hover:bg-opacity-90 hover:border-2 hover:border-gray-700 hover:text-white px-10 py-2 rounded-[10px] ${options == 'bookmark' ? ' bg-gray-900 bg-opacity-90 border-2 border-gray-700 text-white' : ''}`}  name='bookmark'><FaBookmark /></button>
        </div>
        <div className='flex flex-wrap'>
          {options == 'post' && user?.posts?.map((post)=>(
            <Link to={`/viewpost/${post?._id}/comment`}>
              <img key={post?._id} src={post?.postFile} className='mx-3 my-4 w-40 h-40 border-2 border-gray-800 rounded-lg object-cover'/>
            </Link>
          ))}
          {options == 'post' && user?.posts?.length < 1 && < div className='w-full h-48 flex justify-center items-center text-lg'>No Post !</div> }

          {options == 'liked' && likedposts?.map((post)=>(
            <Link to={`/viewpost/${post?.likedposts?._id}/comment`}>
              <img key={post?.likedposts?._id} src={post?.likedposts?.post} className='mx-3 my-4 w-40 h-40 border-2 border-gray-800 rounded-lg object-cover'/>
            </Link>
          ))}
          {options == 'liked' && likedposts?.length < 1 && < div className='w-full h-48 flex justify-center items-center text-lg'> 0 Post Liked !</div> }

          {options == 'bookmark' && bookedPosts?.map((post)=>(
            <Link to={`/viewpost/${post?.BookedPost[0]?._id}/comment`}>
              <img key={post?.likedposts?._id} src={post?.BookedPost[0]?.postFile} className='mx-3 my-4 w-40 h-40 border-2 border-gray-800 rounded-lg object-cover'/>
            </Link>
          ))}
          {options == 'bookmark' && bookedPosts?.length < 1 && < div className='w-full h-48 flex justify-center items-center text-lg'>0 Bookmarked Post !</div> }

        </div>
    </div>
  )
}

export default ProfileFooter