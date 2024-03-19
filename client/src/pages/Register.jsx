import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { BsPersonCircle } from "react-icons/bs";
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom'

import { createAccount } from '../redux/authSlice';
import axiosInstance from '../utils/ApiFetch'

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
        navigate('/myProfile')
      }
      console.log(response)
    } catch (error) {
      console.log(error);
    }
  }


  return (
    <div className='flex items-center justify-center h-screen bg-black '>
      <div className='flex flex-col items-center justify-center border border-white p-8 w-80'>
        <h2 className='text-4xl mb-8 text-center'>Logo</h2>
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

        <input type="text" className='px-3 py-2 rounded border-none mb-4 w-full' name='fullName' value={userInfo.fullName} onChange={eventHandler} placeholder='Enter your FullName' />
        <input type="text" className='px-3 py-2 rounded border-none mb-4 w-full' name='username' value={userInfo.username} onChange={eventHandler} placeholder='Enter your UserName' />
        <input type="email" className='px-3 py-2 rounded border-none mb-4 w-full' name='email' value={userInfo.email} onChange={eventHandler} placeholder='Enter Your Email' />
        <input type="password" className='px-3 py-2 rounded border-none mb-4 w-full' name='password' value={userInfo.password} onChange={eventHandler} placeholder='Set a Password' />

        <button className='bg-purple-600 px-10 py-2 mt-8 rounded text-lg w-full' onClick={search}>Register</button>
        <p className="text-sm my-4 text-center">
          Already have an account?
          <Link to={`/login`} className="underline ml-2">Login</Link>
        </p>
      </div>
    </div>
  )
}

export default Register