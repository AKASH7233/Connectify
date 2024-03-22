import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import profile from '../../assets/profile.png'
import axiosInstance from '../../utils/ApiFetch';

function Header({post}) {
    const profileImg = post?.owner.profileImage? post?.owner.profileImage : profile
    const currentUser = getCookies('user_id');
    const user_id = post?.owner?._id === currentUser ? 'myprofile' : `/user/${post?.owner?._id}`
    const [isFollowed,setIsFollowed] = useState()
    console.log(currentUser);
    const check =  async()=>{
      let following = await axiosInstance.post(`/follow/following/${post?.owner._id}`)
      
      const followed = following?.data.data[0].following == 0 ? false : following?.data.data[0].following.map((id)=>(currentUser == id)) 
      console.log(String(followed));
      const selfAcccount = post?.owner?._id == currentUser
      console.log(selfAcccount);
      if(followed || selfAcccount){
        setIsFollowed(true)
      }
    }  

    useEffect(()=>{
     check()
    },[])

    const fetch = async() => {
      let resposne = await axiosInstance.post(`/follow/togglefollow/${post?.owner?._id}`)
      console.log(resposne);
      setIsFollowed((prev)=>!prev)
    }


  return (
    <div>
        <div className='bg-black text-gray-400 flex justify-between py-3 px-4'>
            <Link to={`${user_id}`}>
                <div className='flex gap-x-3 items-center'>
                <img src={profileImg} alt="post_file" className='w-10'/>
                <h2>{post?.owner.username}</h2>
                </div>
            </Link>
            <button className={` bg-[#C147E9] text-white px-4`} onClick={fetch} >{isFollowed?'Unfollow': 'Follow'}</button>
         </div>
         <div className='h-72 w-[100vw]'>
            <img src={post?.postFile} alt="postImg" className='h-72 w-[100vw] object-fill'/>
        </div>
    </div>
  )
}

export default Header