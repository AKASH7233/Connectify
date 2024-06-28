import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

import axiosInstance from '../../../../utils/ApiFetch';
import TaggingComponent from '@/components/Search/Tag';



function UploadPost() {
    const navigate = useNavigate()
    let [fileName,setFileName] = useState([])
    const [taggedUser,setTaggedUser] = useState()
    const [post,setPost] = useState({
        title: '',
        postFile: []
    })
    const eventHandler = (e) => {
        let value = e.target.files;
        let uploads = Array.from(value)
        let name  = []
        // console.log(uploads);
        uploads?.map((post)=>{
            // console.log(post.name);
            return name.push(post.name);
        })
        // console.log(name);
        setFileName(name)
        setPost({...post,[e.target.name]: e.target.files})        
    }
    // console.log(fileName);
    // console.log(post);

    const remove = (e) =>{
        const fileId = e.target.id;
        if (Array.isArray(post.postFile)) {
            const updatedPostFiles = post.postFile.filter(file => file.name !== fileId);
            setPost({ ...post, postFile: updatedPostFiles });
        }
    }

    // console.log(post.postFile);
    
    const onFormSubmit = async(e) => {
        e.preventDefault()
        const formdata = new FormData()
        formdata.append('title',post.title)
        formdata.append('taggedTo',JSON.stringify(taggedUser))
        for (let i = 0; i < post.postFile.length; i++) {
            formdata.append('postFile',post.postFile[i])
        }

        let response =  await axiosInstance.post('/post/uploadpost',formdata)
        // console.log(response);


        if(response?.data?.error){
            toast.error(response?.data?.error)
        }
        // console.log(post.postFile);
        if(response?.data?.message){
            toast.success(response?.data?.message)
            // navigate('/')
        }
    }

    const [className,setClassName] = useState()

    const handleRemoveClick = (e) => {
        if (e.target.tagName === 'H2') {
            setClassName(e.target.id);
            remove(e);
        }
    };

    // console.log(`taggedUser`, taggedUser);

  return (
    <div className='w-full h-[100vh] flex items-center justify-center  bg-[#000000] overflow-hidden' method='post'>
        <div className='bg-gray-800 lg:mx-20 py-12 mx-10 bg-opacity-50 rounded-xl text-white text-center'>
            <h2 className='text-lg'>Upload the Pictures</h2>
            <p className='text-gray-400 text-sm'>in JPEG,PNG or WEBP</p>
        <form  encType='multipart/form-data'>
        <div className='my-7'>
        <label 
            htmlFor="file"
            className='bg-gray-900 bg-opacity-90 border-2 border-gray-700 text-sm py-3 px-5 text-white w-24  rounded-xl'
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
        <div className='text-left text-sm mx-4 my-4 mb-6' onClick={handleRemoveClick}>
            {fileName?.map((name,i)=>(
                <div key={i} id={name} className={`flex justify-between items-center my-2 ${className == name ? 'hidden' : ''}`} onClick={handleRemoveClick}>
                    <p key={i} className='clip'>{name}</p>
                    <h2 onClick={remove} className='cursor-pointer' id={name}>X</h2>
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
        <TaggingComponent tagUsers = {setTaggedUser}/>
        <div>
        <button onClick={onFormSubmit} className='bg-gray-900 bg-opacity-90 border-2 border-gray-700 text-sm py-4 px-5 text-white rounded-xl'>Upload Post</button>
        </div>
        </form>
        </div>  
        
    </div>
  )
}

export default UploadPost