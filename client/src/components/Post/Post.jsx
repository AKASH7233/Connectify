import React, { useState } from 'react';
import Header from './Header';
import Like from './Like';
import Comment from './viewPost/Comment';
import ViewLikes from './viewPost/viewLike';
import { IoArrowBackOutline } from "react-icons/io5";


const Post = ({ post }) => {
  const [showLikes,setShowLikes] = useState(false)
  const togglelike = () =>{
    setShowLikes(true)
  }
  const goback = () =>{
    setShowLikes(false)
  }
  console.log(post);
  return (
    <div className='relative'>
      <div className='h-[76vh] bg-black rounded-md '>
      <Header post={post}/>
      <Like post={post} toggle={togglelike}/>
      <Comment post={post}/>
    </div>
    {showLikes && 
      <div className='absolute bg-black -bottom-40 min-h-[50vh] z-10 w-full'>
        <div className='flex items-center my-2 px-4 gap-x-16'>
          <button className='p-2 rounded-[50%] text-white bg-gray-900 bg-opacity-90 border-2 border-gray-700' onClick={goback}><IoArrowBackOutline  className='text-xl'/></button>
          <h2 className='text-white '>Post liked by</h2>
        </div>
        <div className='h-full'>
        {post?.likes ? <ViewLikes post={post}/> : <div className='text-white flex justify-center bg-red-400'><h2>Be First One To Like !</h2></div>}
        </div>
        </div>
    }
    </div>
  );
};

export default Post;
