import React, { useEffect, useState } from 'react'
import { useDispatch} from 'react-redux'
import {useNavigate} from 'react-router-dom'

import Post from '../Post/post/Post'
import { getPosts } from '../../redux/postSlice'
import { updateRefreshToken } from '@/redux/authSlice'

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

  ;(async()=>{
    let resp = await dispatch(updateRefreshToken())
    console.log(resp);
  })()

  
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