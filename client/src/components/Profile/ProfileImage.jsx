import React,{useState} from 'react'
import profile from '../../assets/profile.png'
import { BsThreeDots } from "react-icons/bs";
import { IoArrowBackOutline } from "react-icons/io5";
import {useDispatch} from 'react-redux'
import { updateProfileImg ,deleteProfileImage} from '@/redux/authSlice';
import { FaXmark } from "react-icons/fa6";


function ProfileImage({img , toggleview,edit = false}) {
  const dispatch = useDispatch()
  const [showEditingOptions,setShowEditingOptions] = useState(false)
  const profileImg = img ? img : profile
  const [profileImageImage, setProfileImageImage] = useState(profileImg)
  const [ImgforBd,setImgForBd] = useState()
  const goback = () =>{
    toggleview()
  }
  const handleAvatar = (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    setImgForBd(file)
    if (file) {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.addEventListener("load", async () => {
        setProfileImageImage(fileReader.result);
      })
    }
  }

  const upload = async() => {
    const formdata = new FormData()
    formdata.append('ProfileImage',ImgforBd)
    console.log(formdata);
    await dispatch(updateProfileImg(formdata))
  }

  const deleteProfileImg = async() => {
    await dispatch(deleteProfileImage())
    setProfileImageImage(profile)
  }

  

  return (
    <div className='h-[100vh] relative'>
         <div className='p-4'>
          <header className='flex justify-between items-center mb-5 px-2'>
            <button className='p-2 rounded-[50%] bg-gray-900 bg-opacity-90 border-2 border-gray-700' onClick={goback}><IoArrowBackOutline  className='text-xl'/></button>
           {edit &&  <button onClick={()=>{setShowEditingOptions(prev =>!prev)}} className='p-2 rounded-[50%] bg-gray-900 bg-opacity-90 border-2 border-gray-700'>{showEditingOptions ? <FaXmark /> : <BsThreeDots  /> }</button>}
          </header>
        </div>
        <div className='h-[60vh] my-12'>
          <img src={profileImageImage} alt="" className='h-[50vh] object-cover'/>
        </div>
       {showEditingOptions &&
          <div className='absolute bottom-0 '>
           <button onClick={deleteProfileImg} className='w-[50vw] lg:w-60 py-3 bg-gray-900 text-red-500'>delete</button>
           <label className='w-[50vw] pl-[20vw] lg:pl-20 py-3' htmlFor='pic'>upload</label>
           <input 
           type="file"
           className='hidden' 
           id='pic'
           onChange={handleAvatar}
           />
           <button onClick= {upload} className='py-4 px-24 lg:px-36 opacity-90'><h2 className='text-center'>Set as Profile Image</h2></button>
         </div>
       }
    </div>
  )
}

export default ProfileImage