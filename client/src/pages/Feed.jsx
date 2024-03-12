import React, { useEffect, useState } from 'react'
import axiosInstance from '../utils/ApiFetch'
import toast from "react-hot-toast"
import {useNavigate} from 'react-router-dom'
import Post from '../components/Post/Post'

function Feed() {
  const navigate = useNavigate()
  const [posts,setPosts] = useState()
  const load = async()=> {
      let response = await axiosInstance.post('/post/post')
      if(response?.data.error){
        toast.error(response?.data?.error)
        navigate('/login')
      }
      setPosts(response?.data?.data)
  }
    useEffect(()=>{
      load()
    },[])
  return (
    <div>
      <div>
        {posts?.map((post)=>(
              <Post key={post._id} post={post}/>
        ))}
      </div>
    </div>
  )
}

export default Feed