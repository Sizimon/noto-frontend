'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTasks } from '@/context/Tasks/TasksProvider';
import { FaRegClock } from "react-icons/fa";
import { useAuth } from '@/context/Auth/AuthProvider';
import { handleTaskClick } from '../TaskInterface/TaskCard';
import { FiFileText } from "react-icons/fi";


const RecentlyViewed: React.FC = () => {
    const { user, setUser } = useAuth();
    const { allTasks } = useTasks();
    const [cards, setCards] = useState<any[]>([]);
    const router = useRouter();

    useEffect(() => {
        if (user && Array.isArray(user.lastViewedTasks)) {
            const recentlyViewedTasks = user.lastViewedTasks
                .map((id: number | string) => allTasks.find(task => task.id === Number(id)))
                .filter(Boolean);
            setCards(recentlyViewedTasks);
        } else {
            setCards([]); // Reset cards if user or lastViewed is not available
            console.warn('User or lastViewed is not available');
        }
    }, [user, allTasks]);

    if (cards.length === 0) {
        return (
            <div className='flex flex-col items-center justify-center p-4'>
                <p className='text-gray-500'>No recently viewed tasks</p>
            </div>
        );
    }

    return (
        <div className='
            flex flex-col bg-foreground p-4 rounded-lg shadow-lg w-11/12 my-4
            md:m-0 md:mb-4 md:max-w-2xl
        '>
            <div className='flex space-x-2 items-center text-amber-600'>
                <FaRegClock className='text-sm' />
                <p className='text-sm'>Recently viewed</p>
            </div>
            <div className="flex flex-row items-center justify-start space-x-4 overflow-x-auto py-2 px-2">
                {cards.map((card) => (
                    <div
                    key={card.id}
                    onClick={() => handleTaskClick(card, router, user, setUser)}
                    className="cursor-pointer bg-background rounded-xl p-4 transition border-1 border-transparent hover:border-amber-600 flex items-center space-x-2">
                        <div className="bg-gradient-to-br from-orange-500 to-yellow-400 text-default p-2 rounded-lg">
                            <FiFileText className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                            <p className="text-default font-medium whitespace-nowrap">{card.title}</p>
                        </div>
                    </div>
                    // <div
                    //     key={card.id}
                    //     className="
                    //         flex flex-col items-center cursor-pointer
                    //         transition-transform duration-200 hover:scale-105
                    //     "
                    //     title={card.title}
                    //     onClick={() => {
                    //         handleTaskClick(card, router, user, setUser); // Navigate to the task detail page
                    //     }}
                    // >
                    //     <div
                    //         className="
                    //             flex items-center justify-center
                    //             w-20 h-20 md:w-28 md:h-28
                    //             rounded-full bg-amber-600 shadow-lg
                    //             overflow-hidden
                    //             transition-all duration-200
                    //         "
                    //     >
                    //         <span className="text-white text-xs font-bold text-center px-2 uppercase line-clamp-3">
                    //             {card.title}
                    //         </span>
                    //     </div>
                    // </div>
                ))}
            </div>
        </div>
    );
}

export default RecentlyViewed;