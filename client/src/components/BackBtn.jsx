import React from 'react'
import { IoArrowBackOutline } from "react-icons/io5";
function BackBtn({className}) {
    const goback = () =>{
        window.history.go(-1)
      }
  return (
    <div>
        <button className={`p-2 rounded-[50%] bg-gray-900 bg-opacity-90 border-2 
        text-white border-gray-700 ${className}`} onClick={goback}><IoArrowBackOutline  className='text-xl'/></button>
    </div>
  )
}

export default BackBtn