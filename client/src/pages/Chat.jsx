
import { SendIcon, User2Icon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { IoImage} from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { useMediaQuery } from 'react-responsive';
import { useLocation, useNavigate } from "react-router-dom";
import { PulseLoader as Loader } from "react-spinners";
import { animated } from "react-spring";
import { useSpring } from "react-spring";
import { io } from "socket.io-client";

import { fetchChatId, fetchPerson } from "@/redux/chatSlice";
import { fetchMessages, sendMessageDispatch } from "@/redux/messageSlice";

function ChatApp() {
    const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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
    const socket = useRef();


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
    

    useEffect(() => {
        socket.current = io('http://localhost:8800');
        socket.current.emit('addUser', user?._id);
        socket.current.on('getUsers', (users) => {
            setOnlineUsers(users);
        });
    }, [user, chatId]);

    useEffect(() => {
        // socket.current.emit('sendMessage',(data)=>{
        //     setMessages(prevMessages => [...prevMessages, data]);
        // })
        socket.current.on('receiveMessage', (data) => {
            setMessages(prevMessages => [...prevMessages, data]);
        });
    },[message]);

    return (
            <div className={`h-screen flex flex-col ${isMobile ? '' : 'md:flex-row'} bg-gradient-to-r from-gray-600 to-black`}>
                {/* Sidebar */}
                <div className={`${isMobile ? 'fixed top-0 left-0 h-full z-50 bg-black bg-opacity-90' : 'hidden md:flex md:w-1/5'} bg-black bg-gradient-to-b from-[#2d3436] to-black shadow-lg ${isSidebarOpen ? 'block' : 'hidden'}`}>
                    {/* Icons */}
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

                        {/* Main Chat Area */}
                        <main className="w-full h-[100%] flex-1 p-6 overflow-y-auto space-y-4 bg-gradient-to-l from-black via-gray-700 to-gray-900">
                            {messages.map((message, i) =>
                                <animated.div style={props} key={i} className={`w-fit rounded-xl py-3 px-5 break-words text-black ${user?._id == messages[i].senderId ? 'bg-indigo-100 ml-auto ' : ' bg-blue-200  mr-auto'}`}>
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
            </div>
        )
}

export default ChatApp;
