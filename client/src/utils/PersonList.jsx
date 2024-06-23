import { User2Icon } from 'lucide-react'; // import the User2Icon from its source
import React from 'react';

const PersonList = ({ personData, personClickHandler, onClose }) => (
    <div className="grid gap-4 py-4">
        <ul className="space-y-4 overflow-y-auto ">
            {personData?.map((member, index) => (
                <li key={index} onClick={() => { personClickHandler(index); onClose(); }} className="flex items-center justify-between cursor-pointer hover:bg-gray-900 p-3 rounded shadow-lg">
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
    </div>
);

export default PersonList;