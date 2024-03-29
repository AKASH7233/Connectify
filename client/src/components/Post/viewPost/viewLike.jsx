import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { postlikes } from '../../../redux/likeSlice'
import UserHeader from '../../userHeader/UserHeader'

function ViewLikes({post}) {
  const likeduser = useSelector(state => state.like?.LikedBy)
  const dispatch = useDispatch()
  const [likedBy,setLikedBy] = useState(likeduser)

  useEffect(()=>{
    ;(async()=>{
      let response = await dispatch(postlikes(post?._id))
      setLikedBy(response?.payload?.data?.likedUsers)
    })()
  },[])
  return (
    <div>
      {likedBy.length > 0 && likedBy?.map((user,i)=>(
        <UserHeader user={user?.users} key={i} userId={user?.users?._id} />
      ))}
    </div>
  )
}

export default ViewLikes