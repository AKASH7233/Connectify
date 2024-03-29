import React, { useEffect, useState } from 'react'
import { useDispatch} from 'react-redux'
import {useNavigate} from 'react-router-dom'

import Post from '../components/Post/Post'
import { getPosts } from '../redux/postSlice'

 function Feed () {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [posts,setPosts] = useState(null)
  const [inViewMode,setInViewMode] = useState(false)

  function disableScroll() {
      let scrollTop = window.scrollY || document.documentElement.scrollTop;
      let scrollLeft = window.scrollY || document.documentElement.scrollLeft;
      console.log(screenTop,screenLeft);
      window.onscroll = function() {
      window.scrollTo(scrollLeft, scrollTop);
    };
  }

  function enableScroll() {
     window.onscroll = function() {};
 }
  

  useEffect(()=>{
    (async()=>{
      let data = await (dispatch(getPosts()))
      setPosts(data?.payload.data)
   })()
  },[])
  const toggleMode = () => {
    console.log(inViewMode);
    setInViewMode(prev => !prev)
    inViewMode ? enableScroll() : disableScroll()
  }
  console.log(inViewMode);
  return (
    <div>
      <div className={`bg-gray-800 -my-5  ${inViewMode ? '' : 'overflow-visible'}`} id='feed'>
        {posts?.map((post)=>(
              <Post key={post._id} post={post} toggleMode={toggleMode}/>
        ))}
      </div>
    </div>
  )
}

export default Feed