import React, { useEffect, useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { getBlink } from '@/redux/blinkSlice';
import { Zuck } from 'zuck.js';
import 'zuck.js/css';
import 'zuck.js/skins/snapgram';

const transformStoriesData = (storiesData) => {
    return storiesData.map(user => ({
      id: user._id,
      photo: user.profileImage || 'https://via.placeholder.com/150',
      name: user.username,
      link:  'https://via.placeholder.com/300' ,
      lastUpdated: new Date(user.stories[user.stories.length - 1]?.createdAt).getTime(),
      items: user.stories.map(story => ({
          id: `${user._id}-${story.title.replace(/\s+/g, '-')}`,
          type: story.file.endsWith('.mp4') ? 'video' : 'photo',
          length: story.file.endsWith('.mp4') ? 5 : 3,
          src: story.file || 'https://via.placeholder.com/300',
          preview: story.file || 'https://via.placeholder.com/150',
          link: story.link[0]?.value || '',
          linkText: story.link[0]?.heading || '',
          muted: false
        }))
      }));
  };

const Stories = () => {
  const [storiesData, setStoriesData] = useState([]);
  const dispatch = useDispatch();
  const zuckInstance = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await dispatch(getBlink());
      console.log(response?.payload?.data);
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
        });
      }
    }
  }, [storiesData]);

  useEffect(() => {
    return () => {
      if (zuckInstance.current) {
        zuckInstance.current.destroy();
        zuckInstance.current = null;
      }
    };
  }, []);

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

  return <div id="stories" className="storiesWrapper"></div>;
};

export default Stories;



