import React, { useState, useEffect } from 'react';
import { useTasks } from '@/context/TasksProvider';
import { FaRegClock } from "react-icons/fa";
import { useAuth } from '@/context/AuthProvider';


const RecentlyViewed: React.FC = () => {
    const { user } = useAuth();
    const { allTasks } = useTasks();
    const [cards, setCards] = useState<any[]>([]);

    useEffect(() => {
        if (user && Array.isArray(user.lastViewedTasks)) {
            const recentlyViewedTasks = user.lastViewedTasks
                .map((id: string) => allTasks.find(task => task.id === id))
                .filter(Boolean);
            setCards(recentlyViewedTasks);
        } else {
            setCards([]); // Reset cards if user or lastViewed is not available
            console.warn('User or lastViewed is not available');
        }
    }, [user, allTasks]);

    return (
        <div className='
            flex flex-col bg-zinc-100 p-4 rounded-lg shadow-lg w-11/12 my-4
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
                        flex flex-col items-center cursor-pointer rounded-full 
                        dark:bg-zinc-900 
                        transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg
                    '>
                    <div className='
                        rounded-full w-24 h-24 flex items-center justify-center bg-amber-600'
                    >
                        <div className='w-full text-center'>
                            <div className='flex items-center justify-center text-zinc-100 text-xs rounded-full'>
                                {card.title}
                            </div>
                        </div>
                    </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default RecentlyViewed;