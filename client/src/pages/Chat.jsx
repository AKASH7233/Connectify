import { Camera, GroupIcon, PodcastIcon, SendIcon, SettingsIcon, User2Icon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { IoCall, IoImage, IoVideocam } from "react-icons/io5";
import { MdOutlineReport } from "react-icons/md";
import io from "socket.io-client";

import { SheetSide } from "@/components/Drawer";

function ChatApp(){
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState(['damodar']);
    const [onlineUsers, setOnlineUsers] = useState([]); // [ { userId, socketId }
    const user = JSON.parse(localStorage.getItem('user'));

    const chatContainerRef = useRef(null);

    const socket = useRef(null);

    useEffect(() => {
        socket.current = io('http://localhost:8800');
        socket.current.emit('addUser', user?._id || '123');
        socket.current.on('getUsers', (users) => {
            console.log(users);
            setOnlineUsers(users);
        });
    },[user])

    useEffect(() => {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }, [messages]);

    const sendMessage = (event) => {
        event.preventDefault();
        if (message) {
            setMessages([...messages, message]);
            setMessage('');
        }
    }
    
    const handleImageUpload = (e) => {
        e.preventDefault();
        const uploadImage = e.target.files[0];
        if (uploadImage) {
            const reader = new FileReader();
            reader.readAsDataURL(uploadImage);
            reader.onloadend = () => {
                setMessages([...messages,{ type: 'image', content: reader.result }]);
            }
        }
    }



    return (
        <div className=" bg-gray-100 h-screen flex">

            {/* Sidebar */}
            <div className="flex w-1/3">

                {/* Icons */}
                <div className="w-1/4 flex flex-col items-center py-4 space-y-5">
                    <User2Icon className="size-6 text-blue-500" />
                    <GroupIcon className="size-6 text-blue-500" />
                    <SettingsIcon className="size-6 text-blue-500" />
                    <Camera className="size-6 text-blue-500" />
                    <PodcastIcon className="size-6 text-blue-500" />
                </div>

                {/* People to Chat */}
                <aside className="w-full bg-gray-200 p-6">
                    <h2 className="text-lg font-bold mb-4">Message</h2>
                    <ul className="space-y-4 overflow-y-auto h-64">
                        <li className="flex items-center justify-between">
                            <span className="flex items-center">
                                <User2Icon className="mr-2" />
                                <span>John Doe</span>
                            </span>
                        </li>
                        {/* Add more people as needed */}
                    </ul>
                </aside>
            </div>

            {/* Main Chat Area */}
            <div className="w-full bg-gray-100 h-screen flex flex-col justify-between relative">

                {/* Header */}
                <header className="w-[20rem] absolute top-0 left-1/2 transform -translate-x-1/2 bg-blue-700 text-white py-3 px-5 items-center shadow-md flex justify-between rounded-full my-5">
                    <div className="flex items-center justify-start">
                        <SheetSide icon={<User2Icon className="hover:text-blue-500 transition duration-200" />} />
                        <div className="flex-col">
                            <h2 className="text-lg font-bold">John Doe</h2>
                            <p className="text-sm">Active now</p>
                        </div>
                    </div>
                    <div className="flex space-x-5">
                        <IoCall className="text-2xl hover:text-blue-500 transition duration-200" />
                        <IoVideocam className="text-2xl hover:text-blue-500 transition duration-200" />
                        <MdOutlineReport className="text-2xl hover:text-blue-500 transition duration-200" />
                    </div>
                </header>

                {/* Main Chat Area */}
                <main ref={chatContainerRef} className="w-full flex-1 p-6 overflow-y-auto space-y-4">
                    {messages.map((message, i) =>
                        <div key={i} className={`w-fit rounded-xl py-2 px-4 break-words ${i % 2 === 0 ? 'bg-blue-600 text-white ml-auto' : 'bg-gray-300 text-gray-800 mr-auto'}`}>
                            {message.type === 'image' ? <img src={message.content} alt="Uploaded content"/> : message}
                        </div>
                    )}
                </main>
                
                {/* Message Input Area */}
                <footer className="bg-white py-4 px-6 flex items-center shadow-md">
                    <div className="flex items-center border border-gray-300 rounded-full px-4 py-2 focus-within:border-blue-500 w-full ">

                        {/* Attachments */}
                        <label htmlFor="image_upload">
                            <IoImage className="text-blue-500 text-2xl cursor-pointer hover:text-blue-600 transition duration-200" />
                        </label>
                        <input 
                            className="hidden"
                            type="file"
                            onChange={handleImageUpload}
                            id="image_upload"
                            name="image_upload"
                            accept=".jpg , .jpeg, .png , .svg" 
                        />

                        <input type="text" value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Type your message..." className="ml-2 focus:outline-none w-full" />
                        <button onClick={sendMessage} className="ml-4 bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 focus:outline-none">
                            <SendIcon />
                        </button>
                    </div>
                </footer>
            </div>
        </div>
    );
}

export default ChatApp;