import React, { useEffect, useState } from 'react'
import { useDispatch} from 'react-redux'
import {useNavigate} from 'react-router-dom'

import { updateRefreshToken } from '@/redux/authSlice'

import { getPosts } from '../../redux/postSlice'
import Blink from '../Blinks/Blink'
import Post from '../Post/post/Post'
import toast from 'react-hot-toast'

 function Feed () {
  const dispatch = useDispatch()
  const [posts,setPosts] = useState(null)
  const navigate = useNavigate()
  
  useEffect(()=>{
    (async()=>{
      let data = await (dispatch(getPosts()))
      if(data?.payload?.error){
        toast.error(data?.payload?.error)
        navigate('/login')
      }
      setPosts(data?.payload.data)
    })()
  },[])

  ;(async()=>{
    let resp = await dispatch(updateRefreshToken())
  })()

  
  return (
    <div>
      <div><Blink/></div>
      <div className={`bg-black -my-5 `} id='feed'>
        {posts?.map((post)=>(
              <Post key={post._id} post={post} />
        ))}
      </div>
    </div>
  )
}

export default Feed