import React from 'react';
import Header from './Header';
import Like from './Like';

const Post = ({ post }) => {
  return (
    <div className='h-[65vh] bg-black'>
      <Header post={post}/>
      <Like post={post}/>
    </div>
  );
};

export default Post;
