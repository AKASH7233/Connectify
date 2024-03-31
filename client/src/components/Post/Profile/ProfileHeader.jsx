import React,{useState, useEffect} from 'react';
import profileImg from '../../../assets/profile.png'
import toast from 'react-hot-toast'
import { Link, useNavigate } from 'react-router-dom'
import { BsThreeDots } from "react-icons/bs";
import { IoArrowBackOutline } from "react-icons/io5";

const ProfileHeader = ({user, follow, toggle}) => {
    const goback = () =>{
      window.history.go(-1)
    }
    const togglefollow = () =>{
      toggle()
    }
    const profile = user?.ProfileImage ? user?.ProfileImage : profileImg
    return (
      <div className='p-4'>
        <header className='flex justify-between items-center mb-5 px-2'>
          <button className='p-2 rounded-[50%] bg-gray-900 bg-opacity-90 border-2 border-gray-700' onClick={goback}><IoArrowBackOutline  className='text-xl'/></button>
          <button className='p-2 rounded-[50%] bg-gray-900 bg-opacity-90 border-2 border-gray-700'><BsThreeDots /></button>
        </header>
        
          <img src={profile} alt="profileImg" className='w-28 h-28 mx-28 border-gray-400 border-2 p-1 rounded-[50%] object-cover'/>
          <div>
              <h2 className='text-center mt-2 text-xl '>{user?.fullName}</h2>
              <h2 className='text-gray-500 text-center'>@{user?.username}</h2>
              <p className='text-gray-400'>{user?.bio}</p>
          </div>
        
          <div className='flex justify-between items-center px-4 my-3'>
            <div>
              <h2 className='text-center'>{user?.posts?.length}</h2>
              <p className='text-gray-500'>{user?.posts?.length > 1 ? 'Posts' : 'Post' }</p>
            </div>
           <Link to={`/followlist/Followers/${user?._id}`}>
            <div>
                <h2 className='text-center'>{user?.FollowersCount}</h2>
                <p className='text-gray-500'>{user?.FollowersCount > 1 ? 'Followers' : 'Follower' }</p>
              </div>
           </Link>
           <Link to={`/followlist/Following/${user?._id}`}>
           <div>
              <h2 className='text-center'>{user?.FollowingCount}</h2>
              <p className='text-gray-500'>{user?.FollowingCount > 1 ? 'Followings' : 'Following'  }</p>
            </div>
           </Link>
            
          </div>
          {
            follow ? <div className='flex mt-7 gap-3 px-2'>
            <button className='px-6 py-2 w-40 rounded-lg bg-blue-500 ' onClick={togglefollow}>{user?.isFollowed ? 'UnFollow' : 'Follow' }</button>
            <button className='px-6 py-2 w-40 rounded-lg bg-gray-800 '>Message</button>
        </div> : <button className='mx-3 px-10 my-2 py-3 w-80 rounded-lg text-lg bg-blue-500 '>Edit Your Profile</button>
          }
      </div>
  );
};

export default ProfileHeader;
