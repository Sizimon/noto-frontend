'use client';

import React, { useState } from 'react';

import Layout from '../Layout';
import DashboardHeader from '@/components/DashboardHeader/DashboardHeader';
import SortAndTagsMenu from '../components/SearchAndFilter/SortAndTagsMenu';
import SearchAndCreate from '../components/SearchAndFilter/SearchAndCreate';
import TaskGrid from '../components/TaskInterface/TaskGrid';
import CreateTaskModal from '../components/CreateTaskModal';

import { useTasks } from '../context/TasksProvider';
import { useAuth } from '../context/AuthProvider';

const UserDashboard: React.FC = () => {
    // CONTEXT HOOKS
    const { allTasks, refreshTasks } = useTasks();
    const { user } = useAuth();
    // ------------------------------------------

    const [showModal, setShowModal] = useState<boolean>(false); // State to control the visibility of the Create Task modal

    // STATE FOR MANAGING TASK SEARCH & FILTERING
    const [filteredTasks, setFilteredTasks] = useState<any[]>(allTasks);
    const [searchInput, setSearchInput] = useState<string>(''); // State to hold the search input value

    // ------------------------------------------

    // STATE FOR MANAGING TASK INTERFACE
    const [noteMenuOpen, setNoteMenuOpen] = useState<string>(''); // State to control which task's note menu is open
    const [openMenu, setOpenMenu] = useState<null | 'sort' | 'tags'>(null); // State to control the visibility of the task menu
    // ------------------------------------------

    const handleNoteMenuToggle = (taskId: string) => {
        if (noteMenuOpen === taskId) {
            setNoteMenuOpen(''); // Close the note menu if it's already open for this task
        } else {
            setNoteMenuOpen(taskId); // Open the note menu for the clicked task
        }
    }

    const handleTagsMenuToggle = () => {
        setOpenMenu(openMenu === 'tags' ? null : 'tags');
    }

    const handleSortMenuToggle = () => {
        setOpenMenu(openMenu === 'sort' ? null : 'sort');
    }

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
                                    openMenu={openMenu}
                                    searchInput={searchInput}
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