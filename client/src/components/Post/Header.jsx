import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import profileImage from '../../assets/profile.png'
import { useDispatch, useSelector } from 'react-redux';
import { profile } from '../../redux/usersSlice';
import { toggleFollow } from '../../redux/followSlice';

function Header({post}) {
    const currentUser = useSelector(state=> state?.auth?.user) 
    
    const currentUserId = currentUser?.user?._id || currentUser[0]?._id
    const profileImg = post?.owner.ProfileImage ? post?.owner.ProfileImage : profileImage
    const dispatch = useDispatch()
    const [isFollowing,setIsFollowing] = useState()
    const userId = currentUserId == post?.owner?._id ? 'myprofile' : `user/${post?.owner?._id}`
    
    
    const [readMore,setReadMore] = useState(false)

    let postAt;
    const postedAt = new Date(post?.createdAt)
    const currentTime = new Date()
    var diffMs = currentTime.getTime() - postedAt.getTime();
    var diffDays = Math.floor(diffMs / 86400000); // days
    var diffHrs = Math.floor((diffMs % 86400000) / 3600000); // hours
    var diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes
        
    if(diffDays > 0){
      postAt = `${diffDays}d ago`;
    }else if(diffHrs > 0){
      postAt = `${diffHrs}h ago`
    }
    else if(diffMins > 0){
      postAt = `${diffMins}m ago`
    }
    else{
      postAt `${diffMs * 60}s ago`
    }

    const load = async() =>{
      let response = await dispatch(profile(post?.owner?._id))
      setIsFollowing(response?.payload?.data[0]?.isFollowed)
    }
  
    useEffect(()=>{
      load()
    },[])

    const fetch = async() => {
      await dispatch(toggleFollow(post?.owner?._id))
      load()
    }
  return (
    <div>
        <div className=' text-white flex justify-between rounded-t py-2 mb-2 px-4 border-b border-gray-500'>
            <Link to={`/${userId}`}>
                <div className='flex gap-x-3 items-center'>
                <img src={profileImg} alt="post_file" className='w-10 h-10 rounded-[50%] object-fit '/>
                <div>
                  <h2>{post?.owner.username}</h2>
                  <h2 className='text-gray-400 text-sm'>{postAt}</h2>
                </div>
                </div>
            </Link>
            <button className={` ${userId ? 'invisible' : 'block' } bg-blue-500 rounded  text-white px-5 text-md`} onClick={fetch} >{isFollowing?'Unfollow': 'Follow'}</button>
         </div>
         <div className='h-72 px-2 rounded-xl w-full'>
            <img src={post?.postFile} alt="postImg" className='h-full w-[100vw] rounded-md object-fill'/>
        </div>
        <h2 className={`text-white mt-2  mx-4 w-[80vw] ${readMore ? 'clip' : 'truncate'} break-words`}>{post?.title}</h2>
    </div>
  )
}

export default Header