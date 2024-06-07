import React, { useState } from 'react';
import Stories from 'react-insta-stories';
import profileImg from '../../assets/profile.png'
import { IoMdArrowDropleft } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import {Trash2} from 'lucide-react'
import AlertBox from '../shadCompo/AlertBox';
import { ViewerList } from '../shadCompo/Viewer';

export default function StoryViewer({ story, onClose }) {
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [currentOpenedStory, setCurrentOpenedStory] = useState(null);
  const [view,setView] = useState(false)
  const [isPaused,setIsPaused] = useState(false)
  const navigate = useNavigate()
  if (!story || story.length === 0) return null;

  const currentStory = story[currentStoryIndex];
    
  console.log(story[0]);
  
  let height = window.screen.availHeight - 80
  console.log(height);
  const determineMediaType = (src) => {
    const extension = src.split('.').pop();
    if (['mp4', 'webm', 'ogg'].includes(extension)) {
      return 'video';
    }
    return 'image';
  };

  let stories = []
  currentStory.stories.map((item)=>{
    console.log(item);
    const mediaType = determineMediaType(item.file)
    let postAt;
    const postedAt = new Date(item.createdAt)
    const currentTime = new Date()
    var diffMs = currentTime.getTime() - postedAt.getTime();
    var diffDays = Math.floor(diffMs / 86400000); // days
    var diffHrs = Math.floor((diffMs % 86400000) / 3600000); // hours
    var diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes
    var diffS = Math.round(((diffMs % 86400000) % 3600000) / 3600000000);    

    if(diffDays > 0){
      postAt = `${diffDays}d ago`;
    }else if(diffHrs > 0){
      postAt = `${diffHrs}h ago`
    }
    else if(diffMins > 0){
      postAt = `${diffMins}m ago`
    }
    else{
      postAt = `${ diffS}s ago`
    }

    const Heading = {
      heading: story[0]?.username,
      subheading:postAt,
      profileImage: story[0]?.profileImage || profileImg
    }
    return mediaType == 'image' ? stories.push({id:item?.id,url: item.file,header: Heading ,type: 'image',duration:5000}) : stories.push({id: item?.id,url: item.file,header : Heading,type: 'video'})
  })

  const handleStoryEnd = () => {
    if (currentStoryIndex < story.length - 1) {
      setCurrentStoryIndex(currentStoryIndex + 1);
    } else {
      onClose(); // Close viewer if it's the last story
    }
  };

  const onStoryStart = (index, story) => {
    setCurrentOpenedStory(stories[index]);
  };

  const res = (resp) => {
    setView(resp)
  }

  return (
    <div className={`fixed inset-0 flex items-center justify-center ${window.screen.availWidth >= 500 ? 'bg-black' : 'bg-[#111]' } z-50`}>
      <button className="hidden md:block lg:block xl:block absolute top-4 right-4 text-white" onClick={onClose}>
        X
      </button>
      <div className='hidden  xl:block 2xl:block'>
        <div className='absolute bottom-6 left-[30%] flex justify-between w-[45%] px-2 text-sm'>
          <div>
            <p>Viewers</p>
            <ViewerList currentOpenedStory={currentOpenedStory} />
          </div>
          <div className='flex gap-x-5 py-4'>
            <button onClick={()=>{navigate('/uploadBlink')}}>+ Add Blink</button>
            <button onClick={()=>{setView(true)}} className='text-red-400'><Trash2 className='text-sm'/></button>
          </div>
        </div>
      </div>
      <div className='h-screen '>
        <Stories
          stories={stories}
          defaultInterval={8000}
          onStoryStart={onStoryStart}
          height={height}
          width={345}
          onAllStoriesEnd={handleStoryEnd}
        />
        <button className="absolute top-8 left-0 text-white lg:hidden xl:hidden md:hidden" onClick={onClose}>
        <IoMdArrowDropleft className='text-2xl'/>
        </button>
        <div className='flex justify-between items-end px-2 text-sm'>
        <div>
          <p>Viewers</p>
          <ViewerList currentOpenedStory={currentOpenedStory}/>
        </div>
        <div className='flex gap-x-5 py-4 lg:hidden xl:hidden'>
        <button onClick={()=>{navigate('/uploadBlink')}}>+ Add Blink</button>
        <button onClick={()=>{setView(true)}} className='text-red-400'><Trash2 className='text-sm'/></button>
        </div>
        </div>
      </div>
      {view && <AlertBox open={true} id={currentOpenedStory?.id} warning={'blink '} resFunc={res}/> }
    </div>
  );
}

