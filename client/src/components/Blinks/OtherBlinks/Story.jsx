// src/Story.js
import React, { useState } from 'react';
import StoryList from './StoryList';
import StoryViewer from './StoryViewer';

const Stories = () => {
    const [selectedStory, setSelectedStory] = useState(null);
    console.log(`selectedStory`,selectedStory);
    return (
      <div className="Story">
        <StoryList onSelectStory={setSelectedStory} />
        <StoryViewer story={selectedStory} onClose={() => setSelectedStory(null)} />
      </div>
    );
};

export default Stories;
