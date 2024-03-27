import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { IoMdSend } from "react-icons/io";
import toast from 'react-hot-toast';
import { addComments, showComments } from '../../../redux/commentSlice';
import ViewComment from './ViewComment';
import profile from '../../../assets/profile.png'

function Comment({post}) {
    const dispatch = useDispatch()
    const currentUserProfileImg = useSelector(state => state?.auth?.user)?.ProfileImage
    const comments = useSelector(state=> state.comment?.comments)
    const [Comment,setComment] = useState(comments)
    const [addComment,setAddComment] = useState('')
    const [reRender,setReRender] = useState(false)
    const profileImg = currentUserProfileImg? currentUserProfileImg : profile

    useEffect(()=>{
        ;(async()=>{
            let response= await dispatch(showComments(post?._id))
            setComment(response?.payload?.data)
        })()
    },[reRender])

    const uploadComment = async(e) => {
        e.preventDefault()
        if(addComment.trim() == ''){
            toast.error('Comment is required !')
            return null
        }
        await dispatch(addComments({url:`${post?._id}`,comment:addComment}))
        setReRender(prev=>!prev)
        setAddComment('')
    }
  return (
    <div className='flex justify-evenly items-center'>
        <img src={profile} alt="" className='w-10 h-10 rounded-[50%] object-cover' />
        <input 
        type="text" 
        value={addComment}
        onChange={(e)=>{setAddComment(e.target.value)}}
        placeholder='Add a comment'
        className=' text-white bg-gray-800 rounded-sm outline-none mx-4 py-1 px-2'
        />
        <button onClick={uploadComment}><IoMdSend className='text-gray-500 text-xl'/></button>
        {/* {
            Comment.length > 0 ?  <div>
            {Comment?.map((comment,i)=>(
                <ViewComment key={i} info={comment}/>
            ))}
        </div> : 'No Comments'
        } */}
    </div>
  )
}

export default Comment