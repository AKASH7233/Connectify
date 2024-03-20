import React,{useState, useEffect} from 'react';
import profileimg from '../assets/profile.png'
import profileImg from '../assets/profile.png'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getUserData } from '../redux/authSlice'

const ProfileHeader = () => {
  const dispatch = useDispatch()
  const response = useSelector(state => state?.auth?.user).user
  const [user,setUser] = useState(response)
  useEffect(()=>{
    ;(async ()=>{
      let response = await dispatch(getUserData())
       setUser(response?.payload?.data[0])
      })()
  },[])
  
    const profile = profileImg ? profileImg : profileimg
  
    return (
      <div className='p-4'>
        <div className='flex gap-x-8'>
          <img src={profile} alt="profileImg" className='w-20'/>
          <div className='flex gap-x-5 items-center'>
            <div>
              <h2 className='text-center'>{user?.posts?.length}</h2>
              <p className='text-gray-500'>posts</p>
            </div>
            <div>
              <h2 className='text-center'>{user?.FollowersCount}</h2>
              <p className='text-gray-500'>Followers</p>
            </div>
            <div>
              <h2 className='text-center'>{user?.FollowingCount}</h2>
              <p className='text-gray-500'>Following</p>
            </div>
          </div>
        </div>
        <div className='flex my-4 gap-x-10 px-4'>
          <div>
            <h2>{user?.fullName}</h2>
            <h2 className='text-gray-500'>@{user?.username}</h2>
            <p className='text-gray-400'>{user?.bio}</p>
          </div>
          <div>
            <button className='px-10 py-2 bg-[#C147E9] rounded-sm'>Edit your Profile</button>
          </div>
        </div>
      </div>
  );
};

export default ProfileHeader;
