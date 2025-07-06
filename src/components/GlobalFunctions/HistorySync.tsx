'use client';

import { useEffect, useRef } from "react";
import { userAPI } from "@/connections/api";
import { tasksAPI } from "@/connections/api";
import { useTasks } from "@/context/TasksProvider";
import { useTags } from "@/context/TagsProvider";

const HistorySync = () => {
    const { allTasks } = useTasks();
    const allTasksRef = useRef(allTasks); // Store allTasks in a ref to avoid stale closure issues

    const { tags, pendingTags, removedTags, clearPendingTags, clearRemovedTags } = useTags();
    const tagsRef = useRef(tags); // Store tags in a ref to avoid stale closure issues
    const removedTagsRef = useRef(removedTags); // Store removedTags in a ref to avoid stale closure issues
    const pendingTagsRef = useRef(pendingTags); // Store pendingTags in a ref to avoid stale closure issues

    // Update the ref whenever allTasks changes
    // This ensures that the latest tasks are always available in the interval callback
    useEffect(() => {
        allTasksRef.current = allTasks;
        removedTagsRef.current = removedTags;
        pendingTagsRef.current = pendingTags;
        tagsRef.current = tags;
    }, [allTasks, removedTags, pendingTags, tags]);

    console.log('All found tags:', tags);
    console.log('Pending tags:', pendingTags);

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
                        try {
                            if (task.dirty) {
                                const taskId = task.id;
                                const removed = removedTagsRef.current[taskId];
                                const pendingTags = pendingTagsRef.current[taskId];
                                await tasksAPI.edit(task.id, {
                                    title: task.title,
                                    content: task.content,
                                    is_favorite: task.is_favorite,
                                });

                                // console.log('Syncing task:', taskId, 'pendingTags:', pendingTags);
                                // This ensures that any new tags are created before removing any existing ones
                                if (pendingTags && pendingTags.length > 0) {
                                    await Promise.all(
                                        pendingTags.map(async (tag) => {
                                            const existingTag = tagsRef.current.find((t) => t.id === tag.id);
                                            if (existingTag) {
                                                await tasksAPI.addExistingTag(taskId, existingTag.id);
                                                clearPendingTags(taskId, tag.id); // Clear pending tag after syncing
                                            } else {
                                                await tasksAPI.createTag(taskId, {
                                                    title: tag.title,
                                                    color: tag.color,
                                                });
                                                clearPendingTags(taskId, tag.id); // Clear pending tag after syncing
                                            }
                                        })
                                    )
                                }

                                // console.log('Syncing task:', taskId, 'removedTags:', removed);
                                // This ensures that any tags that were removed in the UI are also removed on the server

                                if (removed && removed.length > 0) {
                                    await Promise.all(
                                        removed.map(async (tag) => {
                                            await tasksAPI.removeTag(taskId, tag.id);
                                        })
                                    );
                                    clearRemovedTags(taskId);
                                }
                                task.dirty = false; // Reset dirty flag after syncing
                            }
                        } catch (err) {
                            console.error('Failed to sync task:', task.id, err);
                        }

                    })
                );
            }
        }, 30000); // Sync every 30 seconds

        return () => clearInterval(interval);
    }, []);
    return null; // This component does not render anything
}

export default HistorySync;