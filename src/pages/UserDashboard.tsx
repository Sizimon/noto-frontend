'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useOnClickOutside } from '../hooks/onClickOutside';
import Layout from '../Layout';
import RecentlyViewed from '../components/RecentlyViewed';
import { FaRegListAlt, FaRegStickyNote, FaCaretDown } from "react-icons/fa";
import { MdOutlineViewKanban } from "react-icons/md";
import { useRouter } from 'next/navigation';
import { IoCreateOutline } from "react-icons/io5";
import { useTasks } from '../context/TasksProvider';
import { useAuth } from '../context/AuthProvider';
import CreateTaskModal from '../components/CreateTaskModal';


const UserDashboard: React.FC = () => {
    const { allTasks, refreshTasks } = useTasks();
    const { user } = useAuth();

    const router = useRouter();
    const [showModal, setShowModal] = useState<boolean>(false);

    const [filteredTasks, setFilteredTasks] = useState<any[]>(allTasks); // This will be updated based on search or filter criteria

    const tagsRef = useRef<HTMLDivElement>(null);
    useOnClickOutside(tagsRef, () => setTagsMenuOpen(false));
    const sortRef = useRef<HTMLDivElement>(null);
    useOnClickOutside(sortRef, () => setSortMenuOpen(false));

    const [tagsMenuOpen, setTagsMenuOpen] = useState<boolean>(false);
    const [sortMenuOpen, setSortMenuOpen] = useState<boolean>(false);

    const handleModalOpen = () => {
        setShowModal(true);
    }

    const handleModalClose = () => {
        setShowModal(false);
    }

    const handleTagsMenuToggle = () => {
        setTagsMenuOpen(!tagsMenuOpen);
    }

    const handleSortMenuToggle = () => {
        setSortMenuOpen(!sortMenuOpen);
    }

    const handleTaskClick = (card: any) => {
        router.push(`/tasks/${card.id}`);
    }

    const handleSearchChange = (value: string) => {
        // Implement search functionality here
        const filteredResult = allTasks.filter(task => task.title.toLowerCase().includes(value.toLowerCase()));
        setFilteredTasks(filteredResult);
    }

    console.log('All Tasks:', allTasks);

    return (
        <Layout>
            <div className="
                flex flex-col w-full text-zinc-800 items-center justify-center min-h-screen bg-white py-12
                dark:text-white dark:bg-zinc-900
            ">
                <div className="flex flex-col justify-center items-center text-center w-full">
                    <h1 className='text-4xl md:text-6xl'>In<span className='text-amber-600'>Time</span>Tasks</h1>
                    <h1 className="text-lg md:text-3xl font-bold md:my-4">WELCOME BACK, <span className='text-amber-600'>{user?.username}</span></h1>
                    <RecentlyViewed />
                </div>
                <div className='
                    bg-zinc-100 w-11/12 p-4 rounded-lg
                    dark:bg-zinc-950
                    md:w-10/12
                '>
                    {allTasks.length > 0 ? (
                        /* This will be a for loop to display every user created task */
                        <div className='flex flex-col items-center'>
                            <div className="flex flex-col items-center justify-center w-full mb-4 md:flex-row md:gap-4">
                                <div className="flex flex-row items-center justify-center mb-4 md:m-0 md:space-x-4">
                                    <button
                                        className='uppercase rounded cursor-pointer transition-all duration-300 hover:text-amber-600'
                                        onClick={handleModalOpen}
                                    >
                                        <IoCreateOutline className='text-2xl md:text-3xl' />
                                    </button>
                                    <input
                                        type="text"
                                        placeholder="Search..."
                                        onChange={(e) => handleSearchChange(e.target.value)}
                                        className="border rounded p-2 text-xs border-none bg-zinc-200 dark:bg-zinc-900 dark:border-zinc-700 outline-none focus:ring-1 focus:ring-amber-500 transition-all duration-300"
                                    />
                                </div>
                                <div className='flex flex-row items-center justify-center space-x-4'>
                                    {/* Sort */}
                                    <div className="relative items-center gap-2">
                                        <button
                                            className="
                                            flex text-sm items-center font-semibold uppercase text-black cursor-pointer
                                            hover:text-amber-600 transition-all duration-300
                                            dark:text-white
                                            "
                                            onClick={handleSortMenuToggle}>
                                            Sort
                                            <FaCaretDown />
                                        </button>
                                        {sortMenuOpen && (
                                            <div className="
                                            absolute left-0 top-full mt-2 w-32 bg-zinc-100 dark:bg-zinc-800 text-black rounded shadow-lg p-2
                                            dark:text-white
                                            md:w-48
                                            "
                                            ref={sortRef}
                                            >
                                                <label className="flex items-center gap-1 text-xs">
                                                    <input type="radio" name="sort" value="date" className="accent-amber-600" /> A-Z
                                                </label>
                                                <label className="flex items-center gap-1 text-xs">
                                                    <input type="radio" name="sort" value="name" className="accent-amber-600" /> Date Created
                                                </label>
                                                <label className="flex items-center gap-1 text-xs">
                                                    <input type="radio" name="sort" value="priority" className="accent-amber-600" /> Last Updated
                                                </label>
                                                <label className="flex items-center gap-1 text-xs">
                                                    <input type="radio" name="sort" value="priority" className="accent-amber-600" /> Priority
                                                </label>
                                            </div>
                                        )}
                                    </div>
                                    {/* Tags */}
                                    <div className="relative items-center gap-2">
                                        <button
                                            className="
                                            flex text-sm items-center font-semibold uppercase text-black cursor-pointer
                                            hover:text-amber-600 transition-all duration-300
                                            dark:text-white
                                            "
                                            onClick={handleTagsMenuToggle}>
                                            Tags
                                            <FaCaretDown />
                                        </button>
                                        {tagsMenuOpen && (
                                            <div className="
                                            absolute left-0 top-full mt-2 w-32 bg-zinc-100 dark:bg-zinc-950 text-black rounded shadow-lg p-2
                                            dark:text-white
                                            md:w-48
                                            "
                                            ref={tagsRef}
                                            >
                                                <label className="flex items-center gap-1 text-xs">
                                                    <input type="checkbox" className="accent-amber-600" /> CRON
                                                </label>
                                                <label className="flex items-center gap-1 text-xs">
                                                    <input type="checkbox" className="accent-amber-600" /> SSL
                                                </label>
                                                <label className="flex items-center gap-1 text-xs">
                                                    <input type="checkbox" className="accent-amber-600" /> DEV
                                                </label>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className='grid grid-cols-1 grid-flow-row md:grid-cols-4 justify-items-center w-full md:px-4 md:space-x-4'>
                                {filteredTasks.map((card, index) => (
                                    <div
                                        key={card.id || index}
                                        className='
                                        flex flex-col items-center text-center p-4 rounded-lg shadow-lg mb-4 bg-zinc-200 w-full cursor:pointer
                                        dark:bg-zinc-900
                                        md:w-10/12
                                        transition-all duration-300 hover:shadow-xl hover:scale-105
                                        '
                                        onClick={() => handleTaskClick(card)}
                                    >
                                        <div className='flex flex-col items-center w-full justify-between mb-4 text-amber-600'>
                                            <div>
                                                <div className='flex items-center justify-center'>
                                                    {card.type === 'note' && <FaRegStickyNote className='text-2xl md:text-3xl' />}
                                                    {card.type === 'list' && <FaRegListAlt className='text-2xl md:text-3xl' />}
                                                    {card.type === 'kanban' && <MdOutlineViewKanban className='text-2xl md:text-3xl' />}
                                                </div>
                                                <div className='flex items-center'>
                                                    <h2 className='text-lg font-bold truncate'>{card.title}</h2>
                                                </div>
                                            </div>
                                        </div>
                                        <ul className='flex flex-row space-x-4 text-xs text-zinc-600 dark:text-zinc-300'>
                                            <li>Tag 1</li>
                                            <li>Tag 2</li>
                                            <li>Tag 3</li>
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center">
                            <h2 className="text-xl mb-4">Let's create your first task!</h2>
                            <button
                                className='space-y-2 p-4 mb-8 w-1/4 text-white bg-amber-600 rounded cursor-pointer transition-all duration-300 hover:bg-amber-500'
                                onClick={handleModalOpen}
                            >
                                Create new Task
                            </button>
                        </div>
                    )}
                </div>
            </div>
            {showModal && (
                <CreateTaskModal
                    handleModalClose={handleModalClose}
                />
            )}
        </Layout>
    );
}

export default UserDashboard;