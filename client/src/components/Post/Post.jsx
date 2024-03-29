import React, { useEffect, useState } from 'react';
import Header from './Header';
import Like from './Like';
import Comment from './viewPost/Comment';
import ViewLikes from './viewPost/viewLike';
import { IoArrowBackOutline } from "react-icons/io5";
import { useDispatch, useSelector } from 'react-redux';
import { postlikes } from '../../redux/likeSlice';
import { showComments } from '../../redux/commentSlice';
import ViewComment from './viewPost/ViewComment';

const Post = ({ post, toggleMode}) => {
  const dispatch = useDispatch()
  const [liked,setLiked] = useState()
  const [showLikes,setShowLikes] = useState(false)

  const [allComment,setAllComment] = useState()
  const [showAllComments,setAllShowComments] = useState(false)

  useEffect(()=>{
    ;(async()=>{
      let response = await dispatch(postlikes(post?._id))
      setLiked(response?.payload?.data?.likedUsers)
    })()
  },[])

  const loadComments = async()=>{
    let response= await dispatch(showComments(post?._id))
    setAllComment(response?.payload?.data)
    console.log(response);
  }
  useEffect(()=>{
    loadComments()
  },[])
  const togglelike = () =>{
    setShowLikes(true)
    toggleMode()
  }

  const toggleComment = () =>{
    setAllShowComments(true)
    toggleMode()
  }

  const goback = () =>{
    setShowLikes(false)
    setAllShowComments(false)
    toggleMode()
  }
  const loadlastComment = () => {
    loadComments()
  }
  return (
    <div className='relative my-4' >
      <div className={`py-2 bg-black rounded-md `}>
      <Header post={post}/>
      <Like post={post} togglelikes={togglelike} toggleComments={toggleComment}/>
      <Comment post={post} loadlastComment={loadlastComment}/>
      </div>

      {showLikes && 
        <div className='absolute bg-black -bottom-56 min-h-[50vh] max-h-[50vh] z-10 w-full whitespace-nowrap overflow-y-auto'>
          <div className='flex items-center my-2 px-4 gap-x-16'>
            <button className='p-2 rounded-[50%] text-white bg-gray-900 bg-opacity-90 border-2 border-gray-700' onClick={goback}><IoArrowBackOutline  className='text-xl'/></button>
            <h2 className='text-white '>Post liked by</h2>
          </div>
          <div className='min-h-[40vh]'>
          {liked?.length > 0 ? <ViewLikes post={post}/> : <div className='text-white h-[20vh] flex  justify-center items-center text-lg font-medium'>Be First One To Like !</div>}
          </div>
          </div>
      }
      {showAllComments && 
        <div className='absolute bg-black -bottom-56 max-h-[50vh]  min-h-[60vh] z-10 w-full whitespace-nowrap overflow-y-auto'>
          <div className='flex items-center my-2 px-4 gap-x-16'>
            <button className='p-2 rounded-[50%] text-white bg-gray-900 bg-opacity-90 border-2 border-gray-700' onClick={goback}><IoArrowBackOutline  className='text-xl'/></button>
            <h2 className='text-white '>comments</h2>
          </div>
          <div className='min-h-[40vh]'>
          {liked?.length > 0 ? allComment?.map((comment,i)=>(<ViewComment info={comment} key={i}/>)) : <div className='text-white h-[20vh] flex  justify-center items-center text-lg font-medium'>Be First One To Comment !</div>}
          </div>
          </div>
      }
    </div>
  );
};

export default Post;
