'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { tasksAPI } from '@/connections/api';
import { Tag } from '@/context/Tags/TagsProvider'; // Adjust the import path as necessary

// Defines what a Task should look like (may need to be adjusted in the future)
export interface Task {
    id: number;
    dirty?: boolean; // Optional property to indicate if the task has unsaved changes
    tags?: Tag[]; // Optional property to hold tags associated with the task
    title: string;
    type: string;
    content: string;
    is_favorite: boolean;
    createdAt: string;
    updatedAt: string;
}

interface TasksContextType {
    allTasks: Task[]; // Array of all tasks with each task needing to match the Task interface
    setAllTasks: React.Dispatch<React.SetStateAction<Task[]>>; // Function to update the tasks state
    refreshTasks: () => Promise<void>;
}

const TasksContext = createContext<TasksContextType | undefined>(undefined); 

export const TasksProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [allTasks, setAllTasks] = useState<Task[]>([]);

    const refreshTasks = async () => {
        try {
            const data = await tasksAPI.getAll();
            setAllTasks(data.notepads);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };

    useEffect(() => {
        refreshTasks();
    }, []);

    return (
        <TasksContext.Provider value={{ allTasks, setAllTasks, refreshTasks }}>
            {children}
        </TasksContext.Provider>
    );
};

export const useTasks = (): TasksContextType => {
    const context = useContext(TasksContext);
    if (!context) {
        throw new Error('useTasks must be used within a TasksProvider');
    }
    return context;
}