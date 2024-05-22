import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { showReplyComments } from '@/redux/commentSlice'
import ViewComment from './ViewComment'
import Comment from './Comment'

function ViewReplies() {
    const {commentId} = useParams()
    const dispatch = useDispatch()
    const RepliedComment = useSelector(state => state.comment?.RepliedComment)
    const [replyComments,setReplyComments] = useState()

    const load = async() => {
        let response = await dispatch(showReplyComments(RepliedComment?._id))
        console.log(response);
        setReplyComments(response?.payload?.data)
    }
    useState(()=>{
        load()
        window.scrollTo(0,0)
    },[commentId])
  return (
    <div className='bg-gray-900 relative h-[100vh] py-4 w-full'>
        <div className='relative mb-5'>
          <h2 className='text-white text-xl italic text-center'>Comment</h2>
          <h2 className='bg-white text-center w-24  h-1 rounded-xl absolute left-[37%] my-1'></h2>
        </div>
        <div className='py-7 mb-10 bg-black'>
          <ViewComment info={RepliedComment} reply={false}/>
        </div>
        <div className='pb-[50px] overflow-hidden'>
          {replyComments?.length > 0  && 
          replyComments.map((reply)=>(
            <ViewComment info={reply} reply={false} key={reply?._id}/>
          ))}
        </div>
        <div className='bg-black z-50 py-3 fixed w-full lg:w-[30%] bottom-0'>
          <Comment post={commentId} reply={true}/>
        </div>
    </div>
  )
}

export default ViewReplies