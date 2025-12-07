import { useTasks } from '@/context/Tasks/TasksProvider';

export function useHandleFavoriteToggle() {
    const { allTasks, setAllTasks } = useTasks();
    return (taskId: number) => {
        const updatedTasks = allTasks.map(task => {
            if (task.id === taskId) {
                return { ...task, is_favorite: !task.is_favorite, dirty: true }; // Toggle the favorite status and mark the task as dirty
            }
            return task;
        });
        setAllTasks(updatedTasks);
    }
}