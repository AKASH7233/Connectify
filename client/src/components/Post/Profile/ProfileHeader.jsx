import React,{useEffect,useState} from 'react';
import toast from 'react-hot-toast'
import { BsThreeDots } from "react-icons/bs";
import { IoArrowBackOutline } from "react-icons/io5";
import { Link, useNavigate } from 'react-router-dom'
import { MdEdit } from "react-icons/md";
import profileImg from '../../../assets/profile.png'
import { FaXmark } from "react-icons/fa6";

const ProfileHeader = ({user, follow, toggle, toggleview}) => {
    const [option,setOptions] = useState(false)
    const goback = () =>{
      window.history.go(-1)
    }
    const togglefollow = () =>{
      toggle()
    }
    const seeProfile = () => {
      toggleview()
    }

    const toggleOptions = ()=> {
      setOptions(prev => !prev)
    }
    const profile = user?.ProfileImage ? user?.ProfileImage : profileImg

    const navigate = useNavigate();
    const handleMessageClick = () =>{
      if(!user?.isFollowed){
        return toast.error('Follow the user to send message')
      }
      navigate('/chat' , {state : { person : user}})
    }

    return (
      <div className='p-4 '>
        <header className='relative flex justify-between items-center mb-5 px-2'>
          <button className='p-2 rounded-[50%] bg-gray-900 bg-opacity-90 border-2 border-gray-700' onClick={goback}><IoArrowBackOutline  className='text-xl'/></button>
          <button onClick={toggleOptions} className='p-2 rounded-[50%] bg-gray-900 bg-opacity-90 border-2 border-gray-700'>{option ? <FaXmark /> : <BsThreeDots  />}</button>
         {option && 
           <div className='absolute right-12 '>
            {!follow && <h2 className=' bg-gray-900 bg-opacity-90 border-2 border-gray-700 text-sm py-1 px-4 text-red-400 rounded-[10px]'>delete Account</h2>}
            {follow && <h2 className=' bg-gray-900 bg-opacity-90 border-2 border-gray-700 text-sm py-1 px-4 rounded-[10px]'>report user</h2>}
           </div>
         }
        </header>
        
          <div className='relative'>
            <img onClick={seeProfile} src={profile} alt="profileImg" className='w-28 h-28 mx-28 border-gray-400 border-2 p-1 rounded-[50%] object-fit'/>
            {!follow && <button onClick = {seeProfile}className='absolute bottom-0 right-28 bg-gray-700 p-2 rounded-[50%]'><MdEdit /></button>}
          </div>
          <div>
              <h2 className='text-center mt-2 text-xl '>{user?.fullName}</h2>
              <h2 className='text-gray-500 text-center'>@{user?.username}</h2>
              <p className='text-gray-400 text-center'>{user?.Description}</p>
          </div>
        
          <div className='flex justify-between items-center px-4 my-3'>
            <div>
              <h2 className='text-center'>{user?.posts?.length}</h2>
              <p className='text-gray-500'>{user?.posts?.length > 1 ? 'Posts' : 'Post' }</p>
            </div>
           <Link to={`/followlist/Followers/${user?._id}`}>
            <div>
                <h2 className='text-center'>{user?.FollowersCount}</h2>
                <p className='text-gray-500'>{user?.FollowersCount > 1 ? 'Followers' : 'Follower' }</p>
              </div>
           </Link>
           <Link to={`/followlist/Following/${user?._id}`}>
           <div>
              <h2 className='text-center'>{user?.FollowingCount}</h2>
              <p className='text-gray-500'>{user?.FollowingCount > 1 ? 'Followings' : 'Following'  }</p>
            </div>
           </Link>
          </div>
          {
            follow ? <div className='flex mt-7 gap-3 px-2'>
            <button className='px-6 py-2 w-40 rounded-xl bg-blue-500 ' onClick={togglefollow}>{user?.isFollowed ? 'UnFollow' : 'Follow' }</button>
            <button onClick={handleMessageClick} className='px-6 py-2 w-40 rounded-xl bg-gray-800 '>
              Message
            </button>
          </div> : <Link to={'/editprofile'}><button className=' px-10 my-2 py-3 w-80 rounded-xl text-lg bg-blue-500  '>Edit Your Profile</button></Link>
          }
      </div>
      
  );
};

export default ProfileHeader;
