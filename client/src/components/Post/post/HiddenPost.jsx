import { showHiddenPost } from '@/redux/postSlice'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'

function HiddenPost() {
    const dispatch = useDispatch()
    const [post,setPost] = useState('')
    useEffect(()=>{
        ;(async()=>{
            let response = await dispatch(showHiddenPost())
            setPost(response?.payload?.data)
        })()
    },[])
  return (
    <div className='min-h-[100vh] bg-black py-4'>
        <h2 className='text-center text-white text-xl mb-4'>Hidden Posts</h2>
        {post && 
            <div className='flex flex-wrap'>{post?.map((post)=>{
                const post_file = Array.isArray(post?.postFile) ? post?.postFile[0] : post?.postFile
                return <Link to={`/viewpost/${post?._id}/comment`}><img key={post?._id} src={post_file} className='mx-3 my-4 w-40 h-40 border-2 border-gray-800 rounded-lg object-cover'/></Link>
                })}
            </div> 
        }
        {
          post?.length == 0 && <div className='text-white w-full h-[70vh] flex items-center justify-center'>0 hidden Post !</div>
        }
    </div>
  )
}

export default HiddenPost