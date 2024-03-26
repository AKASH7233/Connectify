import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'

import { login } from '../redux/authSlice'

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
        navigate('/feed')
      }
    }

  return (
    <div className='flex items-center justify-center h-screen bg-gray-900'>
      <div className='p-10 bg-white rounded-lg shadow-2xl w-1/3'>
        <h2 className='text-3xl font-bold mb-5 text-gray-900 text-center'>Login</h2>
        <input type="text" className='border p-2 w-full mb-3 rounded-md outline-none' name='username' value={userInfo.username} onChange={eventHandler} placeholder='Enter your UserName'/>
        <input type="email" className='border p-2 w-full mb-3 rounded-md outline-none' name='email' value={userInfo.email} onChange={eventHandler} placeholder='Enter Your Email'/>
        <input type="password" className='border p-2 w-full mb-3 rounded-md outline-none' name='password' value={userInfo.password} onChange={eventHandler} placeholder='Enter Password' />
        <button className = 'bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded font-medium w-full'  onClick={search}>Login</button>
        <p className="text-center text-sm my-4 ">
          Does not Have an account?
          <br />Create an account
          <Link to={`/register`} className="underline mx-2 text-blue-500">Register</Link>
        </p>
      </div>
    </div>
  )
}

export default Login