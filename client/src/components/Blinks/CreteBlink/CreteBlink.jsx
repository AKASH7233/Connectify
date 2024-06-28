import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { createBlink } from '@/redux/blinkSlice';
import { useDispatch } from 'react-redux';

function UploadBlink() {
    const navigate = useNavigate()
    let [fileName,setFileName] = useState([])
    const  dispatch = useDispatch()
    const [loading,setLoading] = useState(false)
    const [Blink,setBlink] = useState({
        title: '',
        BlinkFile: []
    })
    const eventHandler = (e) => {
        let value = e.target.files;
        let uploads = Array.from(value)
        let name  = []
        // console.log(uploads);
        uploads?.map((Blink)=>{
            // console.log(Blink.name);
            return name.push(Blink.name);
        })
        // console.log(name);
        setFileName(name)
        setBlink({...Blink,[e.target.name]: e.target.files})        
    }
    // console.log(fileName);
    // console.log(Blink);

    const remove = (e) =>{
        const fileId = e.target.id;
        if (Array.isArray(Blink.BlinkFile)) {
            const updatedBlinkFiles = Blink.BlinkFile.filter(file => file.name !== fileId);
            setBlink({ ...Blink, BlinkFile: updatedBlinkFiles });
        }
    }

    // console.log(Blink.BlinkFile);
    
    const onFormSubmit = async(e) => {
        e.preventDefault()
        const formdata = new FormData()
        formdata.append('title',Blink.title)
        for (let i = 0; i < Blink.BlinkFile.length; i++) {
            formdata.append('BlinkFile',Blink.BlinkFile[i])
        }
        
        setLoading(true)
        let response =  await dispatch(createBlink(formdata))
        // console.log(response);
        setLoading(false)
       
        if(response?.payload.message){
            navigate('/')
        }
    }

    const [className,setClassName] = useState()

    const handleRemoveClick = (e) => {
        if (e.target.tagName === 'H2') {
            setClassName(e.target.id);
            remove(e);
        }
    };

  return (
    <div className='w-full h-[100vh] flex items-center justify-center  bg-[#000000] overflow-hidden' method='post'>
        <div className='bg-gray-800 lg:mx-20 py-12 mx-10 bg-opacity-50 rounded-xl text-white text-center'>
            <h2 className='text-lg'>Upload A Blink</h2>
            <p className='text-gray-400 text-sm'>in JPEG,PNG,mp4 or WEBP</p>
        <form onSubmit={onFormSubmit} encType='multipart/form-data'>
        <div className='my-7'>
        <label 
            htmlFor="file"
            className='bg-gray-900 bg-opacity-90 border-2 border-gray-700 text-sm py-3 px-5 text-white w-24  rounded-xl'
        >
            + Add the Picture
        </label>
        <input type="file" 
            name="BlinkFile" 
            id="file"
            className='hidden'
            size={5}
            // className='hidden my-4 bg-red-400 w-full'
            placeholder='Add a Picture '
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
        value={Blink.title}
        onChange={(e)=>{setBlink({...Blink,[e.target.name]: e.target.value})}}
        cols="30" 
        rows="4"
        autoFocus 
        placeholder='write about the Blink . . . .'
        className=' w-full px-5 text-gray-400 bg-transparent outline-none'/>
        <div>
        <button type="submit" className='bg-gray-900 bg-opacity-90 border-2 border-gray-700 text-sm py-4 px-5 text-white rounded-xl'>Upload Blink</button>
        </div>
        </form>
        </div>  
        
    </div>
  )
}

export default UploadBlink