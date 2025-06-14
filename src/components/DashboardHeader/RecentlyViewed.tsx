import React, { useState, useEffect } from 'react';
import { useTasks } from '@/context/TasksProvider';
import { FaRegClock } from "react-icons/fa";
import { useAuth } from '@/context/AuthProvider';


const RecentlyViewed: React.FC = () => {
    const { user } = useAuth();
    const { allTasks } = useTasks();
    const [cards, setCards] = useState<any[]>([]);

    useEffect(() => {
        if (user) {
            const recentlyViewedTasks = user.lastViewed.map((id: string) => allTasks.find(task => task.id === id)).filter(Boolean);
            setCards(recentlyViewedTasks);
        }
    }, [user, allTasks]);

    return (
        <div className='
            flex flex-col bg-zinc-200 p-4 rounded-lg shadow-lg w-11/12 my-4
          dark:bg-zinc-950
            md:m-0 md:mb-4 md:max-w-2xl
        '>
            <div className='flex space-x-2 items-center text-amber-600'>
                <FaRegClock className='text-sm' />
                <p className='text-sm'>Recently viewed</p>
            </div>
            <div className='flex flex-row items-center justify-start space-x-2 overflow-x-scroll py-4 px-2'>
                {cards.map((card, index) => (
                    <div
                        key={index}
                        className='
                        flex flex-col items-center rounded-sm cursor-pointer flex-1 min-w-32 max-w-xs h-32 bg-zinc-100 
                        dark:bg-zinc-900 
                        transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg
                    '>
                        <div className='w-full text-center rounded-t-sm bg-zinc-300 dark:bg-zinc-800 py-2'>
                            <div className='flex items-center justify-center text-amber-600 text-sm'>
                                {card.title}
                                <p>{card.title}</p>
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