import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'

import { login } from '../redux/authSlice'

import { FaEyeSlash } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import icon from "../assets/icon.jpg" 

function Login() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [userInfo, setUserInfo] = useState({
      username: "",
      email: "",
      password: "",
    })

    const eventHandler = (e) =>{
      setUserInfo({...userInfo, [e.target.name]: e.target.value})
    }
    
    const search = async (e)=> {
      e.preventDefault(); 

      if(!userInfo.username || !userInfo.email  || !userInfo.password ){
        toast.error('All field are required')
        return;
      }
      
      const response = await dispatch(login(userInfo))
      if(response?.payload.message){
        if(screen.width > 400) return navigate('/')
        else{navigate('/feed')}
      }
    }

    
  const [showPass,setShowPass] = useState(false)

  return (
    <div className='flex items-center justify-center h-screen bg-black text-white'>
      <div className='flex flex-col items-center justify-center border bg-[#09090B] border-[#27272A] px-8 pb-4 w-80'>
      <div className='flex items-center justify-center  w-full'>
        <div style={{backgroundImage : `url(${icon})`}} className='w-[5vw] rounded-xl bg-center md:bg-contain bg-cover  bg-no-repeat h-12 my-4 duration-400 text-white mix-blend-hard-light'></div>
        <h2 className='logo text-2xl'>ConnectiFy</h2>
       </div>
        <input type="text" className='px-3 py-1 text-md focus:border-white bg-transparent border-[1px] border-[#27272A] rounded mb-3 w-full placeholder:text-sm' name='username' value={userInfo.username} onChange={eventHandler} placeholder='Enter your Username' />
        <input type="email" className='px-3 py-1 text-md focus:border-white bg-transparent border-[1px] border-[#27272A] rounded mb-3 w-full placeholder:text-sm' name='email' value={userInfo.email} onChange={eventHandler} placeholder='Enter Your Email' />
        <div className='w-full relative'><input type={showPass ? 'text' : 'password'} className='px-3 py-1 text-md focus:border-white bg-transparent border-[1px] border-[#27272A] rounded mb-3 w-full placeholder:text-sm' name='password' value={userInfo.password} onChange={eventHandler} placeholder='Set a Password' /><span onClick ={()=>{setShowPass(!showPass)}} className = 'absolute right-3 top-2'>{ showPass ? <FaEye /> : <FaEyeSlash/>}</span></div>

        <button className='bg-white text-black px-10 py-2 mt-4 text-md rounded-[5px]  w-full' onClick={search}>Login</button>
        <p className="text-sm my-4 text-center">
          Don't have an account?
          <Link to={`/Register`} className="underline ml-2">Register</Link>
        </p>
      </div>
    </div>
  )
}

export default Login