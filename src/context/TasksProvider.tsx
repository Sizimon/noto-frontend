'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { tasksAPI } from '@/connections/api';

interface Task {
    id: string;
    title: string;
    type: string;
    content: string;
    is_favourite: boolean;
    createdAt: string;
    updatedAt: string;
}

interface TasksContextType {
    allTasks: Task[];
    setAllTasks: React.Dispatch<React.SetStateAction<Task[]>>;
    refreshTasks: () => Promise<void>;
}

const TasksContext = createContext<TasksContextType | undefined>(undefined);

export const TasksProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [allTasks, setAllTasks] = useState<Task[]>([]);

    const refreshTasks = async () => {
        try {
            const data = await tasksAPI.getAll();
            setAllTasks(data.all);
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