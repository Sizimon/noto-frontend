'use client';

import { useEffect, useRef } from "react";
import { userAPI } from "@/connections/api";
import { tasksAPI } from "@/connections/api";
import { useTasks } from "@/context/TasksProvider";

console.log('HistorySync component loaded');
const HistorySync = () => {
    const { allTasks } = useTasks();
    const allTasksRef = useRef(allTasks); // Store allTasks in a ref to avoid stale closure issues

    // Update the ref whenever allTasks changes
    // This ensures that the latest tasks are always available in the interval callback
    useEffect(() => {
        allTasksRef.current = allTasks;
    }, [allTasks]);

    useEffect(() => {
        const interval = setInterval(async () => {
            // SYNC LAST VIEWED TASKS FROM LOCAL STORAGE TO THE SERVER
            const userStr = localStorage.getItem('user');
            if (userStr) {
                const user = JSON.parse(userStr);
                if (Array.isArray(user.lastViewedTasks)) {
                    try {
                        await userAPI.updateLastViewed(user.lastViewedTasks);
                    } catch (err) {
                        console.error('Failed to sync lastViewedTasks:', err);
                    }
                }
            }

            // SYNC ALL DIRTY TASKS FROM CONTEXT TO THE SERVER
            const tasks = allTasksRef.current;
            if (tasks && tasks.length > 0) {
                await Promise.all(
                    tasks.map(async (task) => {
                        if (task.dirty) {
                            try {
                                await tasksAPI.edit(task.id, {
                                    title: task.title,
                                    content: task.content,
                                    is_favorite: task.is_favorite,
                                });
                                task.dirty = false;
                            } catch (err) {
                                console.error('Failed to sync task:', task.id, err);
                            }
                        }
                    })
                );
            }
        }, 30000);

        return () => clearInterval(interval);
    }, []);
    return null; // This component does not render anything
}

export default HistorySync;