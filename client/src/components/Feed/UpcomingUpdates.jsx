import React from 'react'
import { MdUpcoming } from "react-icons/md";
import { FaVideo } from "react-icons/fa";
import { CiStreamOn } from "react-icons/ci";
import { FaPeopleGroup } from "react-icons/fa6";
import { MdLocalSee } from "react-icons/md";
function UpcomingUpdates() {
  return (
    <div className=' bg-gray-900 rounded-xl w-full p-4 bg-opacity-90 border-2  text-white border-gray-700 hover:scale-105 duration-300'>
        <h2 className="flex justify-center gap-x-4 items-center mb-4"><MdUpcoming className='md:hidden'/>Upcoming updates !!</h2>
        <ul className='flex flex-col gap-y-2'>
            <li className='flex items-center gap-x-2 md:text-[14px]'><MdLocalSee className='md:text-lg'/>Blink <span><p className='text-[10px] md:hidden text-gray-300'>(short post valid upto 24 hours)</p></span></li>
            <li className='flex items-center gap-x-4 md:text-[14px]'><CiStreamOn className='md:text-lg'/><span>Connectify Live</span></li>
            <li className='flex items-center gap-x-4 md:text-[14px]'><FaPeopleGroup className='md:text-lg'/><span>Communities</span></li>
            <li className='flex items-center gap-x-4 md:text-[14px]'><FaVideo className='md:text-lg'/><span>Random Video Interaction</span></li>
        </ul>
    </div>
  )
}

export default UpcomingUpdates