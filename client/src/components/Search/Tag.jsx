import axiosInstance from '@/utils/ApiFetch';
import React, { useEffect, useState } from 'react';
import profileImg from '../../assets/profile.png';

const TaggingComponent = ({tagUsers}) => {
  const [tags, setTags] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const handleInputChange = async (e) => {
    setInputValue(e.target.value);
    if (e.target.value) {
      const response = await axiosInstance.get(`/search/search/${e.target.value}`);
      setSuggestions(response?.data?.data);
    } else {
      setSuggestions([]);
    }
  };

  console.log(`tags: ${tags[0]?._id}`);

  const handleAddTag = (user) => {
    console.log(`userId: ${user?._id}`);
    console.log(`tagid: ${tags[0]?.id}`);
    tags.some(tag => console.log(tag?._id))
    if (!tags.some(tag => tag?._id == user?._id)) {
      setTags([...tags, user]);
    }
    setInputValue('');
    setSuggestions([]);
  };

  console.log(tags);


  const handleRemoveTag = (user) => {
    setTags(tags.filter(tag => tag?._id !== user?._id));
  };

  useEffect(()=>{
    let ids = []
    tags.forEach(tag => {
      let id = (tag?._id)
      ids.push(id)
    })
    console.log(`ids`,ids);
    tagUsers(ids)
  },[tags]);

  return (
    <div className="p-4">
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder="Tag someone..."
        className=" bg-transparent outline-none rounded p-2 w-full"
      />
      <ul className="mt-2">
        {suggestions?.map((user) => {
          let profileImage = user?.ProfileImage ? user.ProfileImage : profileImg;
          return (
            <li key={user?.id} onClick={() => handleAddTag(user)} className="cursor-pointer hover:bg-gray-700 p-2">
              <div className='flex items-center gap-x-5'>
                <img src={profileImage} className='w-5 h-5 object-cover rounded-full' alt="" />
                {user?.username}
              </div>
            </li>
          );
        })}
      </ul>
      <div className="mt-2 flex flex-wrap gap-2">
        {tags?.map((tag) => (
          <span key={tag.id} className="bg-gray-700 rounded-full px-3 py-1 cursor-pointer flex gap-x-2 items-center">
            @{tag.username}
            <button className='text-[12px]'  onClick={() => handleRemoveTag(tag)}>X</button>
          </span>
        ))}
      </div>
    </div>
  );
};

export default TaggingComponent;
