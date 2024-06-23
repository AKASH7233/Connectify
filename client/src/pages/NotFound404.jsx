import React from 'react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-xl mb-8">Page Not Found</p>
      <a 
        href="/" 
        className="bg-white text-black py-2 px-4 rounded-lg transition duration-300 hover:bg-gray-300"
      >
        Go Home
      </a>
    </div>
  );
}

export default NotFound;
