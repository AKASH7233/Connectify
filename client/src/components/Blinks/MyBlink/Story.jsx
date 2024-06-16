import React, { useState } from 'react';
import StoryList from './Storylist';
import StoryViewer from './StoryViewer';

function Story() {
  const [selectedStory, setSelectedStory] = useState(null);
  console.log(`selectedStory`,selectedStory);
  return (
    <div className="Story">
      <StoryList onSelectStory={setSelectedStory} />
      <StoryViewer story={selectedStory} onClose={() => setSelectedStory(null)} />
    </div>
  );
}

export default Story;
