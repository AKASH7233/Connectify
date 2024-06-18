import React,{useEffect,useState} from 'react';
import { IoIosAddCircleOutline } from "react-icons/io";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { currentBlink } from '@/redux/blinkSlice';

import profileImg from '../../../assets/profile.png'

export default function StoryList({ onSelectStory }) {
  const [stories,setstories] = useState()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const currentUser = useSelector(state => state.auth.user).user
  const userProfileImg = currentUser?.ProfileImage || profileImg
  
  const renderStories = () => {
    return stories?.map((story,index) => {
      const getThumbnail = story.stories[0]?.file.replace(/\.mp4/g, '.jpg')
      const preview = getThumbnail || profileImg
      return (
        <div className='cursor-pointer' key={index} onClick={() => onSelectStory(stories)}>
          <img
            className="w-16 h-16 rounded-full border-2 border-red-500 p-1 object-cover"
            src={preview}
            alt={story.username}
          />
          <p className="text-center text-sm mt-3">{`my Blink`}</p>
        </div>
      )
    });
  }

  const renderLogin = () => {
    return (
      <div className='cursor-pointer pl-4 ' onClick={() => { navigate('/uploadBlink') }}>
        <div className='relative'>
          <img
            className="w-16 h-16 rounded-full border-2  p-1 object-fill"
            src={userProfileImg}
            alt={currentUser?.username}
          />
          <span className='absolute bottom-1 right-3'><IoIosAddCircleOutline className='text-xl bg-black' /></span>
        </div>
        <p className="text-center text-sm mt-3">{`Add a Blink`}</p>
      </div>
    );
  }

  useEffect(()=>{
    (async()=>{
      let response =  await dispatch(currentBlink())
      console.log(response?.data?.data);
      setstories(response?.payload?.data)
    })()
  },[])

  return (
    <div className=''>
      {stories?.length != 0 ? <div className="flex space-x-4 overflow-x-auto pl-4 ">
        {renderStories()}
      </div> : renderLogin()}
    </div>
  );
}
