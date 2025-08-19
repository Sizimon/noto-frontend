'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaRegStickyNote } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { tasksAPI } from '@/connections/api';
import { useAuth } from '@/context/Auth/AuthProvider';

const TASK_TYPES = [
    { type: 'note', label: 'Notepad', icon: <FaRegStickyNote className='text-4xl text-amber-600' /> },
    // Add more types here if needed
];

export default function CreateTaskModal({ handleModalClose }: { handleModalClose: () => void }) {
    const { user, setUser } = useAuth();
    const router = useRouter();

    const handleTypeSelect = async (type: string) => {
        try {
            const newTask = await tasksAPI.create(type);
            handleModalClose();
            router.push(`/noto/tasks/${newTask.id}`);
            setUser((prevUser: any) => ({
                ...prevUser,
                lastViewedTasks: [...prevUser.lastViewedTasks, newTask.id]
            }));

        } catch (error) {
            console.error('Error creating task:', error);
            alert('Failed to create task. Please try again.');
        }
    };

    return (
            <div
                className='fixed inset-0 flex items-center justify-center bg-black/70 z-50'
                onClick={handleModalClose}
            >
                <motion.div
                    className='relative bg-background text-default rounded-2xl shadow-2xl p-8 w-11/12 max-w-md'
                    onClick={e => e.stopPropagation()}
                >
                    {/* Close Button */}
                    <button
                        className="absolute top-4 right-4 text-zinc-400 hover:text-red-600 transition-colors text-2xl cursor-pointer"
                        onClick={handleModalClose}
                        aria-label="Close"
                    >
                        <IoMdClose />
                    </button>
                    <h1 className='text-pop text-3xl font-extralight mb-6 text-center uppercase tracking-wide'>
                        Create New Task
                    </h1>
                    <div className='flex flex-col gap-4'>
                        {TASK_TYPES.map((task) => (
                            <motion.button
                                key={task.type}
                                className='
                                    flex flex-row items-center justify-start gap-4 cursor-pointer
                                    px-5 py-3 rounded-lg border border-zinc-200 dark:border-zinc-700
                                    bg-foreground
                                    w-full
                                '
                                whileHover={{
                                    scale: 1.025,
                                    backgroundColor: "rgba(251,191,36,0.08)", // subtle amber highlight
                                    boxShadow: "0 4px 16px rgba(251,191,36,0.10)"
                                }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handleTypeSelect(task.type)}
                            >
                                <span className="mr-2">{task.icon}</span>
                                <span className='text-base font-base uppercase tracking-wider'>
                                    {task.label}
                                </span>
                            </motion.button>
                        ))}
                    </div>
                </motion.div>
            </div>
        );
}