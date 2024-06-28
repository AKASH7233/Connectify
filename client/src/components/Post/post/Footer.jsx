import React,{useState, useEffect} from 'react'
import { FaHeart , FaRegHeart , FaRegBookmark, FaBookmark, FaRegCommentDots, FaRegComment} from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import { postlikes,togglelike } from '../../../redux/likeSlice';
import { Link } from 'react-router-dom';
import { showComments } from '@/redux/commentSlice';
import { isBooked, toogleBookmark } from '@/redux/bookMark';
import { DialogCloseButton } from '../../shadCompo/Share';

function Footer({post}) {
    const dispatch = useDispatch()
    const [isAlreadyLiked,setIsAlreadyLiked] = useState(false)
    const [likedBy,setlikedBy] = useState()
    const [search , setSearch ] = useState(false)
    const [commentCount,setCommentCount] = useState(0)
    const [addToBookMark,setAddToBookMark] = useState(false)
    
    const currentUser = useSelector(state=> state?.auth?.user) 
    const currentUserId = currentUser?.user?._id 

    useEffect(()=>{
     ;(async()=>{
        let postLikes = await dispatch(postlikes(post._id))
        setlikedBy(postLikes?.payload?.data?.likedUsers)
        setIsAlreadyLiked(postLikes?.payload?.data?.isliked[0]?.isLiked);
      })()
    },[search])

    let fetchBookMarkStatus = async()=>{
      let isAlreadyBooked = await dispatch(isBooked(post?._id))
      setAddToBookMark(isAlreadyBooked?.payload?.data[0]?.isBooked)
    }
    
    useEffect(()=>{
      fetchBookMarkStatus()
     },[])

    useEffect(()=>{
        ;(async()=>{
            let CommentResponse= await dispatch(showComments(post?._id))
            setCommentCount(CommentResponse?.payload?.data?.length)
        })()
    },[])
  
    const fetch = async() => {
      await dispatch((togglelike(post?._id)))
      setSearch(!search)
      render()
    } 

    const addBookMark = async() => {
      await dispatch(toogleBookmark(post?._id))
      fetchBookMarkStatus()
    }
  
    let random = Math.floor(Math.random() * likedBy?.length)
    const LikedBy = likedBy?.length >= 1 ? likedBy[random].users : '' 

    const userId = currentUserId == LikedBy?._id ? 'myprofile' : `user/${LikedBy?._id}`

    const shareLink = `https://connectify-omega.vercel.app/viewpost/${post?._id}/comment`
    const title = post?.title
    return (
      <>
        <div className='flex gap-x-3 relative items-center my-1'>
          
           {/* <div className='flex items-center gap-1'>
              {/* <h2 className='text-sm text-white'>Liked By</h2> */}
              {/* <h2 onClick = {showLikes} className={`${likedBy?.length >= 1  ? 'block': 'invisible'} text-white text-md`}>{LikedBy}</h2> */}
            {/* </div> */ }
            
        </div>
        <div className='text-white text-sm flex justify-between px-4 relative'>
            <div className='flex items-center gap-x-7'>
                <div className='flex items-center'>
                    <button onClick={fetch}  className='mx-2 text-xl'>
                        {isAlreadyLiked ? <FaHeart className='  text-red-400'/> : <FaRegHeart className='text-white'/>}
                    </button>
                    <Link to={`/likes/${post?._id}`}>
                    <button className='text-md'>{likedBy?.length}</button>
                    </Link> 
                </div>
                <Link to={`/viewpost/${post?._id}/comment`}>
                    <span className='flex gap-x-1'><FaRegComment className='text-[20px]'/>{commentCount > 1 ? commentCount : ''}</span> 
                </Link>
                <div className='-mx-4'>
                  <DialogCloseButton shareLink={shareLink} title={title} />
                </div>
            </div>
            <button onClick={addBookMark} className='text-lg absolute right-3 text-white'>
              {addToBookMark ? <FaBookmark/> : <FaRegBookmark />}
            </button>
        </div>
       {likedBy?.length > 0 &&  
            <div className='flex items-center gap-1 px-5 my-2 '>
                <h2 className='text-sm text-gray-300'>Liked By</h2>
                <Link to = {`/${userId}`}>
                    <h2 className={`${likedBy?.length >= 1  ? 'block': 'invisible'} text-white text-md`}>{LikedBy?.username}</h2>
                </Link>
                <Link to={`/likes/${post?._id}`}>
                 {likedBy?.length > 1 && <h2 className='text-gray-300 text-sm'>and {likedBy?.length -1 } others</h2>}
                </Link>
            </div>
        }
      </>
    )
}

export default Footer