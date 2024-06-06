import React,{useState,useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import profileImg from '../../assets/profile.png'
import { currentBlink } from '@/redux/blinkSlice';
import { IoIosAddCircleOutline } from "react-icons/io";
import { useNavigate } from 'react-router-dom';

export default function StoryList({ onSelectStory }) {
  const [stories,setstories] = useState()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const currentUser = useSelector(state => state.auth.user).user
  const userProfileImg = currentUser?.ProfileImage || profileImg

  useEffect(()=>{
    (async()=>{
      let response =  await dispatch(currentBlink())
      console.log(response?.data?.data);
      setstories(response?.payload?.data)
    })()
  },[])
  return (
   <div className='p-1 lg:p-3 md:p-3  xl:p-3 2xl:p-3'>
    {stories?.length != 0 ?  <div className="flex space-x-4 overflow-x-auto p-4">
      {stories?.map(story => {
        const getThumbnail = story.stories[0]?.file.replace(/\.mp4/g, '.jpg')
        console.log(getThumbnail);
        const preview = getThumbnail || profileImg 
        return(  
        <div className='cursor-pointer' key={story.id} onClick={() => onSelectStory(stories)}>
          <img
            className="w-16 h-16 rounded-full border-2 border-red-500 p-1 object-cover"
            src = {preview}
            alt={story.username}
          />
          <p className="text-center text-sm mt-3">{`my Blink`}</p>
        </div>)
      })}
    </div> : <div className='cursor-pointer' onClick={()=>{navigate('/uploadBlink')}}> 
          <div className='relative'>
            <img
              className="w-16 h-16 rounded-full border-2  p-1 object-fill"
              src = {userProfileImg}
              alt={currentUser?.username}
            />
            <span className='absolute bottom-1 right-3'><IoIosAddCircleOutline className='text-xl bg-black'/></span>
          </div>
          <p className="text-center text-sm mt-3">{`Add a Blink`}</p>
        </div>}
   </div>
  );
}
