import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

function LikedBy({likedBy}) {
  console.log(likedBy);
  let random = Math.floor(Math.random() * likedBy?.length)
  console.log(random)
  const LikedBy = likedBy?.length >= 1 ? likedBy[random].users.username : '' 
  return (
    <div>
      <h2 className={`${likedBy?.length >= 1  ? 'block': 'invisible'} text-white`}>Liked By {LikedBy}</h2>
    </div>
  )
}

export default LikedBy