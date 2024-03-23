import React, { useEffect, useState } from 'react'
import ProfileHeader from '../components/Post/Profile/ProfileHeader'
import Follow from '../components/Post/FollowerLists/Follow'

function MyProfile() {

  return (
    <div className='bg-black text-white'>
        <ProfileHeader/>
        <Follow />
    </div>
  )
}

export default MyProfile