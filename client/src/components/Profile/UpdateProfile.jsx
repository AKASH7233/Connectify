import React, { useState } from 'react'
import {useSelector,useDispatch} from 'react-redux'
import toast from 'react-hot-toast'
import { updateProfile } from '@/redux/authSlice'
function UpdateProfile() {
    const dispatch = useDispatch()
    const user = useSelector(state => state?.auth?.user[0]) || useSelector(state => state?.auth?.user)?.user
    const [info,setInfo] = useState({
        username: user?.username,
        Description : user?.Description || '',
        fullName : user?.fullName,
    })
    
    console.log(info);
    const submit = async(e) =>{
        e.preventDefault()
        if(!info.username  || !info.fullName){
            toast.error(`username and fullname is required !`)
        }
        let response = await dispatch(updateProfile(info))
        console.log(response);
    }
    
  return (
    <div className='bg-gray-900 h-[100vh] px-4'>
        <h2 className='text-white text-center mb-10 py-5 text-xl italic'>Edit Your Profile</h2>
        <div className='px-5'>
        <label className='text-white italic'>Edit your Username</label><br />
        <input 
        type="text" 
        name="username"
        value={info.username}
        onChange={(e)=>{setInfo({...info,[e.target.name] : e.target.value})}}
        className=' py-1 w-full bg-transparent text-white border-b mt-2 mb-10 outline-none'/>
        <label className='text-white italic'>Edit your Bio</label><br />
        <textarea 
        type="text" 
        value={info.Description}
        placeholder='Edit your Bio....'
        rows={4}
        name='Description'
        onChange={(e)=>{setInfo({...info,[e.target.name] : e.target.value})}}
        className=' py-1 w-full bg-transparent text-white border-b mt-2 mb-10 outline-none'/>
        <label className='text-white italic'>Edit your Fullname</label><br />
        <input 
        type="text" 
        name='fullName'
        value={info.fullName}
        onChange={(e)=>{setInfo({...info,[e.target.name] : e.target.value})}}
        className=' py-1 w-full bg-transparent text-white border-b mt-2 mb-10 outline-none'/>
        </div>

        <button onClick={submit} className='text-lg my-4 text-white mx-4 rounded-xl px-32 py-4  bg-blue-400 '>Edit</button>
    </div>
  )
}

export default UpdateProfile