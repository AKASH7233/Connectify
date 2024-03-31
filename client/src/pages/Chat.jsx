import { Camera, GroupIcon, PodcastIcon, SendIcon, SettingsIcon, User2Icon } from "lucide-react";
import { IconBase } from "react-icons";
import { FaIcons, FaPhotoVideo } from "react-icons/fa";
import { IoAttach, IoCall, IoVideocam } from "react-icons/io5";
import { MdOutlineReport } from "react-icons/md";

import  { SheetSide } from "@/components/Drawer";



function ChatApp() {

    function handleImageVideoUpload(event) {
        const file = event.target.files[0];
        if (file && file.type.match('image.*|video.*')) {
            // Upload the image/video file
            // This is just a placeholder, replace it with your actual upload code
            console.log(`Uploading image/video: ${file.name}`);
        } else {
            console.log('Please select an image or video file.');
        }
    }

    function handleDocumentUpload(event) {
        const file = event.target.files[0];
        if (file && file.type.match('application.*')) {
            // Upload the document file
            // This is just a placeholder, replace it with your actual upload code
            console.log(`Uploading document: ${file.name}`);
        } else {
            console.log('Please select a document file.');
        }
    }

    return (
        <div className="bg-gray-100 h-screen flex">
        <div className="flex w-1/3">
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
        <div className="w-full bg-gray-100 h-screen flex flex-col justify-between relative">
            {/* Header */}
            <header className="w-[20rem] absolute top-0 left-1/2 transform -translate-x-1/2 bg-blue-700 text-white py-3 px-5 items-center shadow-md flex justify-between rounded-full my-5">
                <div className="flex items-center justify-start">
                    <SheetSide icon={<User2Icon className="hover:text-blue-500 transition duration-200" />}/>
                    <div className="flex-col">
                        <h2 className="text-lg font-bold">John Doe</h2>
                        <p className="text-sm">Active now</p>
                    </div>
                </div>
                <div className="flex space-x-5">
                    <IoCall className="text-2xl hover:text-blue-500 transition duration-200"/>
                    <IoVideocam className="text-2xl hover:text-blue-500 transition duration-200"/>
                    <MdOutlineReport className="text-2xl hover:text-blue-500 transition duration-200"/>
                </div>
            </header>

                {/* Main Chat Area */}
                <main className="flex-1 p-6 overflow-y-auto">
                    {/* Messages */}
                    <div className="flex flex-col space-y-4">
                        {/* Sender Message */}
                        <div className="flex justify-end">
                            <div
                                className="bg-blue-600  text-white max-w-xs rounded-xl py-2 px-4 self-end break-words">
                                {'message from you'}
                            </div>
                        </div>

                        {/* Receiver Message */}
                        <div className="flex justify-start">
                            <div
                                className="bg-gray-300 text-gray-800 max-w-xs rounded-xl py-2 px-4 self-start break-words">
                                {'message from other person'}
                            </div>
                        </div>
                    </div>
                </main>

                {/* Message Input Area */}
                <footer className="bg-white py-4 px-6 flex items-center shadow-md">
                    <div className="flex items-center border border-gray-300 rounded-full px-4 py-2 focus-within:border-blue-500 w-full ">
                        <button className="text-gray-500 focus:outline-none p-2">
                            <input className="hidden" onClick={()=>handleImageVideoUpload()} />
                            <FaPhotoVideo className="size-5 " />
                        </button>
                        <button
                            className="text-gray-500 focus:outline-none p-2">
                            <IoAttach  className="size-5"/>
                        </button>
                        <input type="text" placeholder="Type your message..." className="ml-2 focus:outline-none w-full" />
                        <button className="ml-4 bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 focus:outline-none">
                            <SendIcon />
                        </button>
                    </div>
                </footer>
        </div>
        </div>
    );
}

export default ChatApp;