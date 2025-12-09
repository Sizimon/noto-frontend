'use client'

import { useParams } from 'next/navigation';
import React, { useEffect, useState, useRef } from 'react';
import { useTasks } from '@/context/Tasks/TasksProvider';
import dynamic from 'next/dynamic';
import { Task } from '@/context/Tasks/TasksProvider';
import { tasksAPI } from '@/connections/api';

const TipTapEditor = dynamic(() => import('@/components/TipTapEditor'), {
    ssr: false,
    loading: () => {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-amber-500 border-t-transparent"></div>
            </div>
        );
    },
});

export default function TaskPage() {
    const debounceRef = useRef<NodeJS.Timeout | null>(null); // Ref to hold the debounce timeout
    const params = useParams(); // Get the URL parameters (e.g., task ID)
    const id = Array.isArray(params?.id) ? params.id[0] : params?.id; // If id is an array, take the first element; otherwise, use the id directly
    const { allTasks, setAllTasks } = useTasks(); // Access the tasks context to get all tasks and the function to update them
    const [task, setTask] = useState<Task | null>(null); // State to hold the current task
    const [isLoading, setIsLoading] = useState(true);

    const numericId = Number(id); // Convert the ID to a number for comparison
    // console.log('Task ID:', numericId); // Log the task ID for debugging
    // console.log('All Tasks:', allTasks); // Log all tasks for debugging

    // Effect to load the task when the component mounts or when the ID changes (fetches from context or API)
    useEffect(() => {
        const loadTask = async () => {
            if (!numericId) return;

            setIsLoading(true);

            // First, try to find task in context
            if (allTasks && allTasks.length > 0) {
                const foundTask = allTasks.find((t: Task) => t.id === numericId);
                if (foundTask) {
                    setTask(foundTask);
                    setIsLoading(false);
                    return;
                }
            }

            // If not found in context, fetch directly
            try {
                const fetchedTask = await tasksAPI.getById(numericId);
                setTask(fetchedTask);
            } catch (error) {
                console.error('Error fetching task:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadTask();
    }, [numericId]); // Remove allTasks from dependency array


    // Update task when allTasks changes (for real-time updates)
    useEffect(() => {
        if (task && allTasks) {
            const updatedTask = allTasks.find((t: Task) => t.id === task.id);
            if (updatedTask && updatedTask !== task) {
                setTask(updatedTask);
            }
        }
    }, [allTasks, task?.id]);

    if (isLoading) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-amber-500 border-t-transparent"></div>
            </div>
        );
    }

    if (!task) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="text-white text-xl">Task not found</div>
            </div>
        );
    }

    // Function to handle task editing, which updates the task title and content
    const handleTaskEdit = async (newTitle: string, newContent: string) => {
        setTask((prev: Task | null) => (prev ? { ...prev, title: newTitle, content: newContent } : null));
        if (!numericId) return;
        try {
            // Call the API to update the task with the new title and content
            await tasksAPI.edit(numericId, {
                title: newTitle,
                content: newContent,
            });

            // Update the task in context state to maintain consistency
            setAllTasks((prevTasks: any[]) =>
                prevTasks.map((t) =>
                    t.id === numericId ? { ...t, title: newTitle, content: newContent } : t
                )
            );
        } catch (error) {
            console.error('Error updating task:', error);
        }
    }

    // Function to trigger auto-save after a delay when the title or content changes
    const triggerAutoSave = (newTitle: string, newContent: string) => {
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }
        debounceRef.current = setTimeout(() => {
            handleTaskEdit(newTitle, newContent);
        }, 2000);
    }

    return (
        <div className="
            flex flex-col items-center justify-start min-h-lvh p-4 w-full bg-background pt-12
            ">
            <div className='
            flex items-center justify-center w-full max-w-3xl
            md:items-start md:justify-start 
            '>
                <input
                    className="
                    border-b-1 border-zinc-300 bg-background text-default text-xl focus:outline-none max-w-screen text-center pb-2
                    md:text-left md:w-full md:text-3xl md:focus:text-3xl
                    "
                    placeholder={`${task.title}`}
                    value={task.title}
                    maxLength={55}
                    onChange={(e) => {
                        const newTitle = e.target.value;
                        setTask({ ...task, title: newTitle });
                        // Trigger auto-save after a delay only for title changes
                        triggerAutoSave(newTitle, task.content);
                    }}
                />
            </div>
            <div className="
            flex items-center justify-center mt-4 text-default w-full
            ">
                <TipTapEditor
                    key={task.id}
                    content={task.content}
                    onChange={(newContent) => {
                        setTask({ ...task, content: newContent });
                        // Trigger auto-save after a delay for content changes
                        triggerAutoSave(task.title, newContent);
                    }}
                />
            </div>
        </div>
    );
}