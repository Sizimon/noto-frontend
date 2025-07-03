'use client';

import { useTasks } from '../context/TasksProvider';
import { useTags } from '../context/TagsProvider';

export function useHandleRemoveTag() {
    const { allTasks, setAllTasks } = useTasks();
    const { addRemovedTag } = useTags();

    return (taskId: string, tagId: string) => {
        const updatedTasks = allTasks.map(task => {
            if (task.id === taskId) {
                const originalTags = task.tags || [];
                const newTags = originalTags.filter((tag: any) => tag.id !== tagId) || [];
                const removedTags = originalTags.filter((tag: any) => tag.id === tagId);

                removedTags.forEach((tag: any) => addRemovedTag(tag));

                const updateRemovedTags = [...(task.removedTags || []), ...removedTags];
                return { ...task, tags: newTags, removedTags: updateRemovedTags, dirty: true };
            }
            return task;
        });
        setAllTasks(updatedTasks);
    };
};