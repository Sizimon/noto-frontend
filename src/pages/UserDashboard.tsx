'use client';

import React, { useState } from 'react';

import Layout from '../Layout';
import DashboardHeader from '@/components/DashboardHeader/DashboardHeader';
import SortAndTagsMenu from '../components/SearchAndFilter/SortAndTagsMenu';
import SearchAndCreate from '../components/SearchAndFilter/SearchAndCreate';
import TaskGrid from '../components/TaskInterface/TaskGrid';
import CreateTaskModal from '../components/CreateTaskModal';


import StarBorder from '@/blocks/Animations/StarBorder/StarBorder';

import { useTasks } from '../context/TasksProvider';

const UserDashboard: React.FC = () => {
    // CONTEXT HOOKS
    const { allTasks, refreshTasks } = useTasks();
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
                flex flex-col w-full text-default items-center justify-center min-h-screen bg-background py-12
            
            ">
                <DashboardHeader />
                {allTasks.length > 0 ? (
                    <div className='
                    bg-foreground w-11/12 p-4 rounded-lg
                    md:w-10/12
                '>
                        {/* This will be a for loop to display every user created task */}
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
                    </div>
                ) : (
                    <div className='
                    bg-foreground w-10/12 p-4 rounded-lg mt-4
                    md:w-4/12
                '>
                        <div className="flex flex-col items-center">
                            <h2 className="text-xl mb-4">Let's create your first task!</h2>
                            <StarBorder
                                as="button"
                                className='space-y-2 w-3/4 md:w-2/4 cursor-pointer'
                                color="orange"
                                speed="3s"
                                thickness={1.5}
                                onClick={() => setShowModal(true)}
                            >
                                Create New Task
                            </StarBorder>
                        </div>
                    </div>
                )}
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