import React, { useEffect, useState } from 'react'
import axiosInstance from '../utils/ApiFetch'

function Search() {
    const [inp,setInput] = useState('')
    useEffect(()=>{
        (async()=>{
            if(!inp) return null
            let response = await axiosInstance.post(`/user/profile/${inp}`)
            console.log(response);
        })()
    },[inp])
  return (
    <div>
        <input 
        type="text" 
        value={inp}
        onChange={(e)=>{setInput(e.target.value)}}
        className='bg-black text-white'
        />
    </div>
  )
}

export default Search