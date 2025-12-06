'use client';

import { useEffect, useRef } from "react";
import { userAPI } from "@/connections/api";
import { tasksAPI } from "@/connections/api";
import { useTasks } from "@/context/Tasks/TasksProvider";
import { useTags } from "@/context/Tags/TagsProvider";
import { useAuth } from "@/context/Auth/AuthProvider";
import { clear } from "console";

const HistorySync = () => {
    const { user, initialLastViewedTasks, setInitialLastViewedTasks } = useAuth();
    const userRef = useRef(user); // Store user in a ref to avoid stale closure issues
    const initialLastViewedTasksRef = useRef(initialLastViewedTasks); // Store initialLastViewedTasks in a ref to avoid stale closure issues

    const { allTasks } = useTasks();
    const allTasksRef = useRef(allTasks); // Store allTasks in a ref to avoid stale closure issues

    const { tags, refreshTags, pendingTags, removedTags, clearPendingTags, clearRemovedTags } = useTags();
    const tagsRef = useRef(tags); // Store tags in a ref to avoid stale closure issues
    const removedTagsRef = useRef(removedTags); // Store removedTags in a ref to avoid stale closure issues
    const pendingTagsRef = useRef(pendingTags); // Store pendingTags in a ref to avoid stale closure issues

    // Update the ref whenever dependencies changes
    // This ensures that the latest tasks are always available in the interval callback
    useEffect(() => {
        userRef.current = user;
        initialLastViewedTasksRef.current = initialLastViewedTasks;
        allTasksRef.current = allTasks;
        removedTagsRef.current = removedTags;
        pendingTagsRef.current = pendingTags;
        tagsRef.current = tags;
    }, [user, allTasks, removedTags, pendingTags, tags, initialLastViewedTasks]);

    // Function to compare two arrays for equality including order
    function arraysEqual(a?: number[], b?: number[]) {
        if (!a || !b) return false;
        if (a.length !== b.length) return false;
        for (let i = 0; i < a.length; i++) {
            if (a[i] !== b[i]) return false;
        }
        return true;
    }

    useEffect(() => {
        const interval = setInterval(async () => {
            const tasks = allTasksRef.current;
            const currentRemovedTags = removedTagsRef.current;
            const currentPendingTags = pendingTagsRef.current;
            const currentUser = userRef.current;

            console.log('🔄 HistorySync running:', {
                tasksCount: tasks?.length || 0,
                removedTagsCount: Object.values(currentRemovedTags).reduce((total, tags) => total + tags.length, 0),
                pendingTagsCount: Object.values(currentPendingTags).reduce((total, tags) => total + tags.length, 0)  
            });

            // SYNC LAST VIEWED TASKS
            if (!arraysEqual(initialLastViewedTasksRef.current, currentUser?.lastViewedTasks)) {
                if (currentUser && Array.isArray(currentUser.lastViewedTasks)) {
                    try {
                        await userAPI.updateLastViewed(currentUser.lastViewedTasks);
                        setInitialLastViewedTasks(currentUser.lastViewedTasks);
                        initialLastViewedTasksRef.current = currentUser.lastViewedTasks;
                    } catch (err) {
                        console.error('Failed to sync lastViewedTasks:', err);
                    }
                }
            }

            // SYNC ALL DIRTY TASKS
            if (tasks && tasks.length > 0) {
                await Promise.all(
                    tasks.map(async (task) => {
                        try {
                            if (task.dirty) {
                                const taskId = task.id;
                                const removed = currentRemovedTags[taskId];
                                const pending = currentPendingTags[taskId];

                                console.log('🔄 Syncing task:', {
                                    taskId,
                                    removedCount: removed?.length || 0,
                                    pendingCount: pending?.length || 0
                                });

                                // Track if all operations succeed
                                let allOperationsSucceeded = true;

                                // Sync basic task data
                                await tasksAPI.edit(task.id, {
                                    title: task.title,
                                    content: task.content,
                                    is_favorite: task.is_favorite,
                                });

                                // Handle pending tags
                                if (pending && pending.length > 0) {
                                    console.log('➕ Adding pending tags to server:', pending.map(t => t.title));

                                    const results = await Promise.allSettled(
                                        pending.map(async (tag) => {
                                            if (tag.id) {
                                                try {
                                                    await tasksAPI.addExistingTag(taskId, tag.id);
                                                    clearPendingTags(taskId, tag.id); // Fixed: was clearRemovedTags
                                                    return { success: true, tagId: tag.id };
                                                } catch (error) {
                                                    console.error('Failed to add existing tag:', tag.id, error);
                                                    return { success: false, tagId: tag.id, error };
                                                }
                                            } else {
                                                clearPendingTags(taskId, tag.id); // Fixed: was clearRemovedTags
                                                return { success: true, tagId: tag.id };
                                            }
                                        })
                                    );

                                    const pendingSucceeded = results.every(result =>
                                        result.status === 'fulfilled' && result.value.success
                                    );

                                    if (!pendingSucceeded) {
                                        console.warn('Some pending tag operations failed for task:', taskId);
                                        allOperationsSucceeded = false;
                                    }
                                }

                                // Handle removed tags
                                if (removed && removed.length > 0) {
                                    console.log('🗑️ Removing tags from server:', removed.map(t => t.title));

                                    const results = await Promise.allSettled(
                                        removed.map(async (tag) => {
                                            if (tag.id) {
                                                try {
                                                    await tasksAPI.removeTag(taskId, tag.id);
                                                    clearRemovedTags(taskId, tag.id);
                                                    return { success: true, tagId: tag.id };
                                                } catch (error) {
                                                    console.error('Failed to remove tag:', tag.id, error);
                                                    return { success: false, tagId: tag.id, error };
                                                }
                                            } else {
                                                clearRemovedTags(taskId, tag.id);
                                                return { success: true, tagId: tag.id };
                                            }
                                        })
                                    );

                                    const removedSucceeded = results.every(result =>
                                        result.status === 'fulfilled' && result.value.success
                                    );

                                    if (!removedSucceeded) {
                                        console.warn('Some tag removals failed for task:', taskId);
                                        allOperationsSucceeded = false;
                                    }
                                }

                                // Only reset dirty flag if ALL operations succeeded
                                if (allOperationsSucceeded) {
                                    task.dirty = false;
                                }
                            }
                        } catch (err) {
                            console.error('❌ Failed to sync task:', task.id, err);
                        }
                    })
                );
            }
        }, 5000);

        return () => clearInterval(interval);
    }, [clearPendingTags, clearRemovedTags, setInitialLastViewedTasks]); // Add dependencies
    return null; // This component does not render anything
}

export default HistorySync;