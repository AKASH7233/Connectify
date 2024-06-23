import React from 'react';
import { Link } from 'react-router-dom';

const RenderMenuItem = ({respItem, to, resp,label, icon: Icon, isLink = true }) => {
    
    const button = (
        <button
            className={`flex items-center justify-left gap-x-10 mx-2 ${respItem == resp ? 'bg-gray-900 bg-opacity-90 border-gray-700' : ''} rounded-xl p-2 w-72 md:w-52 hover:bg-gray-900 hover:bg-opacity-90 border-2 border-black text-white hover:border-gray-700`}
        >
            <Icon className='text-lg' />
            <span>{label}</span>
        </button>
    );
    return isLink ? <Link to={to}>{button}</Link> : button;
};

export default RenderMenuItem;