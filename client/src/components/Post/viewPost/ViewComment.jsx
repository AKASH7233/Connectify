import React from 'react'
import profileImg from '../../../assets/profile.png'
import { Link } from 'react-router-dom';

function ViewComment({info}) {
    const profileImage = info?.commentedBy?.ProfileImage ? info?.commentedBy?.ProfileImage : profileImg
  return (
    <div className='flex bg-black items-center justify-between py-3 px-4 border-b border-gray-800'>
      <div className='text-white'>
         <div className=' text-gray-400 flex justify-between'>
            <Link to={``}>
                <div className='flex gap-x-3  items-center'>
                <img src={profileImage} alt="post_file" className='w-5 h-5 object-cover rounded-[50%]'/>
                <h2>{info?.commentedBy?.username}</h2>
                </div>
            </Link>
        </div>
        <h2 className='my-1 mx-8'>{info.comment}</h2>
      </div>
      <div className='text-white'>
        heart
      </div>
    </div>
  )
}

export default ViewComment