import React, { useState } from "react";
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from "react-hot-toast";
import { FaEye, FaEyeSlash } from "react-icons/fa";

import { cn } from "@/utils/cn";
import { Input } from "../components/ui/InputAcc";
import { Label } from "../components/ui/LabelAccer";
import { login } from '../redux/authSlice';

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [userInfo, setUserInfo] = useState({
    username: "",
    email: "",
    password: "",
  });

  const eventHandler = (e) => {
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
  };

  const search = async (e) => {
    e.preventDefault();

    if (!userInfo.username || !userInfo.email || !userInfo.password) {
      toast.error('All fields are required');
      return;
    }

    try {
      const response = await dispatch(login(userInfo));
      if (response?.payload?.data?.user?._id) {
        navigate('/');
      }
    } catch (error) {
      // Handle any errors that occur during the login process
      
    }
  };

  const [showPass, setShowPass] = useState(false);

  return (
    <div className="bg-black h-[97vh] flex justify-center items-center">
      <div className="max-w-md sm:border-2 md:border-2 lg:border-2 xl:border-2 2xl:border-2 border-neutral-600 w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-black">
        <h2 className="font-bold text-xl text-neutral-200">
          Welcome to ConnectiFy !!
        </h2>
        <form className="mt-8" onSubmit={search}>
          <LabelInputContainer className="mb-4">
            <Label htmlFor="username">Your Username</Label>
            <Input
              name="username"
              placeholder="ConnectiFy"
              type="text"
              value={userInfo?.username}
              onChange={eventHandler}
            />
          </LabelInputContainer>
          <LabelInputContainer className="mb-4">
            <Label htmlFor="email">Email Address</Label>
            <Input
              name="email"
              placeholder="connectify@mail.com"
              type="email"
              value={userInfo?.email}
              onChange={eventHandler}
            />
          </LabelInputContainer>
          <LabelInputContainer className="mb-8 relative">
            <Label htmlFor="password">Password</Label>
            <Input
              name="password"
              placeholder="••••••••"
              type={showPass ? 'text' : 'password'}
              value={userInfo?.password}
              onChange={eventHandler}
            />
            <span onClick={() => { setShowPass(!showPass) }} className='absolute right-3 top-7 cursor-pointer'>{showPass ? <FaEye color="white" /> : <FaEyeSlash color="white" />}</span>
          </LabelInputContainer>

          <button
            className="bg-gradient-to-br relative group/btn from-zinc-900to-zinc-900 to-neutral-600 block bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
            type="submit"
          >
            login &rarr;
            <BottomGradient />
          </button>

          <p className="text-sm my-4 text-center text-white">
            Don't have an account?
            <Link to={`/Register`} className="underline ml-2">Register</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
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

export default Login;