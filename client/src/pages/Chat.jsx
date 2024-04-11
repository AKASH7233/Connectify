import { Camera, GroupIcon, PodcastIcon, SendIcon, SettingsIcon, User2Icon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { IoCall, IoImage, IoVideocam } from "react-icons/io5";
import { MdOutlineReport } from "react-icons/md";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import io from "socket.io-client";

import { SheetSide } from "@/components/Drawer";
import { fetchChatId, fetchPerson } from "@/redux/chatSlice";
import { fetchMessages, sendMessageDispatch } from "@/redux/messageSlice";

function ChatApp(){
    
    const data = JSON.parse(localStorage.getItem("data"));
    const user = data?.data?.user || null;
    const location = useLocation();
    const dispatch = useDispatch();

    const [person, setPerson] = useState(location.state?.person || null);
    const [personData, setPersonData] = useState([]);
    const [chatId, setChatId] = useState(null);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        const loadChatId = async () => {
            if (person && user) {
                const chatId = (await dispatch(fetchChatId({ receiverId: person._id, senderId: user._id }))).payload._id;
                setChatId(chatId);

                const oldMessage = (await dispatch(fetchMessages(chatId))).payload;
                setMessages(oldMessage);
            }
            const result = (await dispatch(fetchPerson(user._id))).payload;
            setPersonData(result);
        };

        loadChatId();
    }, [person, dispatch]);

    const chatContainerRef = useRef(null);
    
    const personClickHandler = (index) => {
        setPerson(personData[index]);
    }

    const sendMessage = async (event) => {
        event.preventDefault();
        if (message) {
            const newMessage = {
                senderId : user?._id ,
                chatId : chatId,
                text : message
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

    const handleImageUpload =  (e) => {
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
                    console.log('message',messages);
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
                        {personData.map((member, index) => (
                            <li key={index} onClick={() => personClickHandler(index)} className="flex items-center justify-between cursor-pointer hover:bg-gray-300 p-2 rounded">
                                <span className="flex items-center">
                                    <User2Icon className="mr-2" />
                                    <span>{member.fullName}</span>
                                </span>
                            </li>
                        ))}
                    </ul>
                </aside>
            </div>

            {/* Main Chat Area */}
            {person ? (
                <div className="w-full bg-gray-100 h-screen flex flex-col justify-between relative">

                    {/* Header */}
                    <header className="w-[20rem] absolute top-0 left-1/2 transform -translate-x-1/2 bg-blue-700 text-white py-3 px-5 items-center shadow-md flex justify-between rounded-full my-5">
                        <div className="flex items-center justify-start">
                            <SheetSide icon={<User2Icon className="hover:text-blue-500 transition duration-200" />} />
                            <div className="flex-col">
                                <h2 className="text-lg font-bold">{person.fullName}</h2>
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
                            <div key={i} className={`w-fit rounded-xl py-2 px-4 break-words ${user?._id == messages[i].senderId ? 'bg-blue-600 text-white ml-auto' : 'bg-gray-300 text-gray-800 mr-auto'}`}>
                                {message?.message}
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
            ) : (
                <div className="w-full h-full flex items-center justify-center">
                    <h2 className="text-2xl">Select a person to chat with</h2>
                </div>
            )}

        </div>
    );
}
export default ChatApp;