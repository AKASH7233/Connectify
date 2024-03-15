import React, { useEffect, useState } from 'react'
import axiosInstance from '../utils/ApiFetch'
import toast from 'react-hot-toast'
import { Link, useNavigate } from 'react-router-dom'
import { BsPersonCircle } from "react-icons/bs";
import { useDispatch } from 'react-redux';
import { createAccount } from '../redux/authSlice';

function Register() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [userInfo, setUserInfo] = useState({
      fullName: "",
      username: "",
      email: "",
      password: "",
      ProfileImage: ""
    })

    const handleAvatar = (e) =>{
      e.preventDefault();      
      setUserInfo({...userInfo,ProfileImage:userInfo.ProfileImage})
      console.log(userInfo);

      const fileReader = new FileReader();
        fileReader.readAsDataURL(userInfo.ProfileImage);
        fileReader.addEventListener("load",()=>{
            setProfileImageImage(fileReader.result);
        })
    }

    const eventHandler = (e) =>{
      setUserInfo({...userInfo, [e.target.name]: e.target.value})
    }

    const search = async(e)=> {
      e.preventDefault();
      const response = await dispatch(createAccount(userInfo))
      if(response?.payload.message){
        navigate('/')
      }
    }


  return (
    <div className='w-[100vw] h-[100vh]  px-4 bg-[#000000] overflow-hidden'>
      <h2 className='text-white text-4xl mt-20  text-center'>logo</h2>
      <div className='flex justify-center items-center my-16'>
        <div className='border relative px-4 py-4 w-64 h-80 border-white'>
        
        <label htmlFor="image" className="cursor-pointer text-white absolute -top-10 left-24">
                    {
                        userInfo.ProfileImage ? (
                            <img className="w-16 h-16 rounded-full m-auto" src={userInfo.ProfileImage} alt="user Image" />
                        ):(
                            <BsPersonCircle className="w-16 h-16 m-auto bg-black"/>
                        )
                    }
        </label>
        <input type="file" id='image' onChange={handleAvatar} className="hidden" name = "ProfileImage" placeholder='upload Profile Image' accept='.jpg, .png, .jpeg , .png, .svg '/>

          <input type="text" className='px-3 py-2 rounded-sm border outline-none focus:none text-black my-4' name='fullName' value={userInfo.fullName} onChange={eventHandler} placeholder='Enter your FullName'/>
          <input type="text" className='px-3 py-2 rounded-sm border outline-none focus:none text-black my-4' name='username' value={userInfo.username} onChange={eventHandler} placeholder='Enter your UserName'/>
          <input type="email" className='px-3 py-2 rounded-sm border outline-none focus:none text-black my-4' name='email' value={userInfo.email} onChange={eventHandler} placeholder='Enter Your Email'/>
          <input type="password" className='px-3 py-2 rounded-sm border outline-none focus:none text-black my-4' name='password' value={userInfo.password} onChange={eventHandler} placeholder='set an Password' />
          
          <button className = 'bg-[#C147E9] px-20 text-lg py-2 mt-8 rounded-lg'  onClick={search}>Register</button>
          <p className="text-white w-96 text-sm my-4 ">
            Already have an account?  
            <Link to={`/login`} className="underline"> Login</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register