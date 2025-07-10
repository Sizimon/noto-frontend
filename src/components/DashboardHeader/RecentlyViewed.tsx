import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTasks } from '@/context/TasksProvider';
import { FaRegClock } from "react-icons/fa";
import { useAuth } from '@/context/AuthProvider';
import { handleTaskClick } from '../TaskInterface/TaskCard';


const RecentlyViewed: React.FC = () => {
    const { user, setUser } = useAuth();
    const { allTasks } = useTasks();
    const [cards, setCards] = useState<any[]>([]);
    const router = useRouter();

    useEffect(() => {
        if (user && Array.isArray(user.lastViewedTasks)) {
            const recentlyViewedTasks = user.lastViewedTasks
                .map((id: number) => allTasks.find(task => task.id === id))
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
            <div className="flex flex-row items-center justify-start space-x-4 overflow-x-auto py-4 px-2">
                {cards.map((card, index) => (
                    <div
                        key={index}
                        className="
                            flex flex-col items-center cursor-pointer
                            transition-transform duration-200 hover:scale-105
                        "
                        title={card.title}
                        onClick={() => {
                            handleTaskClick(card, router, setUser); // Navigate to the task detail page
                        }}
                    >
                        <div
                            className="
                                flex items-center justify-center
                                w-20 h-20 md:w-28 md:h-28
                                rounded-full bg-amber-600 shadow-lg
                                overflow-hidden
                                transition-all duration-200
                            "
                        >
                            <span className="text-white text-xs font-bold text-center px-2 uppercase line-clamp-3">
                                {card.title}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default RecentlyViewed;