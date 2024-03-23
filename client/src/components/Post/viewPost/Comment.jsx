import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { IoMdSend } from "react-icons/io";
import toast from 'react-hot-toast';
import { addComments, showComments } from '../../../redux/commentSlice';
import ViewComment from './ViewComment';

function Comment({post}) {
    const dispatch = useDispatch()
    const comments = useSelector(state=> state.comment?.comments)
    const [Comment,setComment] = useState(comments)
    const [addComment,setAddComment] = useState('')
    const [reRender,setReRender] = useState(false)
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
    }
  return (
    <div>
        <input 
        type="text" 
        value={addComment}
        onChange={(e)=>{setAddComment(e.target.value)}}
        />
        <button onClick={uploadComment}><IoMdSend className='text-white'/></button>
        {
            Comment.length > 0 ?  <div>
            {Comment?.map((comment,i)=>(
                <ViewComment key={i} info={comment}/>
            ))}
        </div> : 'No Comments'
        }
    </div>
  )
}

export default Comment