import React, { useEffect, useState } from 'react'
import axiosInstance from '../utils/ApiFetch'
import toast from "react-hot-toast"
import {useNavigate} from 'react-router-dom'
import Post from '../components/Post/Post'
import DataFetch from '../utils/DataFetch'
import { useSelector } from 'react-redux'

 function Feed () {
  const navigate = useNavigate()
  const user = useSelector(state =>state.user)
  const [data,loading] =  DataFetch('/post/post')
  console.log(user);
  return (
    <div>
      <div>
        {data.data?.map((post)=>(
              <Post key={post._id} post={post}/>
        ))}
      </div>
    </div>
  )
}

export default Feed