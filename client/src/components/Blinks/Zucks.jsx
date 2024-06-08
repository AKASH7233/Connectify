import React, { useEffect, useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { BlinkViewed, getBlink } from '@/redux/blinkSlice';
import { Zuck } from 'zuck.js';
import 'zuck.js/css';
import 'zuck.js/skins/snapgram';
import '../../Custom.css';
import profileImg  from '../../assets/profile.png'
import axiosInstance from '@/utils/ApiFetch';
import { useNavigate } from 'react-router-dom';


const replaceFileExtension = (url, newExtension) => {
  const resp =  url.replace(/\.mp4$/, newExtension);
  console.log(resp);
  return resp
};

const transformStoriesData = (storiesData) => {
  return storiesData.map(user => {
      const transformedStories = user.stories.map(story => {
        console.log(story.file);
          const isVideo = story.file.endsWith('.mp4');
          const transformedFile = isVideo ? replaceFileExtension(story.file, '.jpg') : story.file;
          console.log(transformedFile);
          const dateStr = story.createdAt;
          const date = new Date(dateStr);
          const day = String(date.getUTCDate()).padStart(2, '0');
          const month = String(date.getUTCMonth() + 1).padStart(2, '0');
          const year = date.getUTCFullYear();
          const formattedDate = `${day}-${month}-${year}`;
          console.log(formattedDate)
          console.log(`story`,story?._id);

          return {
              id: story?._id,
              type: isVideo ? 'video' : 'photo',
              length: isVideo ? 5 : 3,
              src: story.file || profileImg,
              preview: transformedFile ,
              link: story.link[0]?.value || '',
              linkText: story.link[0]?.heading || '',
              time: formattedDate
          };
      }).filter(Boolean); // Filter out null items

      return {
          id: user.stories[0]?._id,
          photo: user.profileImage || profileImg,
          name: user.username,
          link: `/user/${user?._id}`,
          lastUpdated: new Date(user.stories[user.stories.length - 1]?.createdAt).getTime(),
          items: transformedStories
      };
  });
};


const Stories = () => {
  const [storiesData, setStoriesData] = useState([]);
  const dispatch = useDispatch();
  const zuckInstance = useRef(null);
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      const response = await dispatch(getBlink());
      if(response?.payload?.error){
        navigate('/login')
      };
      setStoriesData(response?.payload?.data || []);
    };
    fetchData();
  }, [dispatch]);

  useEffect(() => {
    if (storiesData.length > 0 && !zuckInstance.current) {
      const storiesElement = document.getElementById('stories');
      const transformedStories = transformStoriesData(storiesData);

      if (storiesElement) {
        zuckInstance.current = new Zuck(storiesElement, {
          skin: 'snapgram',
          avatars: true,
          list: false,
          openEffect: true,
          cubeEffect: true,
          autoFullScreen: false,
          backButton: true,
          backNative: true,
          localStorage: true,
          stories: transformedStories,
          callbacks: {
            onOpen: async (id, callback) => {
              console.log("Story opened:", id);
              const response = await dispatch(BlinkViewed(id));
              console.log(response.payload?.data);
              callback()
            }
          }
        });
      
      }
    }
  }, [storiesData]);

  // useEffect(() => {
  //   return () => {
  //     if (zuckInstance.current) {
  //       zuckInstance.current.destroy();
  //       zuckInstance.current = null;
  //     }
  //   };
  // }, []);

  const toggleMute = (event) => {
    const storyId = event.target.dataset.storyId;
    const itemId = event.target.dataset.itemId;
    const story = storiesData.find(story => story.id === storyId);
    if (story) {
        const item = story.items.find(item => item.id === itemId);
        if (item) {
            item.muted = !item.muted; // Toggle mute state
            // You can add visual feedback here if needed
            // For example, toggle classes or update button text
        }
    }
};

  return <div id="stories" className="storiesWrapper relative"></div>;
};

export default Stories;

