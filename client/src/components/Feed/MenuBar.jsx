import React, { useEffect } from 'react'
import { FaHome } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";
import { IoCloudUploadOutline } from "react-icons/io5";
import { CgLogOut } from "react-icons/cg";
import { IoMdSettings } from "react-icons/io";
import { CgProfile } from "react-icons/cg";
import { FaUserFriends } from "react-icons/fa";
import icon from "../../assets/icon.jpg" 
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@/redux/authSlice';

function MenuBar({ActiveMenuItem}) {
  const currentUser = useSelector(state=> state?.auth?.user) 
  const currentUserId = currentUser?.user?._id || currentUser[0]?._id
  const dispatch = useDispatch()
  const navigate = useNavigate()
  ActiveMenuItem != undefined ? localStorage.setItem('item',JSON.stringify(ActiveMenuItem)) : ''

  let respItem = ActiveMenuItem || JSON.parse(localStorage.getItem('item'))

  const logoutUser = async() => {
    await dispatch(logout())
    navigate('/login')
  }


  return (
    <div className='bg-black h-[100vh] flex flex-col justify-between'>
        <div className='flex flex-col gap-y-3 my-2'>
            <Link to={'/'}><button className={`flex items-center justify-left gap-x-10 mx-2 ${respItem == 'Home' ? 'bg-gray-900 bg-opacity-90 border-gray-700' : ''} rounded-xl p-2 w-full md:w-52 hover:bg-gray-900 hover:bg-opacity-90 border-2 border-black text-white hover:border-gray-700`}><FaHome className='text-lg'/><span>Home</span></button></Link>
            <Link to={'/search'}><button className={`flex items-center justify-left gap-x-10 mx-2 ${respItem == 'Search' ? 'bg-gray-900 bg-opacity-90 border-gray-700' : ''} rounded-xl p-2 w-72 md:w-52  hover:bg-gray-900 hover:bg-opacity-90 border-2 border-black text-white hover:border-gray-700`}><FaSearch className='text-lg'/><span>Search</span></button></Link>
            <Link to={'/uploadpost'}><button className={`flex items-center justify-left gap-x-10 mx-2 ${respItem == 'Upload' ? 'bg-gray-900 bg-opacity-90 border-gray-700' : ''} rounded-xl p-2 w-72 md:w-52 hover:bg-gray-900 hover:bg-opacity-90 border-2 border-black text-white hover:border-gray-700`}><IoCloudUploadOutline className='text-lg '/><span>Upload Post</span></button></Link>
            <Link to={'/myProfile'}><button className={`flex items-center justify-left gap-x-10 mx-2 ${respItem == 'Profile' ? 'bg-gray-900 bg-opacity-90 border-gray-700' : ''} rounded-xl p-2 w-72 md:w-52 hover:bg-gray-900 hover:bg-opacity-90 border-2 border-black text-white hover:border-gray-700`}><CgProfile className='text-lg'/><span>Profile</span></button></Link>
            <Link to={`/followlist/Followers/${currentUserId}`}><button className={`flex items-center justify-left gap-x-10 mx-2 ${respItem == 'Follow' ? 'bg-gray-900 bg-opacity-90 border-gray-700' : ''} rounded-xl p-2 w-72 md:w-52 hover:bg-gray-900 hover:bg-opacity-90 border-2 border-black text-white hover:border-gray-700`}><FaUserFriends className='text-lg'/><span>Follows</span></button></Link>
            <button className={`flex items-center justify-left gap-x-10 mx-2 ${respItem == '' ? 'bg-gray-900 bg-opacity-90 border-gray-700' : ''} rounded-xl p-2  hover:bg-gray-900 hover:bg-opacity-90 border-2 border-black text-white hover:border-gray-700`}><IoMdSettings className='text-lg'/><span>Settings</span></button>
            <button onClick={logoutUser} className='flex items-center justify-left gap-x-10 mx-2  rounded-xl p-2 hover:bg-gray-900 hover:bg-opacity-90 border-2 border-black text-red-400 hover:border-red-400'><CgLogOut className='text-lg'/><span>Logout</span></button>
        </div>
        <div className='flex items-center  w-full'>
          <div style={{backgroundImage : `url(${icon})`}} className='w-[5vw] rounded-xl bg-center md:bg-contain bg-cover  bg-no-repeat h-12 my-4 duration-400 text-white mix-blend-hard-light'></div>
          <h2 className='logo text-2xl'>ConnectiFy</h2>
       </div>
    </div>
  )
}

export default MenuBar