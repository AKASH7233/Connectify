import { Camera, GroupIcon, PodcastIcon, SendIcon, SettingsIcon, User2Icon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { IoCall, IoImage, IoVideocam } from "react-icons/io5";
import { MdOutlineReport } from "react-icons/md";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
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
    const login_user = useSelector((state) => state?.auth?.user?.user) 
    console.log('login_user',login_user);
    const data = JSON.parse(localStorage.getItem('data'))?.data[0]
    const user = login_user;
    console.log(user);
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

    // socket connection
    const socket = useRef();
    // console.log('person', person);

    useEffect(() => {
        socket.current = io('http://localhost:8800');
        socket.current.emit('addUser', user?._id);
        socket.current.on('getUsers', (users) => {
            setOnlineUsers(users);
        })
        console.log('onlineUsers', onlineUsers);
    }, [])


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
            console.log('result', result);
            setPersonData(result);
        };

        loadChatId();
        setLoading(false);
    }, [person, dispatch]);


    const personClickHandler = (index) => {
        setPerson(personData[index]);
    }

    const sendMessage = async (event) => {
        event.preventDefault();
        if (message) {
            const newMessage = {
                senderId: user?._id,
                chatId: chatId,
                text: message
            }
            try {
                const response = await dispatch(sendMessageDispatch(newMessage));
                setMessages(prevMessages => [...prevMessages, response.payload]);
                setMessage('');
            } catch (error) {
                return (error.message)
            }
        }
    }

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
                    image: reader.result // Include the image data in the message
                }
                try {
                    const response = await dispatch(sendMessageDispatch(newMessage));
                    setMessages(prevMessages => [...prevMessages, response.payload]);
                    setMessage('');
                } catch (error) {
                    console.error(error.message);
                }
            }
            reader.onerror = () => {
                console.error('A error occurred while reading the file.');
            }
        }
    }

    return (
        loading ?
            <Loader color="#00BFFF" height={300} width={300} /> :
            <div className={`bg-dark-200 h-screen flex ${isMobile ? 'flex-col' : 'flex-row'}`}>

                {/* Sidebar */}
                <div className={`flex ${isMobile ? 'w-full' : 'w-1/4'} bg-gray-200`}>

                    {/* Icons */}
                    <div className="w-1/4 flex flex-col items-center py-4 space-y-5">
                        <User2Icon className="w-8 text-blue-700" />
                        <GroupIcon className="w-8 text-blue-700" />
                        <SettingsIcon className="w-8 text-blue-700" />
                        <Camera className="w-8 text-blue-700" />
                        <PodcastIcon className="w-8 text-blue-700" />
                    </div>

                    {/* People to Chat */}
                    <aside className="w-full bg-gray-300 p-6">
                        <h2 className="text-xl font-bold mb-4">Message</h2>
                        <ul className="space-y-4 overflow-y-auto ">
                            {personData?.map((member, index) => (
                                <li key={index} onClick={() => personClickHandler(index)} className="flex items-center justify-between cursor-pointer hover:bg-gray-400 p-3 rounded">
                                    <span className="flex items-center">
                                        {member.ProfileImage ? <img src={member.ProfileImage} className="mr-2 w-8 h-8 rounded-3xl object-fill" alt="user's ProfileImg" /> : <User2Icon className="mr-2 w-8 text-blue-700" />}
                                        <span>{member.username}</span>
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </aside>
                </div>

                {/* Main Chat Area */}
                {person ? (
                    <div className={`w-full bg-gray-200 h-screen flex flex-col justify-between relative ${isMobile ? 'mt-4' : ''}`}>

                        {/* Header */}
                        <header className="w-[22rem] absolute top-0 left-1/2 transform -translate-x-1/2 bg-blue-800 text-white py-4 px-6 items-center shadow-md flex justify-between rounded-full my-5">
                            <div className="flex items-center justify-start">
                                {person?.ProfileImage ? <SheetSide icon={<img src={person?.ProfileImage} className="mr-2 w-8 h-8 rounded-3xl object-fill-" alt="user's ProfileImg"/>} /> : <SheetSide icon={<User2Icon className="hover:text-blue-600 transition duration-200 w-8" />} /> }
                                
                                <div className="flex-col">
                                    <h2 className="text-xl font-bold">{person.fullName}</h2>
                                    <p className="text-sm">Active now</p>
                                </div>
                            </div>
                            <div className="flex space-x-5">
                                <IoCall className="text-3xl hover:text-blue-600 transition duration-200" />
                                <IoVideocam className="text-3xl hover:text-blue-600 transition duration-200" />
                                <MdOutlineReport className="text-3xl hover:text-blue-600 transition duration-200" />
                            </div>
                        </header>

                        {/* Main Chat Area */}
                        <main ref={chatContainerRef} className="w-full flex-1 p-6 overflow-y-auto space-y-4">
                            {messages.map((message, i) =>
                                <animated.div style={props} key={i} className={`w-fit rounded-xl py-3 px-5 break-words ${user?._id == messages[i].senderId ? 'bg-blue-800 text-white ml-auto' : 'bg-gray-400 text-gray-800 mr-auto'}`}>
                                    {message?.message}
                                </animated.div>
                            )}
                        </main>

                        {/* Message Input Area */}
                        <footer className="bg-white py-5 px-7 flex items-center shadow-md">
                            <div className="flex items-center border border-gray-400 rounded-full px-5 py-3 focus-within:border-blue-600 w-full ">

                                {/* Attachments */}
                                <label htmlFor="image_upload">
                                    <IoImage className="text-blue-700 text-3xl cursor-pointer hover:text-blue-800 transition duration-200" />
                                </label>
                                <input
                                    className="hidden"
                                    type="file"
                                    onChange={handleImageUpload}
                                    id="image_upload"
                                    name="image_upload"
                                    accept=".jpg , .jpeg, .png , .svg"
                                />

                                <input type="text" value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Type your message..." className="ml-3 focus:outline-none w-full" />
                                <button onClick={sendMessage} className="ml-5 bg-blue-800 text-white px-5 py-3 rounded-full hover:bg-blue-900 focus:outline-none">
                                    <SendIcon />
                                </button>
                            </div>
                        </footer>
                    </div>
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <h2 className="text-3xl">Select a person to chat with</h2>
                    </div>
                )}

            </div>
    );
}
export default ChatApp;