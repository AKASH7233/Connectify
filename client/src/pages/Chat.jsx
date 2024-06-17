import { Camera, GroupIcon, PodcastIcon, SendIcon, SettingsIcon, User2Icon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { IoCall, IoImage, IoVideocam } from "react-icons/io5";
import { MdOutlineReport } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useMediaQuery } from 'react-responsive';
import { useLocation } from "react-router-dom";
import { PulseLoader as Loader } from "react-spinners";
import { animated } from "react-spring";
import { useSpring } from "react-spring";
import { io } from "socket.io-client";

import { SheetSide } from "@/components/Drawer";
import { fetchChatId, fetchPerson } from "@/redux/chatSlice";
import { fetchMessages, sendMessageDispatch } from "@/redux/messageSlice";

function ChatApp() {
    const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
    const login_user = useSelector((state) => state?.auth?.user?.user);
    const data = JSON.parse(localStorage.getItem('data'))?.data[0];
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

    const socket = useRef();

    useEffect(() => {
        socket.current = io('http://localhost:8800');
        socket.current.emit('addUser', user?._id);
        socket.current.on('getUsers', (users) => {
            setOnlineUsers(users);
        });
        socket.current.on('receiveMessage', (data) => {
            // Check if the received message is for the currently open chat
            if (data.chatId === chatId) {
                setReceiveMessage(data);
            }
        });
    }, [user, chatId]);

    useEffect(() => {
        if (receiveMessage) {
            setMessages(prev => [...prev, receiveMessage]);
        }
    }, [receiveMessage]);

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
                isOnline: onlineUsers.includes(person._id)
            }));
            setPersonData(updatedPersonData);
        };

        loadChatId();
        setLoading(false);
    }, [person, user, dispatch, onlineUsers]);

    const personClickHandler = (index) => {
        setPerson(personData[index]);
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
return (
    loading ?
        <Loader color="#00BFFF" height={300} width={300} /> :
        <div className={`h-screen flex flex-col md:flex-row bg-gradient-to-r from-gray-600 to-black`}>

            {/* Sidebar */}
            <div className={`hidden md:flex md:w-1/5 bg-black bg-gradient-to-b from-[#2d3436] to-black shadow-lg`}>

                {/* Icons */}
                <div className="hidden md:flex md:flex-col items-center md:py-4 md:space-y-5 space-x-5 md:space-x-0 md:w-1/4">
                    <User2Icon className="w-6 text-gray-400" />
                    <GroupIcon className="w-6 text-gray-400" />
                    <SettingsIcon className="w-6 text-gray-400" />
                    <Camera className="w-6 text-gray-400" />
                    <PodcastIcon className="w-6 text-gray-400" />
                </div>

                {/* People to Chat */}
                <aside className="w-full bg-gradient-to-b from-slate-700 to-black p-6">
                    {/* People to Chat code here... */}
                    <h2 className="text-xl font-bold mb-4 text-white">Message</h2>
                    <ul className="space-y-4 overflow-y-auto ">
                        {personData?.map((member, index) => (
                            <li key={index} onClick={() => personClickHandler(index)} className="flex items-center justify-between cursor-pointer hover:bg-gray-900 p-3 rounded shadow-lg">
                                <span className="flex items-center">
                                    {member.ProfileImage ? <img src={member.ProfileImage} className="mr-2 w-8 h-8 rounded-3xl object-fill" alt="user's ProfileImg" /> : <User2Icon className="mr-2 w-8 text-gray-400" />}
                                    <span className="text-white">{member.username}</span>
                                    {member.isOnline ?
                                        <span className="ml-2 bg-green-500 rounded-full w-3 h-3 inline-block"></span> :
                                        <span className="ml-2 bg-red-500 rounded-full w-3 h-3 inline-block"></span>
                                    }
                                </span>
                            </li>
                        ))}
                    </ul>
                </aside>
            </div>

            {/* Main Chat Area */}
            {person ? (
                <div className={`w-full md:w-4/5 bg-gradient-to-r from-gray-800 to-gray-900 h-screen flex flex-col justify-between relative mt-4 md:mt-0 shadow-lg`}>
                    {/* Header */}
                    <header className="w-full md:w-[22rem] absolute top-0 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 text-white py-4 px-6 items-center shadow-md flex justify-between rounded-full my-5">
                        <div className="flex items-center justify-start">
                            {person?.ProfileImage ? <SheetSide icon={<img src={person?.ProfileImage} className="mr-2 w-8 h-8 rounded-3xl object-fill-" alt="user's ProfileImg" />} /> : <SheetSide icon={<User2Icon className="hover:text-gray-600 transition duration-200 w-8" />} />}
                            <div className="flex-col">
                                <h2 className="text-xl font-bold">{person.fullName}</h2>
                                <p className="text-sm">{onlineUsers.includes(person.id) ? 'Active now' : 'Offline'}</p>
                            </div>
                        </div>
                        <div className="flex space-x-5">
                            <IoCall className="text-3xl hover:text-gray-600 transition duration-200" />
                            <IoVideocam className="text-3xl hover:text-gray-600 transition duration-200" />
                            <MdOutlineReport className="text-3xl hover:text-gray-600 transition duration-200" />
                        </div>
                    </header>

                    {/* Main Chat Area */}
                    <main ref={chatContainerRef} className="w-full flex-1 p-6 overflow-y-auto space-y-4 bg-gradient-to-l from-black via-gray-700 to-gray-900">
                        {messages.map((message, i) =>
                            <animated.div style={props} key={i} className={`w-fit rounded-xl py-3 px-5 break-words text-black ${user?._id == messages[i].senderId ? 'bg-indigo-100 ml-auto '  : ' bg-blue-200  mr-auto'}`}>
                                {message?.message}
                            </animated.div>
                        )}
                    </main>

                    {/* Message Input Area */}
                    <footer className="bg-gradient-to-l from-gray-900 via-gray-800 to-gray-700 py-5 px-7 flex items-center shadow-md">
                        <div className="flex items-center border border-gray-700 rounded-full px-5 py-3 focus-within:border-gray-600 w-full ">

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

                            <input type="text" value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Type your message..." className="ml-3 focus:outline-none w-full text-gray-300 bg-gray-800" />
                            <button onClick={sendMessage} className="ml-5 bg-gray-700 text-white px-5 py-3 rounded-full hover:bg-gray-600 focus:outline-none">
                                <SendIcon />
                            </button>
                        </div>
                    </footer>
                </div>
            ) : (
                <div className="w-full h-full flex items-center justify-center">
                    <h2 className="text-3xl text-white">Select a person to chat with</h2>
                </div>
            )}

        </div>
);
}
export default ChatApp;

// completly change the color/theme of ui from light and blue to dark and gray