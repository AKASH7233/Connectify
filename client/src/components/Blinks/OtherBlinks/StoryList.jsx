import React,{useState,useEffect} from 'react';
import { useDispatch } from 'react-redux';
import profileImg from '../../../assets/profile.png';
import {  getBlink } from '@/redux/blinkSlice';

export default function StoryList({ onSelectStory }) {
  const [stories,setstories] = useState()
  const dispatch = useDispatch()

  useEffect(()=>{
    (async()=>{
      let response =  await dispatch(getBlink())
      console.log(response?.data?.data);
      setstories(response?.payload?.data)
    })()
  },[])
  console.log(stories);

  return (
   <div className='py-1 lg:py-3 md:py-3  xl:py-3 2xl:py-3'>
    <div className="flex space-x-4 overflow-x-auto p-4">
      {stories?.map((story,i) => {
        const getThumbnail = story.stories[0]?.file.replace(/\.mp4/g, '.jpg')
        console.log(getThumbnail);
        const preview = getThumbnail || profileImg 
        return(  
        <div className='cursor-pointer text-white' key={story.id} onClick={() => onSelectStory(story)}>
          <img
            className={`w-16 h-16 rounded-full border-2 ${story.stories[0]?.seen ? 'border-gray-400': 'border-red-500'}  p-1 object-cover`}
            src = {preview}
            alt={story.username}
          />
          <p className="text-center text-sm  mt-3">{story?.username}</p>
        </div>)
      })}
    </div> 
   </div>
  );
}
