import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import profileImage from '../../../assets/profile.png'
import { useDispatch, useSelector } from 'react-redux';
import { profile } from '../../../redux/usersSlice';
import { toggleFollow } from '../../../redux/followSlice';
import { BsChevronCompactLeft, BsChevronCompactRight,BsThreeDotsVertical } from "react-icons/bs";
import { RxDot, RxDotFilled } from "react-icons/rx";
import DrawerPost from '../../shadCompo/Drawer';

function Header({post}) {
    const currentUser = useSelector(state=> state?.auth?.user) 
    const currentUserId = currentUser?.user?._id || currentUser[0]?._id
    const profileImg = post?.owner.ProfileImage ? post?.owner.ProfileImage : profileImage
    const dispatch = useDispatch()
    const [isFollowing,setIsFollowing] = useState()
    const selfID = currentUserId == post?.owner?._id
    const userId = selfID ? 'myprofile' : `user/${post?.owner?._id}`
    
    const [readMore,setReadMore] = useState(false)
    const [showOptions,setShowOptions] = useState(false)

    let postAt;
    const postedAt = new Date(post?.createdAt)
    const currentTime = new Date()
    var diffMs = currentTime.getTime() - postedAt.getTime();
    var diffDays = Math.floor(diffMs / 86400000); // days
    var diffHrs = Math.floor((diffMs % 86400000) / 3600000); // hours
    var diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes
    var diffS = Math.round(((diffMs % 86400000) % 3600000) / 3600000000);    

    if(diffDays > 0){
      postAt = `${diffDays}d ago`;
    }else if(diffHrs > 0){
      postAt = `${diffHrs}h ago`
    }
    else if(diffMins > 0){
      postAt = `${diffMins}m ago`
    }
    else{
      postAt = `${ diffS}s ago`
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

    const [currentIndex,setCurrentIndex] = useState(0)

    const prevSlide = () => {
      const isFirstSlide = currentIndex == 0
      const newIndex = isFirstSlide ? post?.postFile?.length - 1 : currentIndex - 1 
      setCurrentIndex(newIndex)
    }

    const nextSlide = () => {
      const isLastSlide = currentIndex == post?.postFile?.length - 1
      const newIndex = isLastSlide ? 0 : currentIndex + 1
      setCurrentIndex(newIndex)
    }

    const goToSlide = (index) => {
      console.log(index);
      setCurrentIndex(index)
    }

    const toggleDrawer = (res) =>{
      setShowOptions(res)
    }
  return (
    <div>
        <div className=' text-white  flex justify-between items-center rounded-t py-2 mb-2 px-4 '>
            <Link to={`/${userId}`}>
                <div className='flex gap-x-3 items-center'>
                <img src={profileImg} alt="post_file" className='w-10 h-10  rounded-[50%] object-fit '/>
                <div>
                  <h2 className='flex items-center gap-x-4'>{post?.owner.username} {post?.isEdit && <span className='text-sm text-gray-400'>&#40;edited&#41;</span>}</h2>
                  <h2 className='text-gray-400 text-sm'>{postAt}</h2>
                </div>
                </div>
            </Link>
            <div className='flex gap-x-3'>
              <button className={`${!selfID ? 'bg-gray-900 bg-opacity-90 border-2 border-gray-700 text-sm py-2 text-white w-24  rounded-xl' : 'invisible'}` } onClick={fetch} >{isFollowing?'Following': 'Follow'}</button>
              <button className='text-md' onClick={()=>{setShowOptions(prev => !prev)}}><BsThreeDotsVertical/></button>
            </div>
         </div>
         <div className='h-64  px-4 relative'>
            {Array.isArray(post?.postFile) && 
              
              <div style={{backgroundImage : `url(${post?.postFile[currentIndex]})`}} className='rounded-xl w-full bg-center bg-cover bg-no-repeat h-64 duration-400 text-white group'>
                {post?.postFile.length > 1 && <div className='hidden group-hover:block p-2 absolute top-[45%] left-5 rounded-3xl cursor-pointer bg-gray-900 bg-opacity-90 border-2 border-gray-700  '><BsChevronCompactLeft onClick={prevSlide} size={20}/></div>}
                {post?.postFile.length > 1 && <div className='hidden group-hover:block p-2 absolute top-[45%] right-5 rounded-3xl cursor-pointer bg-gray-900 bg-opacity-90 border-2 border-gray-700 '><BsChevronCompactRight onClick = {nextSlide} size={20}/></div>}
                {post.postFile.length > 1 && <div className='right-[40%] -bottom-[70px] flex absolute py-2'>
                  {post?.postFile?.map((slide,i)=>(
                    <div key={i}  onClick={()=>goToSlide(i)} className='cursor-pointer text-sm'>{i == currentIndex ? <RxDotFilled />: <RxDot />} </div>
                  ))}
                </div>}
              </div>
            }
            {!Array.isArray(post?.postFile) && <img src={post?.postFile} alt="postImg" className='h-full w-full  rounded-xl object-fill'/>}
        </div>
        <h2 onClick={()=>{setReadMore(prev => !prev)}} className={`text-gray-400 mt-2 ml-5 w-[80vw] ${readMore ? 'clip' : 'truncate'} break-words`}>{post?.title}</h2>
        {showOptions &&
          <div className='absolute bg-black bottom-0 w-full text-white text-center'>
            {!selfID && <h2 className='py-2'>Do not recommend</h2>}
            {selfID && <div>
              <h2 className='bg-black bg-opacity-90 border-2 border-gray-700 text-sm py-3 text-white '>Hide Post</h2>
              <h2 className='bg-black bg-opacity-90  text-sm py-3 text-white '>Delete Post</h2></div> }
          </div>
        }
        {showOptions && 
            <div className='w-[50vw]'>
              <DrawerPost show={true} selfID={selfID} userId={currentUserId} toggle={toggleDrawer} post={post}/>
            </div>
        }
    </div>
  )
}

export default Header