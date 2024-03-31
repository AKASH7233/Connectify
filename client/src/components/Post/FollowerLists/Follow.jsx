import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Followers, Following } from '../../../redux/followSlice'
import { getUserData } from '../../../redux/authSlice'
import Header from '../Header'
import UserHeader from '../../userHeader/UserHeader'
import { useParams } from 'react-router-dom'


function Follow() {
    const dispatch = useDispatch()
    const {type} = useParams()
    const {userId} = useParams()
    const [user,setUser] = useState(null)
    const [listType,setListType] = useState(type)
    const otherType = listType == 'Followers' ? 'Following' : 'Followers'
    const [otherlistType,setOtherListType] = useState(listType)
    const load = async() => {
      let response ;
      {listType == 'Followers' ? response = await dispatch(Followers(userId)) : response = await dispatch(Following(userId))}
      setUser(response?.payload?.data)
    }
    console.log(user);
    useEffect(()=>{
      load()
    },[listType])
  return (
    <>
      <div className='flex justify-evenly items-center py-4 bg-black text-white border-b'>
      <button className={`bg-gray-400 px-10 py-2`} onClick={()=>{setListType(listType)}}>{listType}</button>
      <h2 className='text-2xl opacity-15'>|</h2>
      <button className='px-4 py-2' onClick={()=>{setListType(otherType)}}>{otherType}</button>
    </div>
    <div className='min-h-[100vh] bg-black'>
      {user?.map((user)=>( 
        <UserHeader key={user?._id} user={user.followers || user.followings}/>
      ))}
  </div>
    </>
  )
}

export default Follow