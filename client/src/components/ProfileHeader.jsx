import React from 'react';
import profileimg from '../assets/profile.png'

const ProfileHeader = ({ profileImg , username, name, followers, following, bio }) => {
    const profile = profileImg ? profileImg : profileimg
  
    return (
      <div className='p-4'>
        <div className='flex gap-x-8'>
          <img src={profile} alt="profileImg" className='w-20'/>
          <div className='flex gap-x-5 items-center'>
            <div>
              <h2 className='text-center'>0</h2>
              <p className='text-gray-500'>posts</p>
            </div>
            <div>
              <h2 className='text-center'>{followers}</h2>
              <p className='text-gray-500'>Followers</p>
            </div>
            <div>
              <h2 className='text-center'>{following}</h2>
              <p className='text-gray-500'>Following</p>
            </div>
          </div>
        </div>
        <div className='flex my-4 gap-x-10 px-4'>
          <div>
            <h2>{name}</h2>
            <h2 className='text-gray-500'>@{username}</h2>
            <p className='text-gray-400'>{bio}</p>
          </div>
          <div>
            <button className='px-10 py-2 bg-[#C147E9] rounded-sm'>Edit your Profile</button>
          </div>
        </div>
      </div>
  );
};

export default ProfileHeader;
