import React, { useEffect } from 'react'
import { CgLogOut,CgProfile } from "react-icons/cg";
import { FaHome } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";
import { FaUserFriends } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { IoCloudUploadOutline } from "react-icons/io5";
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

import { logout } from '@/redux/authSlice';

import icon from "../../assets/icon.jpg" 
import RenderMenuItem from './RenderMenu';
import Cookies from 'js-cookie';
function MenuBar({ActiveMenuItem}) {
  const currentUser = useSelector(state=> state?.auth?.user) 
  const currentUserId = currentUser?.user?._id
  
  const dispatch = useDispatch()
  const navigate = useNavigate()
  ActiveMenuItem != undefined ? localStorage.setItem('item',JSON.stringify(ActiveMenuItem)) : ''

  const menuItems = [
    { to: '/', resp: 'Home', icon: FaHome, label: 'Home' },
    { to: '/search', resp: 'Search', icon: FaSearch, label: 'Search' },
    { to: '/uploadpost', resp: 'Upload', icon: IoCloudUploadOutline, label: 'Upload Post' },
    { to: '/myProfile', resp: 'Profile', icon: CgProfile, label: 'Profile' },
    { to: `/followlist/Followers/${currentUserId}`, resp: 'Follow', icon: FaUserFriends, label: 'Follows' },
    {
      to: '/chat',
      resp: 'Chat',
      icon: IoChatbubbleEllipsesOutline,
      label: 'Chat',
      isLink: true
    },
    { to: '', resp: '', icon: IoMdSettings, label: 'Settings', isLink: false },
    
  ];

  let respItem = ActiveMenuItem || JSON.parse(localStorage.getItem('item'))

  const logoutUser = async() => {
    await dispatch(logout())
    Cookies.remove('isLoggedIn',{
      expires: 1,
      secure: true,
      sameSite : 'None'
    });
    navigate('/login')
  }


  return (
    <div className='bg-black h-[100vh] flex flex-col justify-between'>
      <div className='flex flex-col gap-y-3 my-2'>
        {menuItems.map((item) => <RenderMenuItem key={item.resp} respItem={respItem} {...item} />)}
        <button onClick={logoutUser} className='flex items-center justify-left gap-x-10 mx-2  rounded-xl p-2 hover:bg-gray-900 hover:bg-opacity-90 border-2 border-black text-red-400 hover:border-red-400'>
          <CgLogOut className='text-lg' />
          <span>Logout</span>
        </button>
      </div>

      <div className='flex items-center  w-full'>
        <div style={{ backgroundImage: `url(${icon})` }} className='w-[5vw] rounded-xl bg-center md:bg-contain bg-cover  bg-no-repeat h-12 my-4 duration-400 text-white mix-blend-hard-light'></div>
        <h2 className='logo text-2xl'>ConnectiFy</h2>
      </div>
    </div>
  )
}

export default MenuBar