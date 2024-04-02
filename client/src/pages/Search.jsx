import React, { useEffect, useState } from 'react'
import axiosInstance from '../utils/ApiFetch'
import { CiSearch } from "react-icons/ci";
import UserHeader from '@/components/userHeader/UserHeader';
import toast from 'react-hot-toast';

function Search() {
    const [inp,setInput] = useState('')
    const [options,setOptions] = useState()
    // useEffect(()=>{
        
    // },[inp])

    const load = async(e) => {
      e.preventDefault()
      if (!inp) {
        toast.error('Enter the username ')
        return;
      }
      if (inp.length < 3) {
        toast.error('Field must contain 3 characters')
        return;
      }
        let response = await axiosInstance.get(`/search/search/${inp}`)
        console.log(response);
        setOptions(response?.data?.data)
    }
  return (
    <div className='bg-gray-950 my-4 min-h-[100vh] px-4'>
        <div className='relative'>
          <input 
          type="text" 
          value={inp}
          onChange={(e)=>{setInput(e.target.value)}}
          className='bg-gray-900 text-slate-400 px-7 my-2 text-md w-full py-4 outline-none rounded-xl'
          placeholder='Search username or FullName'
          />
          <button onClick={load} className='text-slate-400 text-lg absolute top-5 right-4 border border-slate-600 p-2 rounded-xl'><CiSearch className=''/></button>
        </div>
        <div className='20px my-4'>
          {
          Array.isArray(options) ? options?.map((user,i)=>(
            <UserHeader user={user} key={i}/>
          )) : options?.post.map((user,i)=>(
            <img src={user?.postFile} />
          ))
        }
        </div>
    </div>
  )
}

export default Search