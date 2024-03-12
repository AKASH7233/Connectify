import React, { useState } from 'react'
import axiosInstance from '../utils/ApiFetch';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';



function UploadPost() {
    const navigate = useNavigate()
    const [post,setPost] = useState({
        title: '',
        postFile: ''
    })
    const eventHandler = (e) => {
        setPost({...post,[e.target.name]: e.target.files[0]})        
    }
    console.log(post);
    const onFormSubmit = async(e) => {
        e.preventDefault()
        const formdata = new FormData()
        formdata.append('title',post.title)
        formdata.append('postFile',post.postFile)

        let response = await axiosInstance.post('/post/uploadpost',formdata)
        console.log(response);

        if(response?.data?.error){
            toast.error(response?.data?.error)
        }

        if(response?.data?.message){
            toast.success(response?.data?.message)
            // navigate('/')
        }
    }
  return (
    <div className='w-[100vw] h-[100vh] px-10 bg-[#000000] overflow-hidden' method='post'>  
        <form onSubmit={onFormSubmit} encType='multipart/form-data'>
        <div className='h-[40vh] flex items-center justify-center'>
        <input type="file" 
            name="postFile" 
            id="file"
            onChange={eventHandler}
            className='hidden'
            />
            <label 
            htmlFor="file"
            className='p-20 rounded-lg  text-white border-dashed border-2 hover:border-[#C147E9]'
            >
                Upload File
            </label>
        </div>
        <textarea 
        name="title" 
        value={post.title}
        onChange={(e)=>{setPost({...post,[e.target.name]: e.target.value})}}
        cols="30" 
        rows="10"
        placeholder='write the title . . . .'
        className='w-72 text-gray-400 bg-transparent outline-none'/>
        <div>
        <button type="submit" className='text-white bg-[#C147E9] px-20 mx-4 py-3 rounded-md'>Upload Post</button>
        </div>
        </form>
    </div>
  )
}

export default UploadPost