import React from 'react'
import profileImg from '../../../assets/profile.png'
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

function ViewComment({info}) {
    const profileImage = info?.commentedBy?.ProfileImage ? info?.commentedBy?.ProfileImage : profileImg
    const currentUserId = useSelector(state => state.auth?.user)?.user?._id 
    const sameUser = currentUserId == info?.commentedBy?._id
    const userUrl = sameUser ? `/myprofile` : `/user/${info?.commentedBy?._id}`

    let commentAt;
    const commentedAt = new Date(info?.createdAt)
    const currentTime = new Date()
    var diffMs = currentTime.getTime() - commentedAt.getTime();
    var diffDays = Math.floor(diffMs / 86400000); // days
    var diffHrs = Math.floor((diffMs % 86400000) / 3600000); // hours
    var diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes
        
    if(diffDays > 0){
      commentAt = `${diffDays}d ago`;
    }else if(diffHrs > 0){
      commentAt = `${diffHrs}h ago`
    }
    else if(diffMins > 0){
      commentAt = `${diffMins}m ago`
    }
    else{
      commentAt `${diffMs * 60}s ago`
    }

  return (
    <div className='flex bg-black items-center justify-between py-3 px-4 border-b border-gray-800'>
      <div className='text-white'>
         <div className=' text-gray-400 flex gap-x-3 items-center'>
            <Link to={`${userUrl}`}>
                <div className='flex gap-x-3  items-center'>
                <img src={profileImage} alt="post_file" className='w-5 h-5 object-cover rounded-[50%]'/>
                <h2>{info?.commentedBy?.username}</h2>
                </div>
            </Link>
            <div className='relative'><h2 className='absolute -top-4'>.</h2></div>
            <h2 className='text-[12px]'>{commentAt}</h2>
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