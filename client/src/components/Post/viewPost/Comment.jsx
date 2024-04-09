import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { IoMdSend } from "react-icons/io";
import toast from 'react-hot-toast';
import { addComments, replyToComment } from '../../../redux/commentSlice';
import ViewComment from './ViewComment';
import profile from '../../../assets/profile.png'

function Comment({post ,reply=false, render}) {
    const dispatch = useDispatch()
    const currentUserProfileImg = useSelector(state => state?.auth?.user)?.ProfileImage
    const [addComment,setAddComment] = useState('')
    const profileImg = currentUserProfileImg? currentUserProfileImg : profile

    const uploadComment = async(e) => {
        e.preventDefault()
        if(addComment.trim() == ''){
            toast.error('Comment is required !')
            return null
        }
        reply ? await dispatch(replyToComment({url:`${post}`,comment:addComment}))  : await dispatch(addComments({url:`${post?._id}`,comment:addComment})) 
        setAddComment('')
        render ?  console.log(render) : ''
    }
  return (
    <>
         <div className='flex justify-evenly items-center '>
        <img src={profileImg} alt="" className='w-10 h-10 rounded-[50%] object-cover' />
        <input 
        type="text" 
        value={addComment}
        onChange={(e)=>{setAddComment(e.target.value)}}
        placeholder={`Add a ${reply ? 'Reply' :'Comment'}`} 
        className=' text-white bg-gray-800 rounded-sm outline-none mx-4 py-1 px-2'
        />
        <button onClick={uploadComment}><IoMdSend className='text-gray-500 text-xl'/></button>
    </div>
    {/* {
            Comment.length > 0 ?  <div className='z-10 absolute'>
            {Comment?.map((comment,i)=>(
                <ViewComment key={i} info={comment}/>
            ))}
        </div> : 'No Comments'
        } */}
    </>
  )
}

export default Comment