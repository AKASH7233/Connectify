// import {  SendIcon,  User2Icon } from "lucide-react";
// import { useEffect, useRef, useState } from "react";
// import { BsGithub, BsWhatsapp } from "react-icons/bs";
// import { CgProfile } from 'react-icons/cg';
// import { FaHome, FaUserFriends } from 'react-icons/fa';
// import { IoCall, IoImage, IoVideocam } from "react-icons/io5";
// import { MdOutlineReport } from "react-icons/md";
// import { useDispatch, useSelector } from "react-redux";
// import { useMediaQuery } from 'react-responsive';
// import { useLocation, useNavigate } from "react-router-dom";
// import { PulseLoader as Loader } from "react-spinners";
// import { animated } from "react-spring";
// import { useSpring } from "react-spring";
// import { io } from "socket.io-client";

// import { SheetSide } from "@/components/Drawer";
// import { fetchChatId, fetchPerson } from "@/redux/chatSlice";
// import { fetchMessages, sendMessageDispatch } from "@/redux/messageSlice";

// function ChatApp() {
//     const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
//     const login_user = useSelector((state) => state?.auth?.user?.user);
//     // const data = JSON.parse(localStorage.getItem('data'))?.data[0];
//     const user = login_user;
//     const location = useLocation();
//     const dispatch = useDispatch();
//     const [loading, setLoading] = useState(false);
//     const chatContainerRef = useRef(null);
//     const props = useSpring({ opacity: 1, from: { opacity: 0 } });
//     const [person, setPerson] = useState(location.state?.person || null);
//     const [personData, setPersonData] = useState([]);
//     const [chatId, setChatId] = useState(null);
//     const [message, setMessage] = useState('');
//     const [messages, setMessages] = useState([]);
//     const [onlineUsers, setOnlineUsers] = useState([]);
//     const [receiveMessage, setReceiveMessage] = useState(null);
    
//     const navigate = useNavigate();

//     const socket = useRef();

//     useEffect(() => {
//         socket.current = io('http://localhost:8800');
//         socket.current.emit('addUser', user?._id);
//         socket.current.on('getUsers', (users) => {
//             setOnlineUsers(users);
//         });
//         socket.current.on('receiveMessage', (data) => {
//             // Check if the received message is for the currently open chat
//             if (data.chatId === chatId) {
//                 setReceiveMessage(data);
//             }
//             console.log('recive message from socket par',setReceiveMessage);

//         });
//     }, [user, chatId]);

//     useEffect(() => {
//         if (receiveMessage) {
//             setMessages(prev => [...prev, receiveMessage]);
//         }
        
//     }, [receiveMessage]);

//     useEffect(() => {
//         const loadChatId = async () => {
//             setLoading(true);
//             if (person && user) {
//                 const chatId = (await dispatch(fetchChatId({ receiverId: person._id, senderId: user._id }))).payload._id;
//                 setChatId(chatId);

//                 const oldMessage = (await dispatch(fetchMessages(chatId))).payload;
//                 setMessages(oldMessage);
//             }
//             const result = (await dispatch(fetchPerson(user?._id))).payload;
//             const updatedPersonData = result.map(person => ({
//                 ...person,
//                 isOnline: onlineUsers.some(onlineUsers=> onlineUsers.userId === person._id),
//             }));
//             setPersonData(updatedPersonData);
//         };

//         loadChatId();
//         setLoading(false);
//     }, [person, user, dispatch, onlineUsers, chatId , receiveMessage]);

//     const personClickHandler = (index) => {
//         setPerson(personData[index]);
//     };

//     const sendMessage = async (event) => {
//         event.preventDefault();
//         if (message) {
//             const newMessage = {
//                 senderId: user?._id,
//                 chatId: chatId,
//                 text: message
//             };
//             try {
//                 const response = await dispatch(sendMessageDispatch(newMessage));
//                 setMessages(prevMessages => [...prevMessages, response.payload]);
//                 setMessage('');
//                 socket.current.emit('sendMessage', {
//                     ...response.payload,
//                     receiverId: person._id
//                 });
//             } catch (error) {
//                 console.error(error.message);
//             }
//         }
//     };

//     const handleImageUpload = (e) => {
//         e.preventDefault();
//         const uploadImage = e.target.files[0];
//         if (uploadImage) {
//             const reader = new FileReader();
//             reader.readAsDataURL(uploadImage);
//             reader.onloadend = async () => {
//                 const newMessage = {
//                     senderId: user?._id,
//                     chatId: chatId,
//                     text: message,
//                     image: reader.result
//                 };
//                 try {
//                     const response = await dispatch(sendMessageDispatch(newMessage));
//                     setMessages(prevMessages => [...prevMessages, response.payload]);
//                     setMessage('');
//                     socket.current.emit('sendMessage', {
//                         ...response.payload,
//                         receiverId: person._id
//                     });
//                 } catch (error) {
//                     console.error(error.message);
//                 }
//             };
//             reader.onerror = () => {
//                 console.error('A error occurred while reading the file.');
//             };
//         }
        
//     };
//     const handleIconclick = (icon) =>{
//         switch (icon) {
//             case 'Home':
//                 navigate('/')
//                 break;
//             case 'Profile':
//                 navigate('/myProfile')
//                 break;
//             case 'Follow':
//                 navigate(`/followlist/Followers/${user?._id}`)
//                 break;
//             case 'Github':
//                 window.location.href = 'https://github.com/daemonX10/Connectify';
//                 break;
//             case 'Whatsapp':
//                 window.location.href = 'https://wa.me/9082362144?text=I%27m%20here%20from%20Connectify';
//                 break;
//             default:
//                 break;
//         }
    
//     }
// return (
//     loading ?
//         <Loader color="#00BFFF" height={300} width={300} /> :
//         <div className={`h-screen max-h-screen flex flex-col md:flex-row bg-gradient-to-r from-gray-600 to-black`}>

//             {/* Sidebar */}
//             <div className={`hidden md:flex md:w-1/5 bg-black bg-gradient-to-b from-[#2d3436] to-black shadow-lg `}>

//                 {/* Icons */}
//                 <div className="hidden m-2 mt-8 md:flex md:flex-col items-center  space-y-8 space-x-5 md:space-x-0">
//                     <FaHome onClick={()=>handleIconclick('Home')} className="w-6 text-gray-400"  />
//                     <CgProfile onClick={() => handleIconclick('Profile')} className="w-6 text-gray-400" />
//                     <FaUserFriends onClick={() => handleIconclick('Follow')} className="w-6 text-gray-400" />
//                     <BsGithub onClick={() => handleIconclick('Github')} className="w-6 text-gray-400" />
//                     <BsWhatsapp onClick={() => handleIconclick('Whatsapp')} className="w-6 text-gray-400" />
//                 </div>

//                 {/* People to Chat */}
//                 <aside className="w-full bg-gradient-to-b from-slate-700 to-black p-6">
//                     {/* People to Chat code here... */}
//                     <h2 className="text-xl font-bold mb-4 text-white">Message</h2>
//                     <ul className="space-y-4 h-full  overflow-y-auto overflow-hidden ">
//                         {personData?.map((member, index) => (
//                             <li key={index} onClick={() => personClickHandler(index)} className="flex items-center justify-between cursor-pointer hover:bg-gray-900 p-3 rounded shadow-lg">
//                                 <span className="flex items-center justify-between">
//                                     {member.ProfileImage ? 
//                                     <img src={member.ProfileImage} className="mr-2 w-8 h-8 rounded-3xl object-fill" alt="user's ProfileImg" /> : <User2Icon className="mr-2 w-8 text-gray-400" />}
//                                     <span className="text-white flex justify-between items-center">
//                                         {member.username}
//                                         {member.isOnline ?
//                                             <span className="ml-2 bg-green-500 rounded-full w-3 h-3 inline-block"></span> :
//                                             <span className="ml-2 bg-red-400 rounded-full w-3 h-3 inline-block"></span>
//                                         }

//                                     </span>
//                                 </span>
//                             </li>
//                         ))}
//                     </ul>
//                 </aside>
//             </div>

//             {/* Main Chat Area */}
//             {person ? (
//                 <div className={`w-full md:w-4/5 bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 h-screen flex flex-col justify-between relative mt-4 md:mt-0 shadow-lg`}>
//                     {/* Header */}
//                     <header onClick={()=>{window.location.href = `user/${person?._id}`}} className="cursor-pointer md:w-[15rem] absolute top-0 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 text-white py-4 px-6 items-center shadow-md flex justify-between rounded-full my-5">
//                         <div className="flex items-center justify-start">
//                             {person?.ProfileImage ? 
//                                 <SheetSide icon={<img src={person?.ProfileImage} className=" w-6 h-8 rounded-3xl object-fill " alt="user's ProfileImg" />} /> : <SheetSide icon={<User2Icon className="hover:text-gray-600 transition duration-200 w-6" />} />}
//                             <div className="flex-col">
//                                 <h2 className="text-xl font-bold">{person.username}</h2>
//                                 <p className="text-sm">{onlineUsers.some(onlineUser=>onlineUser.userId == person?._id) ? 'Online' : 'Offline'}</p>
//                             </div>
//                         </div>
//                         {/*<div className="flex space-x-5">
//                             <IoCall className="text-3xl hover:text-gray-600 transition duration-200" />
//                             <IoVideocam className="text-3xl hover:text-gray-600 transition duration-200" />
//                             <MdOutlineReport className="text-3xl hover:text-gray-600 transition duration-200" />
//                         </div>*/}
//                     </header>

//                     {/* Main Chat Area */}
//                     <main ref={chatContainerRef} className="w-full flex-1 p-6 overflow-y-auto space-y-4 bg-gradient-to-l from-black via-gray-700 to-gray-900">
//                         {messages.map((message, i) =>
//                             <animated.div style={props} key={i} className={`w-fit rounded-xl py-3 px-5 break-words text-black ${user?._id == messages[i].senderId ? 'bg-indigo-100 ml-auto '  : ' bg-blue-200  mr-auto'}`}>
//                                 {message?.message}
//                             </animated.div>
//                         )}
//                     </main>

//                     {/* Message Input Area */}
//                     <footer className="bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 py-5 px-7 flex items-center shadow-md">
//                         <div className="flex items-center border border-gray-700 rounded-full px-5 py-3 focus-within:border-gray-600 w-full ">

//                             {/* Attachments */}
//                             <label htmlFor="image_upload">
//                                 <IoImage className="text-gray-400 text-3xl cursor-pointer hover:text-gray-500 transition duration-200" />
//                             </label>
//                             <input
//                                 className="hidden"
//                                 type="file"
//                                 onChange={handleImageUpload}
//                                 id="image_upload"
//                                 name="image_upload"
//                                 accept=".jpg , .jpeg, .png , .svg"
//                             />

//                             <input type="text" value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Type your message..." className="ml-3 focus:outline-none w-full text-gray-300 bg-gray-800" />
//                             <button onClick={sendMessage} className="ml-5 bg-gray-700 text-white px-5 py-3 rounded-full hover:bg-gray-600 focus:outline-none">
//                                 <SendIcon />
//                             </button>
//                         </div>
//                     </footer>
//                 </div>
//             ) : (
//                     <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-gray-800 to-gray-900">
//                     <h2 className="text-3xl text-white">Select a person to chat with</h2>
//                 </div>
//             )}

//         </div>
// );
// }
// export default ChatApp;

// // completly change the color/theme of ui from light and blue to dark and gray

import { SendIcon, User2Icon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { BsGithub, BsWhatsapp } from "react-icons/bs";
import { CgProfile } from 'react-icons/cg';
import { FaHome, FaUserFriends } from 'react-icons/fa';
import { IoCall, IoImage, IoVideocam } from "react-icons/io5";
import { MdOutlineReport } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useMediaQuery } from 'react-responsive';
import { useLocation, useNavigate } from "react-router-dom";
import { PulseLoader as Loader } from "react-spinners";
import { animated } from "react-spring";
import { useSpring } from "react-spring";
import { io } from "socket.io-client";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { IoCloseCircle } from "react-icons/io5";

import { SheetSide } from "@/components/Drawer";
import { fetchChatId, fetchPerson } from "@/redux/chatSlice";
import { fetchMessages, sendMessageDispatch } from "@/redux/messageSlice";

function ChatApp() {
    const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const login_user = useSelector((state) => state?.auth?.user?.user);
    const user = login_user;
    const location = useLocation();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const chatContainerRef = useRef(null);
    const props = useSpring({ opacity: 1, from: { opacity: 0 } });
    const [person, setPerson] = useState(location.state?.person || null);
    const [personData, setPersonData] = useState([]);
    const [chatId, setChatId] = useState(null);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [receiveMessage, setReceiveMessage] = useState(null);

    const navigate = useNavigate();

    const socket = useRef();

    const scrollToBottom =()=>{
        chatContainerRef.current?.scrollIntoView({behavior:'smooth'});
    }

    useEffect(() => {
        socket.current = io('http://localhost:8800');
        socket.current.emit('addUser', user?._id);
        socket.current.on('getUsers', (users) => {
            setOnlineUsers(users);
        });
        
    }, [user, chatId]);



    useEffect(() => {
        const loadChatId = async () => {
            setLoading(true);
            if (person && user) {
                const chatId = (await dispatch(fetchChatId({ receiverId: person._id, senderId: user._id }))).payload._id;
                setChatId(chatId);

                const oldMessage = (await dispatch(fetchMessages(chatId))).payload;
                setMessages(oldMessage);
            }
            const result = (await dispatch(fetchPerson(user?._id))).payload;
            const updatedPersonData = result.map(person => ({
                ...person,
                isOnline: onlineUsers.some(onlineUsers => onlineUsers.userId === person._id),
            }));
            setPersonData(updatedPersonData);
        };

        loadChatId();
        setLoading(false);
    }, [person, user, dispatch, onlineUsers, chatId, receiveMessage]);

    const personClickHandler = (index) => {
        setPerson(personData[index]);
        if (isMobile) {
            setIsSidebarOpen(false);
        }
    };

    const sendMessage = async (event) => {
        event.preventDefault();
        if (message) {
            const newMessage = {
                senderId: user?._id,
                chatId: chatId,
                text: message
            };
            try {
                const response = await dispatch(sendMessageDispatch(newMessage));
                setMessages(prevMessages => [...prevMessages, response.payload]);
                setMessage('');
                socket.current.emit('sendMessage', {
                    ...response.payload,
                    receiverId: person._id
                });
            } catch (error) {
                console.error(error.message);
            }
        }
    };

    const handleImageUpload = (e) => {
        e.preventDefault();
        const uploadImage = e.target.files[0];
        if (uploadImage) {
            const reader = new FileReader();
            reader.readAsDataURL(uploadImage);
            reader.onloadend = async () => {
                const newMessage = {
                    senderId: user?._id,
                    chatId: chatId,
                    text: message,
                    image: reader.result
                };
                try {
                    const response = await dispatch(sendMessageDispatch(newMessage));
                    setMessages(prevMessages => [...prevMessages, response.payload]);
                    setMessage('');
                    socket.current.emit('sendMessage', {
                        ...response.payload,
                        receiverId: person._id
                    });
                } catch (error) {
                    console.error(error.message);
                }
            };
            reader.onerror = () => {
                console.error('A error occurred while reading the file.');
            };
        }
    };

    const handleIconClick = (icon) => {
        switch (icon) {
            case 'Home':
                navigate('/');
                break;
            case 'Profile':
                navigate('/myProfile');
                break;
            case 'Follow':
                navigate(`/followlist/Followers/${user?._id}`);
                break;
            case 'Github':
                window.location.href = 'https://github.com/daemonX10/Connectify';
                break;
            case 'Whatsapp':
                window.location.href = 'https://wa.me/9082362144?text=I%27m%20here%20from%20Connectify';
                break;
            default:
                break;
        }
    };

        useEffect(() => {
            socket.current.on('receiveMessage', (data) => {
                if (data.chatId === chatId) {
                    setMessages(prevMessages => [...prevMessages, data]);
                }
            // console.log('recive message from socket par', setReceiveMessage);
        });
        scrollToBottom();
    }, [sendMessage]);

    return (
        loading ? (
            <Loader color="#00BFFF" height={300} width={300} />
        ) : (
            <div className={`h-screen flex flex-col ${isMobile ? '' : 'md:flex-row'} bg-gradient-to-r from-gray-600 to-black`}>
                {/* Sidebar */}
                <div className={`${isMobile ? 'fixed top-0 left-0 h-full z-50 bg-black bg-opacity-90' : 'hidden md:flex md:w-1/5'} bg-black bg-gradient-to-b from-[#2d3436] to-black shadow-lg ${isSidebarOpen ? 'block' : 'hidden'}`}>
                    {/* Icons */}
                    <div className={`${isMobile ? 'hidden' : 'block'} m-2 mt-8 flex flex-col items-center space-y-8`}>
                        <FaHome onClick={() => handleIconClick('Home')} className="w-6 text-gray-400 cursor-pointer" />
                        <CgProfile onClick={() => handleIconClick('Profile')} className="w-6 text-gray-400 cursor-pointer" />
                        <FaUserFriends onClick={() => handleIconClick('Follow')} className="w-6 text-gray-400 cursor-pointer" />
                        <BsGithub onClick={() => handleIconClick('Github')} className="w-6 text-gray-400 cursor-pointer" />
                        <BsWhatsapp onClick={() => handleIconClick('Whatsapp')} className="w-6 text-gray-400 cursor-pointer" />
                    </div>
                    {/* People to Chat */}
                    <aside className="w-full bg-gradient-to-b from-slate-700 to-black p-6">
                        <h2 className="text-xl font-bold mb-4 text-white">Message</h2>
                        <ul className="space-y-4 h-full overflow-y-auto">
                            {personData?.map((member, index) => (
                                <li key={index} onClick={() => personClickHandler(index)} className="flex items-center justify-between cursor-pointer hover:bg-gray-900 p-3 rounded shadow-lg">
                                    <span className="flex items-center justify-between">
                                        {member.ProfileImage ? 
                                            <img src={member.ProfileImage} className="mr-2 w-8 h-8 rounded-3xl object-fill" alt="user's ProfileImg" /> : <User2Icon className="mr-2 w-8 text-gray-400" />}
                                        <span className="text-white flex justify-between items-center">
                                            {member.username}
                                            {member.isOnline ?
                                                <span className="ml-2 bg-green-500 rounded-full w-3 h-3 inline-block"></span> :
                                                <span className="ml-2 bg-red-400 rounded-full w-3 h-3 inline-block"></span>
                                            }
                                        </span>
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </aside>
                </div>
                {/* Main Chat Area */}
                {person ? (
                    <div className={`w-full h-[100vh] ${isMobile ? '' : 'md:w-4/5'} bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 h-screen flex flex-col justify-between relative mt-4 md:mt-0 shadow-lg`}>
                        {/* Header */}
                        <header onClick={() => { window.location.href = `user/${person?._id}` }} className="cursor-pointer md:w-[15rem] absolute top-0 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 text-white py-4 px-6 items-center shadow-md flex justify-between rounded-full my-5">
                            <div className="flex items-center justify-start">
                                {person?.ProfileImage ? 
                                    <SheetSide icon={<img src={person?.ProfileImage} className=" w-6 h-8 rounded-3xl object-fill " alt="user's ProfileImg" />} /> : <SheetSide icon={<User2Icon className="hover:text-gray-600 transition duration-200 w-6" />} />}
                                <div className="flex-col">
                                    <h2 className="text-xl font-bold">{person.username}</h2>
                                    <p className="text-sm">{onlineUsers.some(onlineUser => onlineUser.userId == person?._id) ? 'Online' : 'Offline'}</p>
                                </div>
                            </div>
                        </header>
                        {/* Main Chat Area */}
                        <main className="w-full h-[100%] flex-1 p-6 overflow-y-auto space-y-4 bg-gradient-to-l from-black via-gray-700 to-gray-900">
                            {messages.map((message, i) =>
                                <animated.div ref={chatContainerRef} style={props} key={i} className={`w-fit rounded-xl py-3 px-5 break-words text-black ${user?._id == messages[i].senderId ? 'bg-indigo-100 ml-auto ' : ' bg-blue-200  mr-auto'}`}>
                                    {message?.message}
                                </animated.div>
                            )}
                        </main>
                        

                        {/* Message Input Area */}
                        <footer className="bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 py-5 px-7 flex items-center shadow-md">
                            <div className="flex items-center border border-gray-700 rounded-full px-5 py-3 focus-within:border-gray-600 w-11/12 lg:w-full">
                                {/* Attachments */}
                                <label htmlFor="image_upload">
                                    <IoImage className="text-gray-400 text-3xl cursor-pointer hover:text-gray-500 transition duration-200" />
                                </label>
                                <input
                                    className="hidden"
                                    type="file"
                                    onChange={handleImageUpload}
                                    id="image_upload"
                                    name="image_upload"
                                    accept=".jpg , .jpeg, .png , .svg"
                                />
                                    <input
                                        type="text"
                                        value={message}
                                        onChange={(event) => setMessage(event.target.value)}
                                        onKeyDown={(event) => {
                                            if (event.key === "Enter") {
                                                sendMessage(event);
                                                event.preventDefault(); // Prevents the default form submission behavior
                                            }
                                        }}
                                        placeholder="Type your message..."
                                        className="ml-3 focus:outline-none w-full text-gray-300 bg-gray-800"
                                    />
                                    <button onClick={sendMessage} className="ml-5 bg-gray-700 text-white px-5 py-3 rounded-full hover:bg-gray-600 focus:outline-none">
                                        <SendIcon />
                                    </button>
                            </div>
                        </footer>
                    </div>
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-gray-800 to-gray-900">
                        <h2 className="text-3xl text-white">Select a person to chat with</h2>
                    </div>
                )}
                {/* Mobile Toggle Button */}
                {isMobile && (
                    <button className="fixed bottom-5 right-2 bg-slate-500 text-white p-3 rounded-full shadow-lg z-50" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                        {isSidebarOpen ? <IoCloseCircle/> : <IoChatbubbleEllipsesOutline className="text"/>} 
                    </button>
                )}
            </div>
        )
    );
}

export default ChatApp;


// import { SendIcon, User2Icon } from "lucide-react";
// import { useEffect, useRef, useState } from "react";
// import { BsGithub, BsWhatsapp } from "react-icons/bs";
// import { CgProfile } from 'react-icons/cg';
// import { FaHome, FaUserFriends } from 'react-icons/fa';
// import { IoCall, IoImage, IoVideocam } from "react-icons/io5";
// import { MdOutlineReport } from "react-icons/md";
// import { useDispatch, useSelector } from "react-redux";
// import { useMediaQuery } from 'react-responsive';
// import { useLocation, useNavigate } from "react-router-dom";
// import { PulseLoader as Loader } from "react-spinners";
// import { animated } from "react-spring";
// import { useSpring } from "react-spring";
// import { io } from "socket.io-client";

// import { SheetSide } from "@/components/Drawer";
// import { fetchChatId, fetchPerson } from "@/redux/chatSlice";
// import { fetchMessages, sendMessageDispatch } from "@/redux/messageSlice";
// import { FaArrowLeft } from "react-icons/fa";
// import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
// import { IoIosClose } from "react-icons/io";

// function ChatApp() {
//     const isMobile = useMediaQuery({ query: '(max-width: 400px)' });
//     const [isSidebarOpen, setIsSidebarOpen] = useState(!isMobile);
//     const [showChatArea, setShowChatArea] = useState(false); // New state variable
//     const login_user = useSelector((state) => state?.auth?.user?.user);
//     const user = login_user;
//     const location = useLocation();
//     const dispatch = useDispatch();
//     const [loading, setLoading] = useState(false);
//     const chatContainerRef = useRef(null);
//     const props = useSpring({ opacity: 1, from: { opacity: 0 } });
//     const [person, setPerson] = useState(location.state?.person || null);
//     const [personData, setPersonData] = useState([]);
//     const [chatId, setChatId] = useState(null);
//     const [message, setMessage] = useState('');
//     const [messages, setMessages] = useState([]);
//     const [onlineUsers, setOnlineUsers] = useState([]);
//     const [receiveMessage, setReceiveMessage] = useState(null);

//     const navigate = useNavigate();

//     const socket = useRef();

//     useEffect(() => {
//         socket.current = io('http://localhost:8800');
//         socket.current.emit('addUser', user?._id);
//         socket.current.on('getUsers', (users) => {
//             setOnlineUsers(users);
//         });
//         socket.current.on('receiveMessage', (data) => {
//             if (data.chatId === chatId) {
//                 setReceiveMessage(data);
//             }
//             console.log('recive message from socket par', setReceiveMessage);
//         });
//     }, [user, chatId]);

//     useEffect(() => {
//         if (receiveMessage) {
//             setMessages(prev => [...prev, receiveMessage]);
//         }
//     }, [receiveMessage]);

//     useEffect(() => {
//         const loadChatId = async () => {
//             setLoading(true);
//             if (person && user) {
//                 const chatId = (await dispatch(fetchChatId({ receiverId: person._id, senderId: user._id }))).payload._id;
//                 setChatId(chatId);

//                 const oldMessage = (await dispatch(fetchMessages(chatId))).payload;
//                 setMessages(oldMessage);
//             }
//             const result = (await dispatch(fetchPerson(user?._id))).payload;
//             const updatedPersonData = result.map(person => ({
//                 ...person,
//                 isOnline: onlineUsers.some(onlineUsers => onlineUsers.userId === person._id),
//             }));
//             setPersonData(updatedPersonData);
//         };

//         loadChatId();
//         setLoading(false);
//     }, [person, user, dispatch, onlineUsers, chatId, receiveMessage]);

//     const personClickHandler = (index) => {
//         setPerson(personData[index]);
//         setShowChatArea(true); // Show chat area upon clicking a person
//         if (isMobile) {
//             setIsSidebarOpen(false);
//         }
//     };

//     const sendMessage = async (event) => {
//         event.preventDefault();
//         if (message) {
//             const newMessage = {
//                 senderId: user?._id,
//                 chatId: chatId,
//                 text: message
//             };
//             try {
//                 const response = await dispatch(sendMessageDispatch(newMessage));
//                 setMessages(prevMessages => [...prevMessages, response.payload]);
//                 setMessage('');
//                 socket.current.emit('sendMessage', {
//                     ...response.payload,
//                     receiverId: person._id
//                 });
//             } catch (error) {
//                 console.error(error.message);
//             }
//         }
//     };

//     const handleImageUpload = (e) => {
//         e.preventDefault();
//         const uploadImage = e.target.files[0];
//         if (uploadImage) {
//             const reader = new FileReader();
//             reader.readAsDataURL(uploadImage);
//             reader.onloadend = async () => {
//                 const newMessage = {
//                     senderId: user?._id,
//                     chatId: chatId,
//                     text: message,
//                     image: reader.result
//                 };
//                 try {
//                     const response = await dispatch(sendMessageDispatch(newMessage));
//                     setMessages(prevMessages => [...prevMessages, response.payload]);
//                     setMessage('');
//                     socket.current.emit('sendMessage', {
//                         ...response.payload,
//                         receiverId: person._id
//                     });
//                 } catch (error) {
//                     console.error(error.message);
//                 }
//             };
//             reader.onerror = () => {
//                 console.error('A error occurred while reading the file.');
//             };
//         }
//     };

//     const handleIconClick = (icon) => {
//         switch (icon) {
//             case 'Home':
//                 navigate('/');
//                 break;
//             case 'Profile':
//                 navigate('/myProfile');
//                 break;
//             case 'Follow':
//                 navigate(`/followlist/Followers/${user?._id}`);
//                 break;
//             case 'Github':
//                 window.location.href = 'https://github.com/daemonX10/Connectify';
//                 break;
//             case 'Whatsapp':
//                 window.location.href = 'https://wa.me/9082362144?text=I%27m%20here%20from%20Connectify';
//                 break;
//             default:
//                 break;
//         }
//     };

//     return (
//         loading ? (
//             <Loader color="#00BFFF" height={300} width={300} />
//         ) : (
//             <div className={`min-h-screen max-h-screen flex flex-col ${isMobile ? '-mt-5' : 'md:flex-row'} bg-gradient-to-r from-gray-600 to-black`}>
//                 {/* Sidebar */}
//                 {isSidebarOpen && (
//                     <div className={`${isMobile ? 'fixed top-0 left-0 h-full z-50 bg-black bg-opacity-90' : 'hidden md:flex md:w-1/5'} bg-black bg-gradient-to-b from-[#2d3436] to-black shadow-lg`}>
//                         {/* Icons */}
//                         <div className={`${isMobile ? 'hidden': 'block'} m-2 mt-8 flex flex-col items-center space-y-8`}>
//                             <FaHome onClick={() => handleIconClick('Home')} className="w-6 text-gray-400 cursor-pointer" />
//                             <CgProfile onClick={() => handleIconClick('Profile')} className="w-6 text-gray-400 cursor-pointer" />
//                             <FaUserFriends onClick={() => handleIconClick('Follow')} className="w-6 text-gray-400 cursor-pointer" />
//                             <BsGithub onClick={() => handleIconClick('Github')} className="w-6 text-gray-400 cursor-pointer" />
//                             <BsWhatsapp onClick={() => handleIconClick('Whatsapp')} className="w-6 text-gray-400 cursor-pointer" />
//                         </div>
//                         {/* People to Chat */}
//                         <aside className="w-full z-10 bg-gradient-to-b from-slate-700 to-black p-6">
//                             <h2 className="text-xl font-bold mb-4 text-white">Message</h2>
//                             <ul className="space-y-4 h-full overflow-y-auto">
//                                 {personData?.map((member, index) => (
//                                     <li key={index} onClick={() => personClickHandler(index)} className="flex items-center justify-between md:min-w-96 cursor-pointer hover:bg-gray-900 p-3 rounded shadow-lg">
//                                         <span className="flex items-center justify-between">
//                                             {member.ProfileImage ? 
//                                                 <img src={member.ProfileImage} className="mr-2 w-8 h-8 rounded-3xl object-fill" alt="user's ProfileImg" /> : <User2Icon className="mr-2 w-8 text-gray-400" />}
//                                             <span className="text-white flex justify-between items-center">
//                                                 {member.username}
//                                                 {member.isOnline ?
//                                                     <span className="ml-2 bg-green-500 rounded-full w-3 h-3 inline-block"></span> :
//                                                     <span className="ml-2 bg-red-400 rounded-full w-3 h-3 inline-block"></span>
//                                                 }
//                                             </span>
//                                         </span>
//                                     </li>
//                                 ))}
//                             </ul>
//                         </aside>
//                     </div>
//                 )}

//                 {/* Main Chat Area or User List */}
//                 {!showChatArea ? (
//                     <div className={`${isMobile ? '' : 'md:w-4/5'} bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 h-screen flex flex-col justify-between relative mt-4 md:mt-0 shadow-lg`}>
//                         <div className="w-full min-h-[100vh] flex items-center justify-center bg-gradient-to-r from-gray-800 to-gray-900">
//                             <h2 className="text-3xl text-white">Select a person to chat with</h2>
//                         </div>
//                     </div>
//                 ) : (
//                     <div className={`${isMobile ? '' : 'md:w-4/5'} bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 h-screen flex flex-col justify-between relative mt-4 md:mt-0 shadow-lg`}>
//                         {/* Header */}
//                         {/* Button to go back to user list */}
//                         <button onClick={() => setShowChatArea(false)} className={` ${isMobile ? 'block' : 'hidden'} ml-4 absolute my-10 bg-gray-700 text-white p-3 rounded-full hover:bg-gray-600 focus:outline-none`}>
//                                 <FaArrowLeft className="hover:text-gray-500 transition duration-200" />
//                             </button>
//                         <header onClick={() => { window.location.href = `user/${person?._id}` }} className="cursor-pointer md:w-[15rem] absolute top-0 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 text-white py-4 px-6 items-center shadow-md flex justify-between rounded-full my-5">
//                             <div className="flex items-center justify-start">
//                                 {person?.ProfileImage ? 
//                                     <SheetSide icon={<img src={person?.ProfileImage} className=" w-6 h-8 rounded-3xl object-fill " alt="user's ProfileImg" />} /> : <SheetSide icon={<User2Icon className="hover:text-gray-600 transition duration-200 w-6" />} />}
//                                 <div className="flex-col">
//                                     <h2 className="text-xl font-bold">{person.username}</h2>
//                                     <p className="text-sm">{onlineUsers.some(onlineUser => onlineUser.userId == person?._id) ? 'Online' : 'Offline'}</p>
//                                 </div>
//                             </div>
//                         </header>
//                         {/* Main Chat Area */}
//                         <main ref={chatContainerRef} className={`${isMobile ? ' pt-24 ' : ''} w-full min-h-[84vh] flex-1 p-6 overflow-y-auto space-y-4 bg-gradient-to-l from-black via-gray-700 to-gray-900`}>
//                             {messages.map((message, i) =>
//                                 <animated.div style={props} key={i} className={`w-fit rounded-xl py-3 px-5 break-words text-black ${user?._id == messages[i].senderId ? 'bg-indigo-100 ml-auto ' : ' bg-blue-200  mr-auto'}`}>
//                                     {message?.message}
//                                 </animated.div>
//                             )}
//                         </main>
//                         {/* Message Input Area */}
//                         <footer className="bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 py-5 px-7 flex items-center shadow-md">
//                             <div className="flex items-center border border-gray-700 rounded-full px-5 py-3 focus-within:border-gray-600 w-full">
//                                 {/* Attachments */}
//                                 <label htmlFor="image_upload">
//                                     <IoImage className="text-gray-400 text-3xl cursor-pointer hover:text-gray-500 transition duration-200" />
//                                 </label>
//                                 <input
//                                     className="hidden"
//                                     type="file"
//                                     onChange={handleImageUpload}
//                                     id="image_upload"
//                                     name="image_upload"
//                                     accept=".jpg , .jpeg, .png , .svg"
//                                 />
//                                 <input type="text" value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Type your message..." className="ml-3 focus:outline-none w-full text-gray-300 bg-gray-800" />
//                                 <button onClick={sendMessage} className="ml-5 bg-gray-700 text-white px-5 py-3 rounded-full hover:bg-gray-600 focus:outline-none">
//                                     <SendIcon />
//                                 </button>
//                             </div>
//                         </footer>
//                     </div>
//                 )}
//                 {/* Mobile Toggle Button */}
//                 {isMobile && !showChatArea && (
//                     <button className="fixed bottom-4 right-4 bg-gray-700 text-white p-3 rounded-full shadow-lg z-50" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
//                         {isSidebarOpen ? <IoIosClose /> : <IoChatbubbleEllipsesOutline />} 
//                     </button>
//                 )}
//             </div>
//         )
//     );
// }

// export default ChatApp;
