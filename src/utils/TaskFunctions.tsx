'use client';

import { useTasks } from "@/context/TasksProvider";
import { useTags } from "@/context/TagsProvider";
import { tasksAPI } from "@/connections/api";

export function useHandleDeleteTask() {
    const { allTasks, setAllTasks } = useTasks();
    const { setPendingTags, setRemovedTags } = useTags();

    const removeTaskTags = (taskId: number) => {
        setPendingTags(prev => {
            const { [taskId]: removedValue, ...rest } = prev; // Destructure to remove taskId from pending tags and return the rest
            return rest;
        });
        setRemovedTags(prev => {
            const { [taskId]: removedValue, ...rest } = prev; // Destructure to remove taskId from removed tags and return the rest
            return rest;
        });
    }

    return async (taskId: number) => {
        if (!taskId) {
            console.error("Task ID is required for deletion.");
            return;
        }
        try {
            await tasksAPI.delete(taskId);
            setAllTasks(allTasks.filter(task => task.id !== taskId));
            // Remove pending and removed tags for the deleted task
            removeTaskTags(taskId);

        } catch (error) {
            console.error("Error deleting task:", error);
        }
    };
}