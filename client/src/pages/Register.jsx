import React,{useState} from "react";
import { Label } from "../components/ui/LabelAccer";
import { Input } from "../components/ui/InputAcc";
import { cn } from "@/utils/cn";
import {
  IconBrandGithub,
  IconBrandGoogle,
} from "@tabler/icons-react";

import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom'
import { createAccount } from '../redux/authSlice';
import { FaEyeSlash } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import {toast} from "react-hot-toast";

export default function Register() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [userInfo, setUserInfo] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    ProfileImage: ''
  });


  const eventHandler = (e) => {
    setUserInfo({ ...userInfo, [e.target.id]: e.target.value })
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
      }else{
        toast.error(response?.payload?.error)
      }
      console.log(response)
    } catch (error) {
      console.log(error);
    }
  }

  const [showPass,setShowPass] = useState(false)

  
  return (
   <div className="bg-black h-screen pt-3 lg:pt-10 ">
    <div className="max-w-md md:border-2 lg:border-2 xl:border-2 2xl:border-2 border-neutral-600  w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-black">
      <h2 className="font-bold text-xl text-neutral-200">
        Welcome to ConnectiFy !!
      </h2>
      <form className="mt-8" onSubmit={search}>
      <LabelInputContainer className="mb-4">
          <Label htmlFor="">Your Fullname</Label>
          <Input
            id="fullName"
            placeholder="john Doe"
            type="fullName"
            value={userInfo?.fullName}
            onChange={eventHandler}
          />
        </LabelInputContainer>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="usrname">Enter Username</Label>
          <Input
            id="username"
            placeholder="ConnectiFy"
            type="twitterpassword"
            value={userInfo?.username}
            onChange={eventHandler}
          />
        </LabelInputContainer>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="email">Email Address</Label>
          <Input 
          id="email" 
          placeholder="connectify@mail.com" 
          type="email"
          value = {userInfo?.email}
          onChange={eventHandler}
          />
        </LabelInputContainer>
        <LabelInputContainer className="mb-8 relative">
          <Label htmlFor="password">Password</Label>
          <Input 
          id="password" 
          placeholder="••••••••" 
          type={showPass ? 'text' : 'password'}
          value = {userInfo?.password}
          onChange={eventHandler}
          />
          <span onClick ={()=>{setShowPass(!showPass)}} className = 'absolute right-3 top-7 cursor-pointer'>{ showPass ? <FaEye color="white"/> : <FaEyeSlash color="white"/>}</span>
        </LabelInputContainer>
       
        <button
          className="bg-gradient-to-br relative group/btn from-zinc-900to-zinc-900 to-neutral-600 block bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
          type="submit"
        >
          Sign up &rarr;
          <BottomGradient />
        </button>

        <p className="text-sm max-w-sm mt-4 text-center text-neutral-300">
        Already have an account? 
        <Link to={`/Login`} className="underline ml-2">Login</Link>
      </p>

        <div className="bg-gradient-to-r from-transparentvia-neutral-700 to-transparent mb-4 h-[1px] w-full" />

        <div className="flex flex-col space-y-4">
          <button
            className=" relative group/btn flex space-x-2 items-center justify-start px-4 w-full text-black rounded-md h-10 font-medium shadow-input  bg-zinc-900 shadow-[0px_0px_1px_1px_var(--neutral-800)]"
            type="submit"
          >
            <IconBrandGithub className="h-4 w-4 text-z-300 text-neutral-300" />
            <span className="text-neutral-300 text-sm">
              GitHub
            </span>
            <BottomGradient />
          </button>
          <button
            className=" relative group/btn flex space-x-2 items-center justify-start px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-zinc-900 shadow-[0px_0px_1px_1px_var(--neutral-800)]"
            type="submit"
          >
            <IconBrandGoogle className="h-4 w-4 text-neutral-300" />
            <span className="text-neutral-300 text-sm">
              Google
            </span>
            <BottomGradient />
          </button>
        </div>
      </form>
    </div>
   </div>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};

const LabelInputContainer = ({
  children,
  className,
}) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};
