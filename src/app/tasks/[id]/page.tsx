'use client'

import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { tasksAPI } from '@/connections/api';
import TipTapEditor from '@/components/TipTapEditor';

export default function TaskPage() {
    const params = useParams();
    const id = Array.isArray(params?.id) ? params.id[0] : params?.id;
    const [task, setTask] = useState<any>(null);

    useEffect(() => {
        if (id) {
            tasksAPI.getById(id as string).then(setTask).catch(() => setTask(null));
        }
    }, [id]);

    if (!task) {
        return <div>Loading...</div>;
    }

    const handleContentChange = (newContent: string) => {
        setTask((prev: any) => ({ ...prev, content: newContent }));
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
                    onChange={(e) => setTask({ ...task, title: e.target.value })}
                />      
            </div>
            <div className="
            flex items-center justify-center mt-4 text-zinc-600 w-full
            dark:text-zinc-300
            ">
                <TipTapEditor 
                    content={task.content ? task.content : null} 
                    onChange={handleContentChange} 
                    
                />
            </div>
        </div>
    );
}