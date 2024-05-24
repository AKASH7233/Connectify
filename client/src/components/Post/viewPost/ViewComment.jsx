import React, { useState, useEffect } from 'react'
import profileImg from '../../../assets/profile.png'
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addRepliedComment, deleteComment, editComment, showReplyComments } from '@/redux/commentSlice';
import { FaRegHeart } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import { BsThreeDots, BsThreeDotsVertical } from 'react-icons/bs';
import { commentlikes, toggleCommentlike } from '@/redux/likeSlice';

function ViewComment({info , reply = true ,render}) {
    const dispatch = useDispatch()
    const profileImage = info?.commentedBy?.ProfileImage ? info?.commentedBy?.ProfileImage : profileImg
    const currentUserId = useSelector(state => state.auth?.user[0])?._id || useSelector(state => state.auth?.user)?.user?._id
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



    const [replyComments,setReplyComments] = useState()
    const ownerOfComment = currentUserId == info?.commentedBy._id
    const [viewOptions,setViewOptions] = useState(false)
    const [isCommentLiked,setIsCommentLiked] = useState(false)
    const [likeCount,setLikeCount] = useState()
    const [reload,setReload] = useState(true)
    const [editable,setEditable] = useState(false)
    const [comment,setComment] = useState(info?.comment)
    const [edited,setEdited] = useState(false)
    const showOptions = () => {
      setViewOptions(prev => !prev)
    }

    useEffect(()=>{
      ;(async()=>{
          let response = await dispatch(showReplyComments(info?._id))
          setReplyComments(response?.payload?.data)
      })()
    },[reload])

    const load = async()=>{
      let response = await dispatch(commentlikes(info?._id))
      setIsCommentLiked(response?.payload?.data?.isliked[0]?.isLiked ? response?.payload?.data?.isliked[0]?.isLiked : false);
      setLikeCount(response?.payload?.data?.likedUsers?.length)
    }
    useEffect(()=>{
     load()
    },[reload])

    const toggleCommentLike = async() => {
      await dispatch(toggleCommentlike(info?._id))
      load()
    }

    const deletecomment = async() =>{
      await dispatch(deleteComment(info?._id))
      setReload(prev => !prev)
    }

    const startEditingComment = async(e) =>{
      setEditable(true)
      setViewOptions(prev=> !prev)
    }

    const editTheComment = async(e)=>{
      e.preventDefault()
      setComment(e.target.value)
      await dispatch(editComment({url: info?._id, comment: comment}))
      setComment(comment)
      setEditable(prev => !prev)
      setEdited(true)
    }
    console.log(ownerOfComment);
  return (
    <>
      {
        reload && 
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
              <div className='absolute right-4 text-sm z-50'><BsThreeDotsVertical onClick={showOptions}/></div>
          </div>
          {
            !editable && <h2 className={`my-1 mx-8 w-[55vw] lg:w-[20vw] break-words bg-transparent outline-none ${readMore ? '' : 'truncate'} ${editable ? 'hidden' : 'block'}`} onClick={()=>{setReadMore(prev => !prev)}} >{comment}</h2>
          }
          {
            editable && 
            <div>
              <input 
              type="text" 
              value={comment}
              onChange={(e)=>{setComment(e.target.value)}}
              className={`my-1 mx-8 w-[55vw] break-words bg-transparent  outline-none ${readMore ? '' : 'truncate'}`}
              autoFocus
              />
              <button onClick={editTheComment}>edit</button>
            </div>
          }
          {reply && 
            <Link to={`/viewreplies/${info?._id}`}>
              <button onClick={()=>{dispatch(addRepliedComment(info))}} className={`text-blue-500 text-sm mt-2  mx-8 ${replyComments?.length > 0 ?'visible' : 'hidden'}`}>{replyComments?.length} {replyComments?.length > 1 ? 'replies' : 'reply'}</button>
            </Link>
          }
        </div>
        <div className='text-white pt-6 relative'>
        <button onClick={toggleCommentLike}>{isCommentLiked ? <FaHeart className='text-red-400'/> : <FaRegHeart />}</button>
        <h2 className='absolute text-sm top-11 left-1 italic'>{likeCount}</h2>
        </div>
      </div>
      {
        viewOptions && 
        <div className={`text-white text-sm w-[30vw] bg-black flex flex-col whitespace-nowrap absolute right-8 top-5`}>
          {ownerOfComment && <button onClick={startEditingComment} className='w-full  border border-gray-700'>Edit</button>}
          {
            reply && replyComments?.length == 0 &&
            <Link to={`/viewreplies/${info?._id}`}>
            <button onClick={()=>{dispatch(addRepliedComment(info))}} className='w-full border border-gray-700'>reply</button>
          </Link>
          }
          {ownerOfComment  &&  <button onClick={deletecomment} className='w-full border border-gray-700'>delete</button>}
          {!ownerOfComment && <button onClick={()=>setViewOptions(prev => !prev)} className='w-full  border border-gray-700'>Report</button>
}
        </div>
      }
    </div>
      }
    </>
  )
}

export default ViewComment