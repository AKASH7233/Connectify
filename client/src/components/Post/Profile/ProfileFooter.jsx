import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

function ProfileFooter({user}) {
  const [options,setOptions] = useState({
    post:false,
    stories: false,
    likes: false,
    tagged: false
  }) 
  const change = (e) => {
    e.preventDefault();
    console.log(options);
    setOptions({
      post:false,
      stories: false,
      likes: false,
      tagged: false
    })
    console.log(options);
    setOptions({...options, [e.target.name]: !e.target.name})
    console.log(options);
  }
  return (
    <div className='bg-black mt-2'>
        <div className='flex justify-evenly items-center'>
          <button onClick={change} className={`text-gray-400 hover:text-white px-2 py-1 hover:bg-gray-800 rounded-lg ${options.post ? 'bg-gray-800 text-white ' : ''} `}  name='post'>Posts</button>
          <button onClick={change} className={`text-gray-400 hover:text-white px-2 py-1 hover:bg-gray-800 rounded-lg ${options.stories? 'bg-gray-800 text-white ': '' }  `}  name='stories'>Stories</button>
          <button onClick={change} className={`text-gray-400 hover:text-white px-2 py-1 hover:bg-gray-800 rounded-lg ${options.likes ? 'bg-gray-800 text-white ' : ''}  `}  name='likes'>Likes</button>
          <button onClick={change} className={`text-gray-400 hover:text-white px-2 py-1 hover:bg-gray-800 rounded-lg ${options.tagged ? 'bg-gray-800 text-white ' : ''}  `}  name='tagged'>Tagged</button>
        </div>
        <div className='grid grid-cols-2'>
          {user?.posts?.map((post)=>(
            <img key={post?._id} src={post?.postFile} className='mx-3 my-4 w-40 h-40 border-2 border-gray-800 rounded-lg object-cover'/>
          ))}
        </div>
    </div>
  )
}

export default ProfileFooter