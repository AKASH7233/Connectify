import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import profileImage from '../../assets/profile.png'
import axiosInstance from '../../utils/ApiFetch';
import { useDispatch, useSelector } from 'react-redux';
import { profile } from '../../redux/usersSlice';
import { toggleFollow } from '../../redux/followSlice';

function Header({post}) {
    const currentUser = useSelector(state=> state?.auth?.user)
    const currentUserId = currentUser[0]?._id
    const profileImg = post?.owner.profileImage ? post?.owner.profileImage : profileImage
    const dispatch = useDispatch()
    const isFollow = useSelector(state => state.visitedUser?.users[0]?.isFollowed)
    const [isFollowed,setIsFollowed] = useState(isFollow)
    const userId = currentUserId == post?.owner?._id ? 'myprofile' : `user/${post?.owner?._id}`
  
    const load = async() =>{
      console.log(post?.owner?._id);
      let response = await dispatch(profile(post?.owner?._id))
      setIsFollowed(response?.payload?.data[0]?.isFollowed)
    }
  
    useEffect(()=>{
      load()
    },[])

    const fetch = async() => {
      await dispatch(toggleFollow(post?._id))
      load()
    }
  return (
    <div>
        <div className=' text-white flex justify-between rounded-t py-2 mb-2 px-4 border-b border-gray-500'>
            <Link to={`/${userId}`}>
                <div className='flex gap-x-3 items-center'>
                <img src={profileImg} alt="post_file" className='w-10'/>
                <h2>{post?.owner.username}</h2>
                </div>
            </Link>
            <button className={` ${isFollowed ? 'invisible' : 'block' } bg-blue-500 rounded-lg  text-white px-5 text-md`} onClick={fetch} >{isFollowed?'Unfollow': 'Follow'}</button>
         </div>
         <div className='h-72 px-4 rounded-xl w-full'>
            <img src={post?.postFile} alt="postImg" className='h-full w-[100vw]  object-fill'/>
        </div>
    </div>
  )
}

export default Header