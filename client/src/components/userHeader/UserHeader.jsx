import React, { useState,useEffect } from 'react'
import profileimg from '../../assets/profile.png'
import { useDispatch, useSelector } from 'react-redux'
import { profile } from '../../redux/usersSlice'
import { Link, useNavigate } from 'react-router-dom'
import { toggleFollow } from '../../redux/followSlice'


function UserHeader({user}) {
    const profileImg =  user?.ProfileImage ? user?.ProfileImage : profileimg
    const dispatch = useDispatch()
    const currentUserId = useSelector(state => state.auth?.user[0])?._id || useSelector(state => state.auth?.user)?.user?._id
    const [isFollowed,setIsFollowed] = useState(false)
    const selfAccount = currentUserId == user?._id 
    const userID = selfAccount ? 'myprofile' : `user/${user?._id}`
  
    const search = async() =>{
        let response = await dispatch(profile(user?._id))
        setIsFollowed(response?.payload?.data[0]?.isFollowed);
        }
    useEffect(()=>{
        search()
    },[])

    const toggle = async() => {
        await dispatch(toggleFollow(user?._id))
        search()
    }
  return (
    <div>
        <div className='bg-black text-gray-400 flex justify-between py-3 px-4'>
            <Link to={`/${userID}`}>
                <div className='flex gap-x-3 items-center'>
                <img src={profileImg} alt="post_file" className='w-10 h-10 rounded-[50%] object-fit'/>
                <h2>{user?.username}</h2>
                </div>
            </Link>
            <button className={`${isFollowed ? 'bg-gray-900 bg-opacity-90 border-2 text-white border-gray-700 text-sm py-1 ' : 'block bg-white text-black'} ${selfAccount ? 'invisible' : 'block'}   w-24 text-sm rounded-xl`}  onClick={toggle}>{isFollowed?'Following': 'Follow'}</button>
         </div>
    </div>
  )
}

export default UserHeader