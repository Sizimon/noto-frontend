'use client';

import { useTasks } from "@/context/TasksProvider";
import { tasksAPI } from "@/connections/api";

export function useHandleDeleteTask() {
    const { allTasks, setAllTasks } = useTasks();

    return async (taskId: number) => {
        if (!taskId) {
            console.error("Task ID is required for deletion.");
            return;
        }
        try {
            await tasksAPI.delete(taskId);
            setAllTasks(allTasks.filter(task => task.id !== taskId));
        } catch (error) {
            console.error("Error deleting task:", error);
        }
    };
}