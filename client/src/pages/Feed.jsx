import React, { useEffect, useState } from 'react'
import { useDispatch} from 'react-redux'
import {useNavigate} from 'react-router-dom'

import Post from '../components/Post/Post'
import { getPosts } from '../redux/postSlice'

 function Feed () {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [posts,setPosts] = useState(null)
  
  useEffect(()=>{
    (async()=>{
      let data = await (dispatch(getPosts()))
      setPosts(data?.payload.data)
   })()
  },[])
  
  return (
    <div>
      <div className={`bg-black -my-5 `} id='feed'>
        {posts?.map((post)=>(
              <Post key={post._id} post={post} />
        ))}
      </div>
    </div>
  )
}

export default Feed