import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import profileImage from '../../assets/profile.png'
import axiosInstance from '../../utils/ApiFetch';
import { useDispatch, useSelector } from 'react-redux';
import { profile } from '../../redux/usersSlice';
import { toggleFollow } from '../../redux/followSlice';

function Header({post}) {
    const currentUser = useSelector(state=> state?.auth?.user)
    const profileImg = post?.owner.profileImage? post?.owner.profileImage : profileImage
    const dispatch = useDispatch()
    const isFollow = useSelector(state=>state?.user?.isFollow)
    const [isFollowed,setIsFollowed] = useState(isFollow)
    useEffect(()=>{
      ;(async()=>{
        let response = await dispatch(profile(post?.owner?._id))
        setIsFollowed(response?.payload?.data[0]?.isFollowed)
      })()
    },[])

    const fetch = async() => {
      let response = await dispatch(toggleFollow(post?._id))
      console.log(response);
    }


  return (
    <div>
        <div className='bg-black text-gray-400 flex justify-between py-3 px-4'>
            <Link to={``}>
                <div className='flex gap-x-3 items-center'>
                <img src={profileImg} alt="post_file" className='w-10'/>
                <h2>{post?.owner.username}</h2>
                </div>
            </Link>
            <button className={` ${isFollowed ? 'invisible' : 'block' } bg-[#C147E9] text-white px-4`} onClick={fetch} >{isFollowed?'Unfollow': 'Follow'}</button>
         </div>
         <div className='h-72 w-[100vw]'>
            <img src={post?.postFile} alt="postImg" className='h-72 w-[100vw] object-fill'/>
        </div>
    </div>
  )
}

export default Header