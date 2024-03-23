import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { profile } from '../redux/usersSlice'
import { useParams } from 'react-router-dom'
import ProfileImg from '../assets/profile.png'
import { toggleFollow } from '../redux/followSlice'

function UserProfile() {
    const dispatch = useDispatch()
    const userFromSlice = useSelector(state => state.visitedUser?.users)
    const [user,setUser] = useState(userFromSlice)
    const {userId} = useParams()
    console.log(userId);
    
    const search = async() =>{
            let response = await dispatch(profile(userId))
            setUser(response?.payload?.data[0]);
            console.log(response);
    }

    useEffect(()=>{
        search()
    },[])
    
   
    const profileImg = user?.ProfileImage ? user?.ProfileImage : ProfileImg

    const toggle = async() => {
        await dispatch(toggleFollow(user?._id))
        search()
    }
  return (
    <div>
         <div className='p-4'>
        <div className='flex gap-x-8'>
          <img src={profileImg} alt="profileImg" className='w-20 h-20 rounded-[50%] object-cover'/>
          <div className='flex gap-x-5 items-center'>
            <div>
              <h2 className='text-center'>{user?.posts?.length}</h2>
              <p className='text-gray-500'>posts</p>
            </div>
            <div>
              <h2 className='text-center'>{user?.FollowersCount}</h2>
              <p className='text-gray-500'>Followers</p>
            </div>
            <div>
              <h2 className='text-center'>{user?.FollowingCount}</h2>
              <p className='text-gray-500'>Following</p>
            </div>
          </div>
        </div>
        <div className='flex my-4 gap-x-10 px-4'>
          <div>
            <h2>{user?.fullName}</h2>
            <h2 className='text-gray-500'>@{user?.username}</h2>
            <p className='text-gray-400'>{user?.bio}</p>
          </div>
          <div>
            <button className='px-20 py-2 w-60 font-medium bg-[#C147E9] rounded-sm' onClick={toggle}>{user?.isFollowed ? 'UnFollow': 'Follow'}</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserProfile