'use client';

import React, { useState, useEffect } from 'react';

import Layout from '../Layout';
import DashboardHeader from '@/components/DashboardHeader/DashboardHeader';
import SortAndTagsMenu from '../components/SearchAndFilter/SortAndTagsMenu';
import SearchAndCreate from '../components/SearchAndFilter/SearchAndCreate';
import TaskGrid from '../components/TaskInterface/TaskGrid';
import CreateTaskModal from '../components/CreateTaskModal';

import { useRouter } from 'next/navigation';
import { useTasks } from '../context/TasksProvider';
import { useAuth } from '../context/AuthProvider';

const UserDashboard: React.FC = () => {
    const router = useRouter();

    // CONTEXT HOOKS
    const { allTasks, refreshTasks } = useTasks();
    const { user, setUser } = useAuth();
    // ------------------------------------------

    const [showModal, setShowModal] = useState<boolean>(false); // State to control the visibility of the Create Task modal

    // STATE FOR MANAGING TASK SEARCH & FILTERING
    const [filteredTasks, setFilteredTasks] = useState<any[]>(allTasks);
    const [searchInput, setSearchInput] = useState<string>(''); // State to hold the search input value
    // const [sortOrder, setSortOrder] = useState<string>('alphabetical'); // Current sort order state
    // const [selectedTags, setSelectedTags] = useState<string[]>([]); // State to hold selected tags for filtering tasks
    // ------------------------------------------

    // STATE FOR MANAGING TASK INTERFACE
    const [noteMenuOpen, setNoteMenuOpen] = useState<string>(''); // State to control which task's note menu is open
    const [tagsMenuOpen, setTagsMenuOpen] = useState<boolean>(false); // State to control the visibility of the tags menu
    const [sortMenuOpen, setSortMenuOpen] = useState<boolean>(false); // State to control the visibility of the sort menu
    // ------------------------------------------

    const handleNoteMenuToggle = (taskId: string) => {
        if (noteMenuOpen === taskId) {
            setNoteMenuOpen(''); // Close the note menu if it's already open for this task
        } else {
            setNoteMenuOpen(taskId); // Open the note menu for the clicked task
        }
    }

    const handleTagsMenuToggle = () => {
        setTagsMenuOpen(!tagsMenuOpen);
    }

    const handleSortMenuToggle = () => {
        setSortMenuOpen(!sortMenuOpen);
    }

    const handleTaskClick = (card: any) => {
        // Navigate to the task details page
        router.push(`/tasks/${card.id}`);

        // Update localStorage with the last viewed task
        const userStorage = localStorage.getItem('user');
        let user = userStorage ? JSON.parse(userStorage) : null;
        if (user) {
            if (!Array.isArray(user.lastViewedTasks)) user.lastViewedTasks = [];

            user.lastViewedTasks = user.lastViewedTasks.filter((id: string) => id !== card.id); // Remove the task if it already exists
            user.lastViewedTasks.unshift(card.id); // Add the task to the front of the array
            if (user.lastViewedTasks.length > 10) user.lastViewed.pop(); // Limit to the last 10 viewed tasks
            localStorage.setItem('user', JSON.stringify(user)); // Update the user in local storage
            setTimeout(() => setUser({ ...user }), 750); //  750ms DELAY | Update the user state in context
        }
    }

    // const sortTasks = (tasks: any[], order: string) => {
    //     switch (order) {
    //         case 'alphabetical':
    //             return tasks.sort((a, b) => a.title.localeCompare(b.title));
    //         case 'date':
    //             return tasks.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    //         case 'favorite':
    //             return tasks.filter(task => task.is_favorite);
    //         default:
    //             return tasks; // If no valid order is specified, return the tasks as is
    //     }
    // }

    // useEffect(() => {
    //     // Whenever allTasks or sortOrder changes, we re-filter and sort the tasks
    //     const searchTermFilteredTasks = allTasks.filter(task => task.title.toLowerCase().includes(searchInput.toLowerCase()));
    //     const sortedTasks = sortTasks([...searchTermFilteredTasks], sortOrder);
    //     setFilteredTasks(sortedTasks ?? []);
    // }, [allTasks, searchInput, sortOrder]);

    return (
        <Layout>
            <div className="
                flex flex-col w-full text-zinc-800 items-center justify-center min-h-screen bg-white py-12
                dark:text-white dark:bg-zinc-900
            ">
                <DashboardHeader user={user} />
                <div className='
                    bg-zinc-100 w-11/12 p-4 rounded-lg
                    dark:bg-zinc-950
                    md:w-10/12
                '>
                    {allTasks.length > 0 ? (
                        /* This will be a for loop to display every user created task */
                        <div className='flex flex-col items-center'>
                            <div className="flex flex-col items-center justify-center w-full mb-4 md:flex-row md:gap-4">
                                <SearchAndCreate
                                    handleModalOpen={() => setShowModal(true)}
                                    setSearchInput={setSearchInput}
                                />
                                <SortAndTagsMenu
                                    sortMenuOpen={sortMenuOpen}
                                    searchInput={searchInput}
                                    tagsMenuOpen={tagsMenuOpen}
                                    setFilteredTasks={setFilteredTasks}
                                    // Handler Functions
                                    handleSortMenuToggle={handleSortMenuToggle}
                                    handleTagsMenuToggle={handleTagsMenuToggle}
                                />
                            </div>
                            <TaskGrid
                                filteredTasks={filteredTasks}
                                noteMenuOpen={noteMenuOpen}

                                // Handler Functions
                                handleNoteMenuToggle={handleNoteMenuToggle}
                                handleTaskClick={handleTaskClick}
                            />
                        </div>
                    ) : (
                        <div className="flex flex-col items-center">
                            <h2 className="text-xl mb-4">Let's create your first task!</h2>
                            <button
                                className='space-y-2 p-4 mb-8 w-1/4 text-white bg-amber-600 rounded cursor-pointer transition-all duration-300 hover:bg-amber-500'
                                onClick={() => setShowModal(true)}
                            >
                                Create new Task
                            </button>
                        </div>
                    )}
                </div>
            </div>
            {showModal && (
                <CreateTaskModal
                    handleModalClose={() => {
                        setShowModal(false);
                        refreshTasks(); // Refresh tasks after creating a new task
                    }}
                />
            )}
        </Layout>
    );
}

export default UserDashboard;