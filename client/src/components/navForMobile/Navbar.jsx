import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";

const Navbar = () => {
    
  const [show, setShow] = useState(true);
  const [AtTop, setAtTop] = useState(true);
  let lastScrollY = window.scrollY;

  const controlNavbar = () => {
    if (window.scrollY > lastScrollY) {
      setShow(false);
    } else {
      setShow(true);
    }
    lastScrollY = window.scrollY;
  };

  const controlAtTop = () => {
    if (window.scrollY < 100) {
      setAtTop(true);
    } else {
      setAtTop(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', controlNavbar);
    window.addEventListener('scroll', controlAtTop);
    return () => {
      window.removeEventListener('scroll', controlNavbar);
      window.addEventListener('scroll', controlAtTop);
    };
  }, []);



  return (
   <div className={`${AtTop && show ? 'mb-[52px]' : '' }`}>
     <nav className={`fixed  top-0 left-0 w-full z-40 bg-gray-950 shadow-md transition-transform duration-300 ${show ? 'transform translate-y-0' : 'transform -translate-y-full'}`}>
      <div className="container mx-auto px-4 py-3 flex justify-between  items-center">
        <Link to={'/'}><div className="text-xl  text-white font-bold" onClick={()=>{window.scrollTo({top: 0 , behavior: 'smooth'})}}>ConnectiFy</div></Link>
        <Link to={'/chat'}><div className="text-xl  text-white font-bold"><IoChatbubbleEllipsesOutline fontSize={24}/></div></Link>
      </div>
    </nav>
   </div>
  );
};

export default Navbar;
