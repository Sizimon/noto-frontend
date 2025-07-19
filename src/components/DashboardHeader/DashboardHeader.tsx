'use client';

import NotoLogo from '../Logo';
import RecentlyViewed from './RecentlyViewed';
import { useTasks } from '@/context/Tasks/TasksProvider';

export default function DashboardHeader() {
    const { allTasks } = useTasks();

    return (
        <div className="flex flex-col justify-center items-center text-center w-full">
            <h1 className={`text-4xl md:text-6xl flex flex-row items-center justify-center mb-4`}>
                <NotoLogo />
            </h1>
            {allTasks.length > 0 && (
                <RecentlyViewed />
            )}
        </div>
    )
} 