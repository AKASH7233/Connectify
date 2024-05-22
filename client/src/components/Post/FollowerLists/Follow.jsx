import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

import { getUserData } from '../../../redux/authSlice'
import { Followers, Following } from '../../../redux/followSlice'
import UserHeader from '../../userHeader/UserHeader'
import Header from '../post/Header'
import { IoSearchSharp } from "react-icons/io5";
import { toast } from 'react-toastify'


function Follow() {
    const dispatch = useDispatch()
    const {type} = useParams()
    const {userId} = useParams()
    const [user,setUser] = useState(null)
    const [listType,setListType] = useState(type)
    const otherType = listType == 'Followers' ? 'Following' : 'Followers'
    const [Search,setSearch] = useState('')
    let [userSearchedFor,setUserSearchedFor] = useState([]);
    const load = async() => {
      let response ;
      {listType == 'Followers' ? response = await dispatch(Followers(userId)) : response = await dispatch(Following(userId))}
      setUser(response?.payload?.data)
    }
    useEffect(()=>{
      load()
    },[listType])
    
    const inputHandler = (e) => {
      setSearch(e.target.value)
      setUserSearchedFor([])
    }

    const search = () => {
      if(Search?.trim() == ""){
        toast.error('enter username to search')
       return null
      }
      console.log(Search.length);
      let searchedUser = [];
      user?.map((user)=>{
        return user?.followers?.username.includes(Search) || user?.followings?.username.includes(Search) ?  searchedUser.push(user) : ''  })
        
        return searchedUser?.length > 0 ? setUserSearchedFor(searchedUser) : setUserSearchedFor(['No User Found'])
      
    }
    console.log(userSearchedFor);

  return (
    <>
      
      <div className='flex justify-evenly items-center py-4 bg-black text-white border-b'>
      <button className={`bg-gray-900 bg-opacity-90 border-2 border-gray-700 text-md  py-1 px-4 rounded-[10px]`} onClick={()=>{setListType(listType)}}>{listType}</button>
      <h2 className='text-2xl opacity-15'>|</h2>
      <button className='px-4 py-2' onClick={()=>{setListType(otherType)}}>{otherType}</button>
    </div>
    <div className='min-h-[100vh] bg-black'>
      {user?.length == 0 && <div className='w-full h-[80vh]'><div className='flex justify-center items-center h-full '><h2 className='text-white text-xl '>No {listType}</h2></div></div>}
      {
        user?.length != 0 && <div className='bg-black px-10 py-5 relative'>
        <input 
        type="text" 
        value={Search}
        onChange={inputHandler}
        placeholder='search username'
        className='bg-transparent bg-opacity-90 border-2 border-gray-700 text-sm py-2 px-7 rounded-[10px] outline-none text-white'
        />
        <button onClick={search} className='text-white bg-gray-900 absolute right-20 bg-opacity-90 border-2 border-gray-700 text-sm py-2 px-3 rounded-[10px]'><IoSearchSharp className = "text-xl"/></button>
      </div>
      }
      {userSearchedFor?.length == 0 && user?.map((user)=>( 
        <UserHeader key={user?._id} user={user.followers || user.followings}/>
      ))}
      {Search.trim() != '' && userSearchedFor[0] != 'No User Found' && userSearchedFor?.map((user)=>( 
        <UserHeader key={user?._id} user={user.followers || user.followings}/>
      ))
      }
      {
         Search.trim() == "" || userSearchedFor[0] == 'No User Found' && <div className='text-white min-h-[50vh] w-full flex items-center justify-center text-lg'>
          No User Found !!
        </div>
      }
      
  </div>
    </>
  )
}

export default Follow