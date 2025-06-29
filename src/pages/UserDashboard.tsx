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
    const { allTasks, setAllTasks, refreshTasks } = useTasks();
    const { user, setUser } = useAuth();
    // ------------------------------------------

    const [showModal, setShowModal] = useState<boolean>(false); // State to control the visibility of the Create Task modal

    // STATE FOR MANAGING TASK SEARCH & FILTERING
    const [filteredTasks, setFilteredTasks] = useState<any[]>(allTasks); // State to hold the filtered tasks based on search input
    const [searchInput, setSearchInput] = useState<string>(''); // State to hold the search input value
    const [sortOrder, setSortOrder] = useState<string>('alphabetical'); // Current sort order state
    // ------------------------------------------

    // STATE FOR MANAGING TASK INTERFACE
    const [noteMenuOpen, setNoteMenuOpen] = useState<string>(''); // State to control which task's note menu is open
    const [tagsMenuOpen, setTagsMenuOpen] = useState<boolean>(false); // State to control the visibility of the tags menu
    const [sortMenuOpen, setSortMenuOpen] = useState<boolean>(false); // State to control the visibility of the sort menu
    // ------------------------------------------

    const colors = [
        'bg-amber-600', 'bg-blue-600', 'bg-green-600', 'bg-red-600', 'bg-purple-600',
        'bg-pink-600', 'bg-yellow-600', 'bg-teal-600', 'bg-indigo-600', 'bg-gray-600',
        'bg-orange-600', 'bg-lime-600', 'bg-cyan-600', 'bg-violet-600', 'bg-fuchsia-600'
    ]

    const handleCreateTag = (taskId: string, tagTitle: string) => {
        // Create API call to create a new tag for the task !!! IMPORTANT !!!
        if (!tagTitle || tagTitle.trim() === '') return; // Prevent creating empty tags

        if (tagTitle.length > 15) {
            alert('Tag title is too long.');
            return;
        }

        const usedColors = allTasks.flatMap(task => task.tags?.map(tag => tag.color) || []);
        const availableColors = colors.filter(color => !usedColors.includes(color));
        if (availableColors.length === 0) {
            console.error('No available colors left.');
            return;
        }

        const color = availableColors[Math.floor(Math.random() * availableColors.length)];

        const newTag = {
            id: Date.now().toString(),
            dirty: true, // Mark the tag as dirty for syncing later
            title: tagTitle.toUpperCase(),
            color: color
        }

        const updatedTasks = allTasks.map(task => {
            if (task.id === taskId) {
                const newTags = Array.isArray(task.tags) ? [...task.tags, newTag] : [newTag];
                return { ...task, tags: newTags, dirty: true };
            }
            return task;
        });
        setAllTasks(updatedTasks); // Update the tasks in the context
    }

    const handleRemoveTag = (taskId: string, tagId: string) => {
        // Create API call to remove a tag from a task !!! IMPORTANT !!!
        const updatedTasks = allTasks.map(task => {
            if (task.id === taskId) {
                const newTags = task.tags?.filter((tag: any) => tag.id !== tagId) || [];
                return { ...task, tags: newTags, dirty: true }; // Mark the task as dirty
            }
            return task;
        });
        setAllTasks(updatedTasks); // Update the tasks in the context
    }

    const handleFavoriteToggle = (taskId: string) => {
        const updatedTasks = allTasks.map(task => {
            if (task.id === taskId) {
                return { ...task, is_favorite: !task.is_favorite, dirty: true }; // Toggle the favorite status and mark the task as dirty
            }
            return task;
        });
        setAllTasks(updatedTasks);
    }

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

    const sortTasks = (tasks: any[], order: string) => {
        switch (order) {
            case 'alphabetical':
                return tasks.sort((a, b) => a.title.localeCompare(b.title));
            case 'date':
                return tasks.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            case 'favorite':
                return tasks.filter(task => task.isFavorite);
            default:
                return tasks; // If no valid order is specified, return the tasks as is
        }
    }

    useEffect(() => {
        // Whenever allTasks or sortOrder changes, we re-filter and sort the tasks
        const searchTermFilteredTasks = allTasks.filter(task => task.title.toLowerCase().includes(searchInput.toLowerCase()));
        const sortedTasks = sortTasks([...searchTermFilteredTasks], sortOrder);
        setFilteredTasks(sortedTasks ?? []);
    }, [allTasks, searchInput, sortOrder]);

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
                                    handleSortMenuToggle={handleSortMenuToggle}
                                    sortOrder={sortOrder}
                                    setSortOrder={setSortOrder}
                                    tagsMenuOpen={tagsMenuOpen}
                                    handleTagsMenuToggle={handleTagsMenuToggle}
                                />
                            </div>
                            <TaskGrid
                                filteredTasks={filteredTasks}
                                noteMenuOpen={noteMenuOpen}

                                // Handler Functions
                                handleNoteMenuToggle={handleNoteMenuToggle}
                                handleTaskClick={handleTaskClick}
                                handleFavoriteToggle={handleFavoriteToggle}
                                handleCreateTag={handleCreateTag}
                                handleRemoveTag={handleRemoveTag}
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