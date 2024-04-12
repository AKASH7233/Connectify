import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { FaRegImages } from "react-icons/fa6";
import { FaHeart } from "react-icons/fa6";
import { FaBookmark } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { postliked } from '@/redux/likeSlice';

function ProfileFooter({user}) {
  const dispatch = useDispatch()
  const [options,setOptions] = useState()
  const [posts,setPosts] = useState(user?.posts)
  useEffect(()=>{
    setOptions('post')
    setPosts(user?.posts)
  },[])


  const change = async(e) => {
    setOptions(e.target.name)
    if(e.target.name == 'post'){
      setPosts(user?.posts)
    }
    if(e.target.name == 'liked'){
      let response = await dispatch(postliked())
      console.log(response);
      setPosts(response?.payload?.data)
    }
  }
  console.log(options);
  console.log(posts);

  return (
    <div className='bg-black mt-2'>
        <div className='flex justify-evenly items-center text-xl'>
          <button onClick={change} className={`text-gray-400 hover:bg-gray-900 hover:bg-opacity-90 hover:border-2 hover:border-gray-700 hover:text-white px-10 py-2 rounded-[10px] ${options == 'post' ? ' bg-gray-900 bg-opacity-90 border-2 border-gray-700 text-white' : ''}`}  name='post'><FaRegImages /></button>
          <button onClick={change} className={`text-gray-400 hover:bg-gray-900 hover:bg-opacity-90 hover:border-2 hover:border-gray-700 hover:text-white px-10 py-2 rounded-[10px] ${options == 'liked' ? ' bg-gray-900 bg-opacity-90 border-2 border-gray-700 text-white' : ''}`} name='liked'><FaHeart /></button>
          <button onClick={change} className={`text-gray-400 hover:bg-gray-900 hover:bg-opacity-90 hover:border-2 hover:border-gray-700 hover:text-white px-10 py-2 rounded-[10px] ${options == 'bookmark' ? ' bg-gray-900 bg-opacity-90 border-2 border-gray-700 text-white' : ''}`}  name='bookmark'><FaBookmark /></button>
        </div>
        <div className='grid grid-cols-2'>
          {posts?.map((post)=>(
            <Link to={`/viewpost/${post?._id}/comment`}>
              <img key={post?._id} src={post?.postFile} className='mx-3 my-4 w-40 h-40 border-2 border-gray-800 rounded-lg object-cover'/>
            </Link>
          ))}
        </div>
    </div>
  )
}

export default ProfileFooter