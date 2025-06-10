import React from 'react';
import { motion } from 'framer-motion';
import { FaRegStickyNote, FaRegListAlt } from "react-icons/fa";
import { MdOutlineViewKanban } from "react-icons/md";
import { tasksAPI } from '@/connections/api';

const TASK_TYPES = [
    { type: 'note', label: 'Notepad' },
    { type: 'list', label: 'To-Do List' },
    { type: 'kanban', label: 'Kanban Board' },
];

export default function CreateTaskModal({ handleModalClose }: { handleModalClose: () => void }) {
    const handleTypeSelect = async (type: string) => {
        try {
            const newTask = await tasksAPI.create(type);

            console.log('New task created:', newTask);
            handleModalClose(); // Close the modal after task creation
            // Redirect to the new task page
            window.location.href = `/tasks/${newTask.id}`;
        } catch (error) {
            console.error('Error creating task:', error);
            alert('Failed to create task. Please try again.');
        }
    };

    return (
        <motion.div
            className='fixed inset-0 flex items-center justify-center bg-black/75 z-10'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleModalClose}
        >
            <motion.div
                className='
                bg-white text-zinc-600 rounded-lg shadow-lg p-4 w-10/12
                dark:bg-zinc-900 dark:text-white
                md:w-2/5'
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
            >
                <div
                    className='
                    flex flex-col items-center justify-center text-center
                    md:space-x-4'>
                    <h1 className='text-amber-600 text-2xl font-bold my-4 uppercase'>
                        Create New Task
                    </h1>
                    <div className='
                    flex flex-col items-center justify-center text-center w-full
                    md:flex-row md:space-x-4'>
                        {TASK_TYPES.map((task) => (
                            <motion.div
                                key={task.type}
                                className='
                                flex flex-col items-center justify-center space-y-2 cursor-pointer p-4 my-2 w-full rounded-xl border-1 border-zinc-800/0 bg-zinc-200
                                dark:bg-zinc-800
                                md:w-1/3
                                transition-all duration-150 hover:border-1 hover:border-amber-600
                                '
                                onClick={() => handleTypeSelect(task.type)}
                            >
                                {task.type === 'note' && <FaRegStickyNote className='text-4xl text-amber-600' />}
                                {task.type === 'list' && <FaRegListAlt className='text-4xl text-amber-600' />}
                                {task.type === 'kanban' && <MdOutlineViewKanban className='text-4xl text-amber-600' />}
                                <span className='text-sm uppercase'>{task.label}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.div>

        </motion.div>
    )
}
