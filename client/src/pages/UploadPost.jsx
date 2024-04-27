import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

import axiosInstance from '../utils/ApiFetch';



function UploadPost() {
    const navigate = useNavigate()
    let [fileName,setFileName] = useState([])
    const [post,setPost] = useState({
        title: '',
        postFile: ''
    })
    const eventHandler = (e) => {
        let value = e.target.files;
        let uploads = Array.from(value)
        let name  = []
        console.log(uploads);
        uploads?.map((post)=>{
            console.log(post.name);
            return name.push(post.name);
        })
        console.log(name);
        setFileName(name)
        setPost({...post,[e.target.name]: e.target.files})        
    }
    console.log(fileName);
    console.log(post);

    const remove = (e) =>{
        console.log(e.target.id);

        let find = Array.from(post?.postFile)
        console.log(find);
        let files = []
        find?.find((post)=>{
               post.name != e.target.id ? files.push(post) : ''
        })
        console.log(files);
        setPost({...post,[e.target.id] : files})
        
        // console.log(names);
        // post?.postFile?.map((post)=>{

        //     return name.push(post.name);
        // })
        // console.log(name);
        // setFileName(name)
        // setPost({...post,[e.target.name]: e.target.files})        

    }
    
    const onFormSubmit = async(e) => {
        e.preventDefault()
        const formdata = new FormData()
        formdata.append('title',post.title)
        for (let i = 0; i < post.postFile.length; i++) {
            formdata.append('postFile',post.postFile[i])
        }

        let response =  await axiosInstance.post('/post/uploadpost',formdata)
        console.log(response);


        if(response?.data?.error){
            toast.error(response?.data?.error)
        }
        console.log(post.postFile);
        if(response?.data?.message){
            toast.success(response?.data?.message)
            // navigate('/')
        }
    }
  return (
    <div className='w-[100vw] h-[100vh] flex items-center align-center  bg-[#000000] overflow-hidden' method='post'>
        <div className='bg-gray-800 py-12 mx-10 bg-opacity-50 rounded-xl text-white text-center'>
            <h2 className='text-lg'>Upload the Pictures</h2>
            <p className='text-gray-400 text-sm'>in JPEG,PNG or WEBP</p>
        <form onSubmit={onFormSubmit} encType='multipart/form-data'>
        <div className='my-7'>
        <label 
            htmlFor="file"
            className=' rounded-xl px-9 my-4 py-2 text-white bg-[#7e11f3]'
        >
            + Add the Picture
        </label>
        <input type="file" 
            name="postFile" 
            id="file"
            className='hidden'
            size={5}
            // className='hidden my-4 bg-red-400 w-full'
            placeholder='Add a Picture '
            multiple
            onChange={eventHandler}
            />
            
        </div>
        <div className='text-left text-sm mx-4 my-4 mb-6'>
            {fileName?.map((name,i)=>(
                <div className='flex justify-between items-center my-2'>
                    <h2 key={i} className='clip'>{name}</h2>
                    <h2 onClick={remove} id={name}>X</h2>
                </div>
            ))}
        </div>
        <textarea 
        name="title" 
        value={post.title}
        onChange={(e)=>{setPost({...post,[e.target.name]: e.target.value})}}
        cols="30" 
        rows="4"
        autoFocus 
        placeholder='write about the post . . . .'
        className=' w-full px-5 text-gray-400 bg-transparent outline-none'/>
        <div>
        <button type="submit" className='text-white bg-[#7e11f3] px-20 mx-4 py-3 rounded-xl'>Upload Post</button>
        </div>
        </form>
        </div>  
        
    </div>
  )
}

export default UploadPost