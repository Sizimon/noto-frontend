'use client';

import { useEffect, useRef } from "react";
import { userAPI } from "@/connections/api";
import { tasksAPI } from "@/connections/api";
import { useTasks } from "@/context/Tasks/TasksProvider";
import { useTags } from "@/context/Tags/TagsProvider";
import { useAuth } from "@/context/Auth/AuthProvider";

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

    // Update the ref whenever allTasks changes
    // This ensures that the latest tasks are always available in the interval callback
    useEffect(() => {
        userRef.current = user;
        initialLastViewedTasksRef.current = initialLastViewedTasks;
        allTasksRef.current = allTasks;
        removedTagsRef.current = removedTags;
        pendingTagsRef.current = pendingTags;
        tagsRef.current = tags;
    }, [user, allTasks, removedTags, pendingTags, tags, initialLastViewedTasks]);

    // console.log('All found tags:', tags);
    // console.log('Pending tags:', pendingTags);
    // console.log('Removed tags:', removedTags);

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
            // SYNC LAST VIEWED TASKS FROM CONTEXT TO THE SERVER
            const currentUser = userRef.current;
            // console.log(initialLastViewedTasksRef.current, currentUser?.lastViewedTasks);
            if (arraysEqual(initialLastViewedTasksRef.current, currentUser?.lastViewedTasks)) {
                return;
            }
            if (currentUser && Array.isArray(currentUser.lastViewedTasks)) {
                try {
                    await userAPI.updateLastViewed(currentUser.lastViewedTasks);
                    setInitialLastViewedTasks(currentUser.lastViewedTasks);
                    initialLastViewedTasksRef.current = currentUser.lastViewedTasks; // Update the ref to the new last viewed tasks
                } catch (err) {
                    console.error('Failed to sync lastViewedTasks:', err);
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
                                            // Only add tags that have a real ID
                                            if (tag.id) {
                                                await tasksAPI.addExistingTag(taskId, tag.id);
                                            }
                                            clearPendingTags(taskId, tag.id);
                                        })
                                    );
                                    refreshTags(); // Refresh tags after adding
                                }

                                // console.log('Syncing task:', taskId, 'removedTags:', removed);
                                // This ensures that any tags that were removed in the UI are also removed on the server

                                if (removed && removed.length > 0) {
                                    await Promise.all(
                                        removed.map(async (tag) => {
                                            // Only remove tags that have a real ID
                                            if (tag.id) {
                                                await tasksAPI.removeTag(taskId, tag.id);
                                            }
                                            clearRemovedTags(taskId, tag.id);
                                        })
                                    );
                                    refreshTags();
                                }
                                task.dirty = false; // Reset dirty flag after syncing
                            }
                        } catch (err) {
                            console.error('Failed to sync task:', task.id, err);
                        }

                    })
                );
            }
        }, 5000); // Sync every 5 seconds

        return () => clearInterval(interval);
    }, []);
    return null; // This component does not render anything
}

export default HistorySync;