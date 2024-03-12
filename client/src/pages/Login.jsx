import React, { useEffect, useState } from 'react'
import axiosInstance from '../utils/ApiFetch'
import toast from 'react-hot-toast'
import { Link, useNavigate } from 'react-router-dom'
import setCookies from '../utils/Cookies/AddCookies'

function Login() {
    const navigate = useNavigate()
    const [userInfo, setUserInfo] = useState({
      username: "",
      email: "",
      password: "",
    })

    const eventHandler = (e) =>{
      setUserInfo({...userInfo, [e.target.name]: e.target.value})
    }
    const fetch = async()=>{
      let response = await axiosInstance.post('/user/login',userInfo)
      
      console.log(response);
      if(response?.data.message){
        toast.success(response.data.message)
        console.log(response);
        setCookies('user_id',response?.data.data.user._id)
        navigate('/')
      }
      if(response?.data?.error){
        toast.error(response.data.error);
      }
    }
    const search = (e)=> {
      e.preventDefault();
      fetch()
    }


  return (
    <div className='w-[100vw] h-[100vh]  px-4 bg-[#000000] overflow-hidden'>
      <h2 className='text-white text-4xl mt-20  text-center'>logo</h2>
      <div className='flex justify-center items-center my-16'>
      <div className='border relative px-4 py-4 w-64 h-60 border-white'>
        <input type="text" className='px-3 py-2 rounded-sm border outline-none focus:none text-black my-4' name='username' value={userInfo.username} onChange={eventHandler} placeholder='Enter your UserName'/>
        <input type="email" className='px-3 py-2 rounded-sm border outline-none focus:none text-black my-4' name='email' value={userInfo.email} onChange={eventHandler} placeholder='Enter Your Email'/>
        <input type="password" className='px-3 py-2 rounded-sm border outline-none focus:none text-black my-4' name='password' value={userInfo.password} onChange={eventHandler} placeholder='Enter Password' />
        <button className = 'bg-[#C147E9] px-24 text-lg py-2 mt-8 rounded-lg'  onClick={search}>Login</button>
        <p className="text-white text-center text-sm my-4 ">
          Does not Have an account?
          <br />Create an account
          <Link to={`/register`} className="underline mx-2">   Register</Link>
        </p>
      </div>
      </div>
    </div>
  )
}

export default Login