import React from 'react';
import Header from './Header';
import Like from './Like';
import Comment from './viewPost/Comment';

const Post = ({ post }) => {
  return (
    <div className='h-[65vh] bg-black'>
      <Header post={post}/>
      <Like post={post}/>
      <Comment post={post}/>
    </div>
  );
};

export default Post;
