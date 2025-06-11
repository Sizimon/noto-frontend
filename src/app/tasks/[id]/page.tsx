'use client'

import { useParams } from 'next/navigation';
import React, { useEffect, useState, useRef } from 'react';
import { useTasks } from '@/context/TasksProvider';
import TipTapEditor from '@/components/TipTapEditor';

import { tasksAPI } from '@/connections/api';

export default function TaskPage() {
    const params = useParams();
    const id = Array.isArray(params?.id) ? params.id[0] : params?.id;
    const { allTasks } = useTasks();
    const [task, setTask] = useState<any>(null);

    useEffect(() => {
        if (id) {
            const foundTask = allTasks.find((t) => t.id === id);
            setTask(foundTask || null);
        }
    }, [id, allTasks]);

    if (!task) {
        return <div>Loading...</div>;
    }

    const handleTaskEdit = async (newTitle: string, newContent: string) => {
        setTask((prev: any) => ({ ...prev, title: newTitle, content: newContent }));
        if (!id) return;
        try {
            await tasksAPI.edit(id, {
                title: newTitle,
                content: newContent,
            });
        } catch (error) {
            console.error('Error updating task:', error);
        }
    }

    const debounceRef = useRef<NodeJS.Timeout | null>(null);

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
            flex flex-col items-center justify-start min-h-screen p-4 w-full bg-zinc-200 pt-12
            dark:bg-zinc-900 dark:text-zinc-300 dark:border-zinc-900
            ">
            <div className='
            flex items-center justify-center w-full max-w-3xl
            md:items-start md:justify-start 
            '>
                <input 
                    className="
                    border-b-1 border-zinc-300 bg-zinc-200 text-zinc-600 text-xl focus:outline-none max-w-screen text-center pb-2
                    md:text-left md:max-w-3xl md:text-3xl md:focus:text-3xl
                    dark:bg-zinc-900 dark:text-zinc-300 dark:border-zinc-800
                    " 
                    placeholder={`${task.title}`}
                    value={task.title}
                    onChange={(e) => {
                        const newTitle = e.target.value;
                        setTask({ ...task, title: newTitle });
                        triggerAutoSave(newTitle, task.content);
                    }}
                />      
            </div>
            <div className="
            flex items-center justify-center mt-4 text-zinc-600 w-full
            dark:text-zinc-300
            ">
                <TipTapEditor 
                    content={task.content ? task.content : null} 
                    onChange={(newContent) => {
                        setTask({ ...task, content: newContent });
                        triggerAutoSave(task.title, newContent);
                    }} 
                    
                />
            </div>
        </div>
    );
}