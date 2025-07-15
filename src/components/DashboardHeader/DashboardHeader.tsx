'use client';

import RecentlyViewed from './RecentlyViewed';
import { useTasks } from '@/context/TasksProvider';
import SplitText from '@/blocks/TextAnimations/SplitText/SplitText';
import { useMemo } from 'react';

export default function DashboardHeader() {
    const { allTasks } = useTasks();

    const headerSplit = useMemo(() => {
        return (
            <SplitText
                text="Time"
                className="text-4xl md:text-6xl font-bold text-pop"
                delay={250}
                duration={2}
                ease="elastic.out(1, 0.3)"
                splitType="chars"
                from={{ opacity: 0, y: 40 }}
                to={{ opacity: 1, y: 0 }}
                threshold={0.1}
                rootMargin="-100px"
                textAlign="center"
            />
        );
    }, []);

    return (
        <div className="flex flex-col justify-center items-center text-center w-full">
            <h1 className={`text-4xl md:text-6xl flex flex-row items-center justify-center mb-4`}>
                In
                {headerSplit}
                Tasks
            </h1>
            {allTasks.length > 0 && (
                <RecentlyViewed />
            )}
        </div>
    )
} 