import React from 'react'
import Story from './MyBlink/Story'
// import StoriesComponent from './Zucks'
import Stories from '@/components/Blinks/OtherBlinks/Story'
function Blink() {
  
  return (
    <div className='flex items-center gap-x-0 bg-black'>
    <div className='text-white'><Story/></div>
    {/* <StoriesComponent /> */}
    <Stories/>
  </div>
  )
}

export default Blink