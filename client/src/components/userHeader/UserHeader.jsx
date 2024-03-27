import React, { useState,useEffect } from 'react'
import profileimg from '../../assets/profile.png'
import { useDispatch, useSelector } from 'react-redux'
import { profile } from '../../redux/usersSlice'
import { Link, useNavigate } from 'react-router-dom'
import { toggleFollow } from '../../redux/followSlice'


function UserHeader({user, userId}) {
    console.log(userId);
    const profileImg =  user?.ProfileImage ? user?.ProfileImage : profileimg
    const dispatch = useDispatch()
    const currentUserId = useSelector(state => state?.auth?.user[0])?._id
    console.log(currentUserId);
    const [isFollowed,setIsFollowed] = useState(false)
    const userID = currentUserId == userId ? 'myprofile' : `user/${userId}`
    const navigate = useNavigate()

    const load = async() => {
        let response = await dispatch(profile(userId))
        console.log(response);
        console.log(response?.payload);
        setIsFollowed(response?.payload?.data[0]?.isFollowed)
        
    }

    useEffect(()=>{
        load()
    },[])

    const fetch = async() => {
        await dispatch(toggleFollow(userId))
        load()
    }
  return (
    <div>
        <div className='bg-black text-gray-400 flex justify-between py-3 px-4'>
            <Link to={`/${userID}`}>
                <div className='flex gap-x-3 items-center'>
                <img src={profileImg} alt="post_file" className='w-10 h-10 rounded-[50%] object-cover'/>
                <h2>{user?.username}</h2>
                </div>
            </Link>
            <button className={` ${isFollowed ? 'invisible' : 'block' } bg-[#C147E9] text-white px-4`} onClick={fetch} >{isFollowed?'Unfollow': 'Follow'}</button>
         </div>
    </div>
  )
}

export default UserHeader