import React, { useState, useEffect } from 'react'
import profileImg from '../../../assets/profile.png'
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addRepliedComment, deleteComment, editComment, showReplyComments } from '@/redux/commentSlice';
import { FaRegHeart } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import { BsThreeDots, BsThreeDotsVertical } from 'react-icons/bs';
import { commentlikes, toggleCommentlike } from '@/redux/likeSlice';
import { CommentOpt } from '@/components/shadCompo/EditComment';

function ViewComment({info , reply = true }) {
    const dispatch = useDispatch()
    const profileImage = info?.commentedBy?.ProfileImage ? info?.commentedBy?.ProfileImage : profileImg
    const currentUserId = useSelector(state => state.auth?.user)?.user?._id
    const sameUser = currentUserId == info?.commentedBy?._id
    const userUrl = sameUser ? `/myprofile` : `/user/${info?.commentedBy?._id}`

    const [readMore,setReadMore] = useState(false)
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
      commentAt = `${Math.floor(diffMs / 1000)}s ago`
    }

console.log(info);

    const [replyComments,setReplyComments] = useState()
    const ownerOfComment = currentUserId == info?.commentedBy?._id
    const [isCommentLiked,setIsCommentLiked] = useState(false)
    const [likeCount,setLikeCount] = useState()
    const [editable,setEditable] = useState(false)
    const [comment,setComment] = useState(info?.comment)
    const [edited,setEdited] = useState(false)

    useEffect(()=>{
      ;(async()=>{
          let response = await dispatch(showReplyComments(info?._id))
          setReplyComments(response?.payload?.data)
          console.log(response?.payload?.data);
      })()
    },[])

    const load = async()=>{
      let response = await dispatch(commentlikes(info?._id))
      setIsCommentLiked(response?.payload?.data?.isliked[0]?.isLiked ? response?.payload?.data?.isliked[0]?.isLiked : false);
      setLikeCount(response?.payload?.data?.likedUsers?.length)
    }
    useEffect(()=>{
     load()
    },[])

    const toggleCommentLike = async() => {
      await dispatch(toggleCommentlike(info?._id))
      load()
    }

  return (
    <div className= {`relative bg-black  py-5 px-4`} >
      <div className='flex items-center justify-between '>
        <div className='text-white'>
          <div className=' text-gray-400 flex gap-x-3 items-center '>
              <Link to={`${userUrl}`}>
                  <div className='flex gap-x-3  items-center'>
                  <img src={profileImage} alt="post_file" className='w-5 h-5 object-cover rounded-[50%]'/>
                  <h2>{info?.commentedBy?.username}</h2>
                  </div>
              </Link>
              <div className='relative'><h2 className='absolute -top-4'>.</h2></div>
              <h2 className='text-[12px]'>{commentAt}</h2>
              {
                edited &&  <h2 className='text-[12px] font-semibold'>(Edit)</h2>
              }
              <div className='absolute right-0 text-sm z-50'><CommentOpt currentComment={info} selfID={sameUser} isAlreadyReply={reply}/></div>
          </div>
          <h2 className={`my-1 mx-8 w-[55vw] lg:w-[20vw] break-words bg-transparent outline-none ${readMore ? '' : 'truncate'} ${editable ? 'hidden' : 'block'}`} onClick={()=>{setReadMore(prev => !prev)}} >{comment}</h2>
         {
           reply && replyComments?.length > 0 && <Link to = {`/viewreplies/${info?._id}`}>
              <div className='px-8' onClick={()=>{dispatch(addRepliedComment(info))}}>
                <h2 className='text-blue-500 text-sm font-medium'>{replyComments?.length} {replyComments?.length == 1 ? 'Reply' : 'Replies'}</h2>
              </div>
          </Link>
         } 
        </div>
        <div className='text-white pt-6 relative'>
        <button onClick={toggleCommentLike}>{isCommentLiked ? <FaHeart className='text-red-400'/> : <FaRegHeart />}</button>
        <h2 className='absolute text-sm top-11 left-1 italic'>{likeCount}</h2>
        </div>
      </div>
    </div>
  )
}

export default ViewComment