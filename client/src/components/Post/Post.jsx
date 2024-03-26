import React from 'react';
import Header from './Header';
import Like from './Like';
import Comment from './viewPost/Comment';

const Post = ({ post }) => {
  return (
    <div className='h-[75vh] bg-black rounded-md '>
      <Header post={post}/>
      <Like post={post}/>
      <Comment post={post}/>
    </div>
  );
};

export default Post;
