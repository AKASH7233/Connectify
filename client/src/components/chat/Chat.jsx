import { SendIcon, User2Icon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { BsGithub, BsWhatsapp } from "react-icons/bs";
import { CgProfile } from "react-icons/cg";
import { FaHome } from "react-icons/fa";
import { FaUserFriends } from "react-icons/fa";
import { FaArrowLeftLong } from "react-icons/fa6";
import { IoIosClose } from "react-icons/io";
import { IoImage } from "react-icons/io5";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { useMediaQuery } from 'react-responsive';
import { useLocation, useNavigate } from "react-router-dom";
import { PulseLoader as Loader } from "react-spinners";
import { animated } from "react-spring";
import { useSpring } from "react-spring";
import { io } from "socket.io-client";

import { fetchChatId, fetchPerson } from "@/redux/chatSlice";
import { fetchMessages, sendMessageDispatch } from "@/redux/messageSlice";
import Navbar from "../navForMobile/Navbar";
import Footer from "../navForMobile/Footer";

function ChatApp() {
    const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [showChatArea, setShowChatArea] = useState(false); // New state variable
    const login_user = useSelector((state) => state?.auth?.user?.user);
    const user = login_user;
    const location = useLocation();
    const dispatch = useDispatch();
    const props = useSpring({ opacity: 1, from: { opacity: 0 } });
    const [person, setPerson] = useState(location.state?.person || null);
    const [personData, setPersonData] = useState([]);
    const [chatId, setChatId] = useState(null);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const chatReference = useRef();
    const socket = useRef();

    const navigate = useNavigate();

    function openFullScreen() {
        let elem = document.documentElement;

        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.mozRequestFullScreen) { // Firefox
            elem.mozRequestFullScreen();
        } else if (elem.webkitRequestFullscreen) { // Chrome, Safari and Opera
            elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) { // IE/Edge
            elem.msRequestFullscreen();
        }
    }

    function closeFullScreen() {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) { // Firefox
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) { // Chrome, Safari and Opera
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) { // IE/Edge
            document.msExitFullscreen();
        }
    }

    useEffect(()=>{
       isMobile ? openFullScreen() : closeFullScreen();
    },[isMobile])
    useEffect(() => {
        const loadChatId = async () => {
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
    }, [person]);

    useEffect(() => {
        socket.current = io('https://connectify-socket-wixg.onrender.com');
        socket.current.emit('addUser', user?._id);
        socket.current.on('getUsers', (users) => {
            setOnlineUsers(users);
        });
    }, [user, chatId, person]);

    const personClickHandler = (index) => {
        setPerson(personData[index]);
        setShowChatArea(true); // Show chat area upon clicking a person
        if (isMobile) {
            setIsSidebarOpen(false);
        }
    };

    useEffect(() => {
        const scrollToBottom = () => {
            if (chatReference.current) {
                chatReference.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
            }
        };
        scrollToBottom();
    }, [person, messages])

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
                // Updating the last person message on top 
                const personIndex = personData.findIndex(p => p._id === person._id);
                if (personIndex > -1) {
                    const updatedPersonData = [personData[personIndex], ...personData.slice(0, personIndex), ...personData.slice(personIndex + 1)];
                    setPersonData(updatedPersonData);
                }
            } catch (error) {
                console.error(error.message);
            }
        }
        scrollTo({ top: 2000, behavior: "smooth" });
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
                window.location.href = 'https://wa.me/9082362144?text=I%27m%20here%20from%20Connectify'; // Add your number here
                break;
            default:
                break;
        }
    };

    useEffect(() => {
        socket.current.on('receiveMessage', (data) => {
            console.log('data', data)
            setMessages(prevMessages => [...prevMessages, data]);
        });
    }, [message]);

    return (
        <div className="h-[90vh]">
            <div className={` h-[100vh] overflow-y-hidden flex flex-col ${isMobile ? '' : 'md:flex-row'}  bg-gradient-to-l from-black via-gray-700 to-gray-900 `}>
                {/* Sidebar */}
                <div className={`${isMobile ? 'fixed top-0 left-0 h-full z-50 bg-black bg-opacity-90' : 'hidden md:flex md:w-1/5'} bg-black bg-gradient-to-b from-[#2d3436] to-black shadow-lg ${isSidebarOpen ? 'block' : 'hidden'}`}>
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

                {/* Main Chat Area or User List */}
                {!showChatArea ? (
                    <div className={`w-full h-[100vh]  flex items-center justify-center bg-gradient-to-r from-gray-800 to-gray-900 ${isMobile ? '-my-10' : ''}`}>
                       {isMobile && <Navbar />}
                       <div>
                            <h2 className="text-3xl text-white">Select a person to chat </h2>
                            {isMobile && !showChatArea && (
                                <button className="fixed bottom-20 right-10 bg-gray-700 text-white p-2 text-2xl rounded-full shadow-lg z-50" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                                    {isSidebarOpen ? <IoIosClose /> : <IoChatbubbleEllipsesOutline />}
                                </button>
                            )}
                        </div>
                        {isMobile && <Footer />}
                    </div>
                ) : (
                    <div className={`w-full h-[100vh] ${isMobile ? '' : 'md:w-4/5'} bg-gradient-to-l from-black via-gray-700 to-gray-900 h-screen flex flex-col justify-between relative mt-4 md:mt-0 shadow-lg`}>
                        {/* Main Chat Area */}
                        {/* Button to go back to user list */}
                        <button onClick={() => setShowChatArea(false)} className={`${isMobile ? 'block' : 'hidden'} ml-4 my-4 absolute bg-gray-700 text-white p-3 rounded-full hover:bg-gray-600 focus:outline-none`}>
                            <FaArrowLeftLong />
                        </button>
                        <header onClick={() => { window.location.href = `user/${person?._id}` }} className="cursor-pointer md:w-[15rem] absolute top-0 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 text-white py-4 px-6 items-center shadow-md flex justify-between rounded-full my-2">
                            <div className="flex items-center gap-x-5">
                                {person?.ProfileImage ?
                                    <img src={person?.ProfileImage} className=" w-8 h-8 rounded-3xl object-fill " alt="user's ProfileImg" /> : <User2Icon className="hover:text-gray-600 transition duration-200 w-6" />}
                                <div className="flex-col">
                                    <h2 className="text-xl font-bold">{person.username}</h2>
                                    <p className="text-sm text-gray-400">{onlineUsers.some(onlineUser => onlineUser.userId == person?._id) ? 'Online' : 'Offline'}</p>
                                </div>
                            </div>
                        </header>
                        <main className={`${isMobile ? 'pt-24' : ''} w-full  flex-1 p-6 overflow-y-auto space-y-4 bg-gradient-to-l from-black via-gray-700 to-gray-900`}>
                            {messages.map((message, i) =>
                                <animated.div ref={chatReference} style={props} key={i} className={`w-fit  rounded-xl py-3 px-5 break-words text-black ${user?._id == messages[i].senderId ? 'bg-indigo-100 ml-auto ' : ' bg-blue-200  mr-auto'}`}>
                                    {message?.message}
                                </animated.div>
                            )}
                        </main>

                        {/* Message Input Area */}
                        <footer className="bg-gradient-to-r  from-gray-900 via-gray-700 to-gray-900 py-5 px-7 flex items-center shadow-md">
                            <div className="flex items-center border border-gray-700 rounded-full px-5 py-3 focus-within:border-gray-600 w-11/12 lg:w-full">
                                {/* Attachments */}
                                <label htmlFor="image_upload">
                                    <IoImage className="text-gray-400 text-3xl cursor-pointer hover:text-gray-500 transition duration-200" />
                                </label>
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
                )}
                {/* Mobile Toggle Button */}
            </div>
        </div>
    );
}

export default ChatApp;
