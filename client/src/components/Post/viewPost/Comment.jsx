import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { IoMdSend } from "react-icons/io";
import toast from 'react-hot-toast';
import { addComments, showComments } from '../../../redux/commentSlice';

function Comment({post}) {
    const dispatch = useDispatch()
    const comments = useSelector(state=> state.comment?.comments)
    const [Comment,setComment] = useState(comments)
    const [addComment,setAddComment] = useState('')
    const [reRender,setReRender] = useState(false)
    useEffect(()=>{
        ;(async()=>{
            let response= await dispatch(showComments(post?._id))
            setComment(response)
            console.log(response);
        })()
    },[reRender])

    const uploadComment = async(e) => {
        e.preventDefault()
        if(addComment.trim() == ''){
            toast.error('Comment is required !')
            return null
        }
        console.log(addComment);
        let response = await dispatch(addComments({url:`${post?._id}`,comment:addComment}))
        console.log(response);
        setReRender(prev=>!prev)
    }
  return (
    <div>
        <input 
        type="text" 
        value={addComment}
        onChange={(e)=>{setAddComment(e.target.value)}}
        />
        <button onClick={uploadComment}><IoMdSend className='text-white'/></button>

    </div>
  )
}

export default Comment