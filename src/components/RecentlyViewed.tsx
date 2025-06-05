import React, { useState, useEffect } from 'react';
import { FaRegListAlt, FaRegStickyNote, FaRegClock } from "react-icons/fa";
import { MdOutlineViewKanban } from "react-icons/md";

const cards = [
    {
        icon: <FaRegStickyNote className="text-md md:text-lg" />,
        type: "TYPE",
        label: "Cron to update SSL"
    },
    {
        icon: <FaRegListAlt className="text-md md:text-lg" />,
        type: "TYPE",
        label: "Sunday List"
    },
    {
        icon: <MdOutlineViewKanban className="text-lg md:text-xl" />,
        type: "TYPE",
        label: "Portfolio Kanban"
    }
]

const RecentlyViewed: React.FC = () => {

    return (
        <div className='flex flex-col bg-zinc-200 dark:bg-zinc-950 p-4 rounded-lg shadow-lg m-4 md:m-0 md:mb-4'>
            <div className='flex space-x-2 items-center text-amber-600 mb-4'>
                <FaRegClock className='text-sm' />
                <p className='text-sm'>Recently viewed</p>
            </div>
            <div className='flex flex-row items-center justify-center space-x-2'>
                {cards.map((card, index) => (
                    <div
                        key={index}
                        className='flex flex-col items-center rounded-sm cursor-pointer flex-1 min-w-0 max-w-xs h-32 bg-zinc-100 dark:bg-zinc-900 transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg'
                    >
                        <div className='w-full text-center rounded-t-sm bg-zinc-300 dark:bg-zinc-800 py-2'>
                            <div className='flex items-center justify-center text-amber-600 text-sm'>
                                {card.icon}
                                <p>{card.type}</p>
                            </div>
                        </div>
                        <div className='m-auto p-1 md:p-4 w-full text-center text-sm'>
                            <p>{card.label}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default RecentlyViewed;