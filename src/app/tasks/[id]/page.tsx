'use client'

import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { tasksAPI } from '@/connections/api';

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

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">{task.title}</h1>
            <p>Type: {task.type}</p>
            <div className="mt-4">{task.content}</div>
        </div>
    );
}