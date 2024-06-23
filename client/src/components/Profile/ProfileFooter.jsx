import React, { useEffect, useState } from 'react'
import { FaUserTag } from "react-icons/fa";
import { FaRegImages } from "react-icons/fa6";
import { FaHeart } from "react-icons/fa6";
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom';
import { postliked } from '@/redux/likeSlice';
import { getTaggedpost, myPosts } from '@/redux/postSlice';


function ProfileFooter({user}) {
  const dispatch = useDispatch()
  const [options,setOptions] = useState('post')
  const [likedposts,setlikedPosts] = useState()
  const [userpost, setUserpost] = useState()
  const [taggedPosts,settaggedPosts] = useState()
  const [render,setRender] = useState(false)
  const [loading,setLoading] = useState(false)

  useEffect(()=>{
    (async()=>{
      setLoading(true)
      let response = await dispatch(getTaggedpost(user?._id))
      settaggedPosts(response?.payload?.data)
      setLoading(false)
    })()
  },[render])

  useEffect(()=>{
    (async()=>{
      setLoading(true)
      let response = await dispatch(myPosts(user?._id))
      setUserpost(response?.payload?.data)
      setLoading(false)
    })()
  },[render,user])

  useEffect(()=>{
    (async()=>{
      setLoading(true)
     let response = await dispatch(postliked(user?._id))
     setlikedPosts(response?.payload?.data)
     setLoading(false)
   })()
   },[render])
 
   if(loading){
     return (
       <div className='flex justify-center items-center'>
         <div className='animate-spin rounded-full h-10 w-10 border-4 border-gray-400'></div>
       </div>
     )
   }

  return (
    <div className='bg-black mt-2 min-h-[50vh]'>
        <div className='flex justify-evenly items-center text-xl'>
          <button onClick={()=>{setOptions('post')}} className={`text-gray-400 hover:bg-gray-900 hover:bg-opacity-90 hover:border-2 hover:border-gray-700 hover:text-white px-10 py-2 rounded-[10px] ${options == 'post' ? ' bg-gray-900 bg-opacity-90 border-2 border-gray-700 text-white' : ''}`}  name='post'><FaRegImages /></button>
          
          <button onClick={()=>{setOptions('liked');setRender(prev => !prev)}} className={`text-gray-400 hover:bg-gray-900 hover:bg-opacity-90 hover:border-2 hover:border-gray-700 hover:text-white px-10 py-2 rounded-[10px] ${options == 'liked' ? ' bg-gray-900 bg-opacity-90 border-2 border-gray-700 text-white' : ''}`} name='liked'><FaHeart /></button>
          
          <button onClick={()=>{setOptions('bookmark')}} className={`text-gray-400 hover:bg-gray-900 hover:bg-opacity-90 hover:border-2 hover:border-gray-700 hover:text-white px-10 py-2 rounded-[10px] ${options == 'bookmark' ? ' bg-gray-900 bg-opacity-90 border-2 border-gray-700 text-white' : ''}`}  name='bookmark'><FaUserTag /></button>
        </div>
        <div className='lg:mx-10 flex flex-wrap min-h-[50vh]'>
          {options == 'post' && userpost?.map((post)=>{
            const post_file = Array.isArray(post?.postFile) ? post?.postFile[0] : post?.postFile
               return <Link to={`/viewpost/${post?._id}/comment`}><img key={post?._id} src={post_file} className='mx-3 my-4 w-40 md:w-36 md:object-fill h-40 border-2 border-gray-800 rounded-lg object-cover'/></Link>
  
          })}

          {options == 'post' && userpost?.length == 0 && < div className='w-full  flex justify-center items-center text-lg'>No Post !</div> }

          {/* {options == 'post' && user?.posts?.map((post)=>{
            const post_file = Array.isArray(post?.postFile) ? post?.postFile[0] : post?.postFile
               return <Link key={post?._id} to={`/viewpost/${post?._id}/comment`}><img key={post?._id} src={post_file} className='mx-3 my-4 w-40 md:w-36 lg:w-40 md:object-fill h-40 border-2 border-gray-800 rounded-lg object-cover'/></Link>
          })} */}
          

          {options == 'liked' && likedposts?.map((post)=>(
            <Link key={post?.likedposts?._id} to={`/viewpost/${post?.likedposts?._id}/comment`}>
              <img key={post?.likedposts?._id} src={post?.likedposts?.post} className='mx-3 my-4 w-40 md:w-36 lg:w-40 md:object-fill h-40 border-2 border-gray-800 rounded-lg object-cover'/>
            </Link>
          ))}
          {options == 'liked' && likedposts?.length < 1 && < div className='w-full   flex justify-center items-center text-lg'> 0 Post Liked !</div> }

          {options == 'bookmark' && taggedPosts?.map((post)=>(
            <Link key={post?._id} to={`/viewpost/${post?._id}/comment`}>
              <img key={post?._id} src={post?.postFile} className='mx-3 my-4 w-40 md:w-36 lg:w-40 md:object-fill h-40 border-2 border-gray-800 rounded-lg object-cover'/>
            </Link>
          ))}
          {options == 'bookmark' && taggedPosts?.length < 1 && < div className='w-full   flex justify-center items-center text-lg'>0 Tagged Post !</div> }

        </div>
    </div>
  )
}

export default ProfileFooter