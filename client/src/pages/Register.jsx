import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { BsPersonCircle } from "react-icons/bs";
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom'

import { createAccount } from '../redux/authSlice';
import { FaEyeSlash } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import icon from "../assets/icon.jpg" 

function Register() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [userInfo, setUserInfo] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    ProfileImage: ''
  });

  const [profileImageImage, setProfileImageImage] = useState(null)

  const handleAvatar = (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    if (file) {
      setUserInfo({ ...userInfo, ProfileImage: file })
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.addEventListener("load", async () => {
        setProfileImageImage(fileReader.result);
      })
    }
  }

  const eventHandler = (e) => {
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value })
  }

  const search = async (e) => {
    e.preventDefault();
    console.log(userInfo) 
    if( !userInfo.email || !userInfo.password || !userInfo.username || !userInfo.fullName ){
      return toast.error('Please fill all the fields')
    }

    try {
      const response = await dispatch(createAccount(userInfo))
      if (response?.payload?.message) {
        navigate('/login')
      }
      console.log(response)
    } catch (error) {
      console.log(error);
    }
  }

  const [showPass,setShowPass] = useState(false)



  return (
    <div className='flex items-center justify-center h-screen bg-black text-white'>
      <div className='flex flex-col items-center justify-center border bg-[#09090B] border-[#27272A] px-8  w-80'>
       <div className='flex items-center'>
        <div style={{backgroundImage : `url(${icon})`}} className='w-[12vw] rounded-xl bg-center bg-contain bg-no-repeat h-20 duration-400 text-white mix-blend-hard-light'></div>
        <h2 className='logo text-2xl'>ConnectiFy</h2>
       </div>
        <label htmlFor="image" className="cursor-pointer mb-4">
          {
            profileImageImage ? (
              <img className="w-16 h-16 rounded-full m-auto" src={profileImageImage} alt="user Image" />
            ) : (
              <BsPersonCircle className="w-16 h-16 text-white" />
            )
          }
        </label>
        <input type="file" id='image' onChange={handleAvatar} className="hidden" name="ProfileImage" placeholder='upload Profile Image' accept='.jpg, .png, .jpeg , .png, .svg ' />

        <input type="text" className='px-3 py-1 text-md focus:border-white bg-transparent border-[1px] border-[#27272A] rounded mb-3 placeholder:text-sm w-full' name='fullName' value={userInfo.fullName} onChange={eventHandler} placeholder='Enter your Fullname' />
        <input type="text" className='px-3 py-1 text-md focus:border-white bg-transparent border-[1px] border-[#27272A] rounded mb-3 w-full placeholder:text-sm' name='username' value={userInfo.username} onChange={eventHandler} placeholder='Enter your Username' />
        <input type="email" className='px-3 py-1 text-md focus:border-white bg-transparent border-[1px] border-[#27272A] rounded mb-3 w-full placeholder:text-sm' name='email' value={userInfo.email} onChange={eventHandler} placeholder='Enter Your Email' />
        <div className='w-full relative'><input type={showPass ? 'text' : 'password'} className='px-3 py-1 text-md focus:border-white bg-transparent border-[1px] border-[#27272A] rounded mb-3 w-full placeholder:text-sm' name='password' value={userInfo.password} onChange={eventHandler} placeholder='Set a Password' /><span onClick ={()=>{setShowPass(!showPass)}} className = 'absolute right-3 top-2'>{ showPass ? <FaEye /> : <FaEyeSlash/>}</span></div>

        <button className='bg-white text-black px-10 py-2 mt-4 text-md rounded-[5px]  w-full' onClick={search}>Register</button>
        <p className="text-sm my-4 text-center">
          Already have an account?
          <Link to={`/login`} className="underline ml-2">Login</Link>
        </p>
      </div>
    </div>
  )
}

export default Register