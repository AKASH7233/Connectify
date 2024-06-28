import React,{useEffect,useState} from 'react';
import toast from 'react-hot-toast'
import { BsThreeDots } from "react-icons/bs";
import { Link } from 'react-router-dom'
import profileImg from '../../assets/profile.png'
import { FaXmark } from "react-icons/fa6";
import BackBtn from '@/components/BackBtn';
import { useDispatch } from 'react-redux';
import { DropdownMenuDemo } from '@/components/shadCompo/Dropdown';
import { DialogCloseButton } from '../shadCompo/Share';
import { useNavigate } from 'react-router-dom'; 
import { myPosts } from '@/redux/postSlice';


const ProfileHeader = ({user, follow, toggle, toggleview}) => {
    const navigate = useNavigate()
    const [option,setOptions] = useState(false)
    const [postCount,setPostCount] = useState('')
    const dispatch = useDispatch()
    
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

    const handleMessageClick = () =>{
      if(!user?.isFollowed){
        return toast.error('Follow the user to send message')
      }
      navigate('/chat' , {state : { person : user}})
    }

    useEffect(()=>{
      (async()=>{
        let response = await dispatch(myPosts(user?._id))
        setPostCount(response?.payload?.data?.length)
      })()
    })

    // console.log(user);
    const sharelink = `https://connectify-omega.vercel.app/user/${user?._id}`
    const title = user?.username 
    
    return (
      <div className='p-4 '>
        <header className='relative flex justify-between items-center mb-5 px-2'>
          <BackBtn />
          {follow &&<button onClick={toggleOptions} className='p-2 rounded-[50%] bg-gray-900 bg-opacity-90 border-2 border-gray-700'>{option ? <FaXmark /> : <BsThreeDots  />}</button> }
          
            {!follow &&
            //  <div>
            //   <h2 onClick={logoutUser} className=' bg-gray-900  bg-opacity-90 border-2 border-gray-700 text-sm py-1 px-4 text-gray-400 rounded-[10px] text-center'>logout</h2>
            //   <h2 onClick={()=>{setSure(true)}} className=' bg-gray-900  bg-opacity-90 border-2 border-gray-700 text-sm py-1 px-4 text-red-400 rounded-[10px]'>delete Account</h2>
            // </div>
             <DropdownMenuDemo user={user}/>
            }

            {option && follow && <h2 className='absolute right-12 bg-gray-900 bg-opacity-90 py-2 border-2 border-gray-700 text-sm  px-4 rounded-[10px]' onClick= {()=>{toast.success(`user reported Successfully`)} }>report user</h2>}
            {option && follow && <h2 className='absolute right-12 top-12 bg-gray-900 bg-opacity-90 border-2 border-gray-700 text-sm  rounded-[10px]'><DialogCloseButton post={false} className={'text-sm'} title={title} shareLink={sharelink} drawer={true}/></h2>}
            
         
        </header>

          <div className='flex justify-center '>
            <img onClick={seeProfile} src={profile} alt="profileImg" className='w-28 h-28 border-gray-400 border-2 p-1 rounded-[50%] object-fit'/>
            
          </div>
          <div>
              <h2 className='text-center mt-2 text-xl '>{user?.fullName}</h2>
              <h2 className='text-gray-500 text-center'>@{user?.username}</h2>
              <p className='text-gray-400 text-center'>{user?.Description}</p>
          </div>
        
          <div className='flex justify-between items-center px-4 my-3'>
            <div>
              <h2 className='text-center'>{postCount}</h2>
              <p className='text-gray-500'>{postCount > 1 ? 'Posts' : 'Post' }</p>
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
            follow ? <div className='flex mt-7 gap-3 px-2 w-full justify-around  lg:justify-evenly xl:justify-evenly'>
            <button className='px-6 py-2 w-40 rounded-xl bg-blue-500 ' onClick={togglefollow}>{user?.isFollowed ? 'UnFollow' : 'Follow' }</button>
            <button onClick={handleMessageClick} className='px-6 py-2 w-40 rounded-xl bg-gray-800 '>
              Message
            </button>
          </div> : ''
          }
          {/* {sure && <AlertBox open={sure} warning={'account '} 
        resFunc={response}/>} */}
          {/* {edit && <DialogDemo open={edit}/>} */}
      </div>
      
  );
};

export default ProfileHeader;
