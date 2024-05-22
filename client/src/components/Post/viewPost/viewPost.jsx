import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Header from '../post/Header'
import Like from '../post/Like';
import Comment from './Comment';
import { useParams } from 'react-router-dom';
import { getVisitedPosts } from '@/redux/postSlice';
import ViewLikes from './viewLike';
import ViewComment from './ViewComment';
import { showComments } from '@/redux/commentSlice';
import Post from '../post/Post';
import LikedBy from './LikedBy';

function ViewPost() {
    const {postId} = useParams()
    const {type} = useParams()
    const dispatch = useDispatch()
    const [postInfo,setPostInfo] = useState()

    const [allComment,setAllComment] = useState()
    const [showSection,setShowSection] = useState(type)
    const [reRender,setReRender] = useState(true)

    const load = () => {
      setReRender(prev => !prev)
    }
    console.log(reRender);
    const moveToTop = () =>{
      window.scrollTo(0,0)
    }
    moveToTop()
    useEffect(()=>{
      ;(async()=>{
        let response = await dispatch(getVisitedPosts(postId))
        setPostInfo(response?.payload?.data[0])
      })()
    },[reRender])
    
    useEffect(()=>{
      setShowSection(type)
    },[type])

    useEffect(()=>{
      ;(async()=>{
        let response= await dispatch(showComments(postId))
        console.log(response);
        setAllComment(response?.payload?.data)
      })()
    },[reRender])
    console.log();
    return (
    <div className='bg-gray-950 min-h-[100vh]'>
    {
      postInfo &&
      <>
        <div className='bg-black py-2'>
          {/* <Header post={postInfo}/>
          <Like post={postInfo} render={load}/> */}
          <Post post={postInfo}/>
        </div> 
        <div>
          { 
            <>
              <div className='my-2 relative'>
                <h2 className='text-white px-4  italic my-3 mb-5'>comments</h2>
                <h2 className=' mx-4 w-20 h-[2px] rounded-xl bg-gray-400 absolute top-7 '></h2>
                <div className='pb-[50px] overflow-hidden'>
                {allComment?.length > 0 ? allComment?.map((comment,i)=>(<ViewComment info={comment} key={i} render={load}/>)) : <div className='text-white h-[20vh] flex  justify-center items-center text-lg font-medium'>Be First One To Comment !</div>}
                </div>
              </div>
              <div className='fixed bottom-0 bg-gray-950 lg:w-[30%] py-3 w-full'><Comment post = {postInfo} render={load}/></div>

            </>
          }
        </div>
      </>
    }
    </div>
  )
}

export default ViewPost