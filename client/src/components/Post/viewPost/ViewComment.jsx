import React from 'react'
import profileImg from '../../../assets/profile.png'
import { Link } from 'react-router-dom';

function ViewComment({info}) {
    console.log(info);
    const profileImage = info?.commentedBy?.ProfileImage ? info?.commentedBy?.ProfileImage : profileImg
  return (
    <div className='text-white bg-red-400 z-50'>
         <div className='bg-black text-gray-400 flex justify-between py-3 px-4'>
            <Link to={``}>
                <div className='flex gap-x-3 items-center'>
                <img src={profileImage} alt="post_file" className='w-10'/>
                <h2>{info?.commentedBy?.username}</h2>
                </div>
            </Link>
        </div>
        <h2>{info.comment}</h2>
    </div>
  )
}

export default ViewComment