import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { CgLogOut,CgProfile } from "react-icons/cg";
import { FaHome } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";
import { FaUserFriends } from "react-icons/fa";
import { FaUpload } from "react-icons/fa";
import RenderMenuItem from '../Feed/RenderMenu';

const Footer = ({ActiveMenuItem}) => {
  const [show, setShow] = useState(true);
  let lastScrollY = window.scrollY;

  const currentUser = useSelector(state=> state?.auth?.user) 
  const currentUserId = currentUser?.user?._id
  
  ActiveMenuItem != undefined ? localStorage.setItem('item',JSON.stringify(ActiveMenuItem)) : ''

  const menuItems = [
    { to: '/', resp: 'Home', icon: FaHome},
    { to: '/search', resp: 'Search', icon: FaSearch },
    { to: '/uploadpost', resp: 'Upload', icon: FaUpload},
    { to: `/followlist/Followers/${currentUserId}`, resp: 'Follow', icon: FaUserFriends},
    { to: '/myProfile', resp: 'Profile', icon: CgProfile},
  ];

  
  let respItem = ActiveMenuItem || JSON.parse(localStorage.getItem('item'))

  const controlFooter = () => {
    if (window.scrollY > lastScrollY) {
      setShow(false);
    } else {
      setShow(true);
    }
    lastScrollY = window.scrollY;
  };

  useEffect(() => {
    window.addEventListener('scroll', controlFooter);
    return () => {
      window.removeEventListener('scroll', controlFooter);
    };
  }, []);
  return (
    <div>
        <footer className={`fixed  bottom-0 left-0 z-30 w-full bg-black shadow-md transition-transform duration-300 ${show ? 'transform translate-y-0' : 'transform translate-y-full'}`}>
      <div className="container mx-auto px-4 pt-2 pb-1  flex justify-around  items-center">
        {/* <Link to={'/'}><div className="text-xl  text-white font-bold" onClick={()=>{window.scrollTo({top: 0 , behavior: 'smooth'})}}><FaHome/></div></Link>
        <Link to={'/search'}><div className="text-xl  text-white font-bold"><FaSearch/></div></Link>
        <Link to={'/upload'}><div className=" px-4 py-2 rounded-xl  text-white font-bold"><FaUpload/></div></Link>
        <Link to={`/followlist/Followers/${currentUserId}`}><div className="text-xl  text-white font-bold"><FaUserFriends/></div></Link>
        <Link to={'/myprofile'}><div className="text-xl  text-white font-bold"><CgProfile/></div></Link> */}
        
        {menuItems.map((item) =><Link to={item.to}><div onClick={()=>{window.scrollTo({top:0, behavior : 'smooth'}) }} className={`text-xl px-5 py-2 text-white font-bold ${respItem == item.resp ? ' py-3 rounded-xl  bg-gray-900 bg-opacity-90 text-3xl border border-gray-400': ''} `}><item.icon/></div></Link>)}
      </div>
    </footer>
    </div>
  );
};

//  text-sm py-1

export default Footer;
