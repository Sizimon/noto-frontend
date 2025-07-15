'use client';

import RecentlyViewed from './RecentlyViewed';
import { useAuth } from '@/context/AuthProvider';
import { useTasks } from '@/context/TasksProvider';
import SplitText from '@/blocks/TextAnimations/SplitText/SplitText';
import { useState, useMemo } from 'react';

export default function DashboardHeader() {
    const { user } = useAuth();
    const { allTasks } = useTasks();
    console.log('DashboardHeader user:', user);
    const [headerCompleted, setHeaderCompleted] = useState(false);
    const [subHeaderCompleted, setSubHeaderCompleted] = useState(false);

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
                onLetterAnimationComplete={() => setHeaderCompleted(true)}
            />
        );
    }, []);

    const subHeaderSplit = useMemo(() => (
        <SplitText
            text="Welcome back,&nbsp;"
            className="text-lg md:text-3xl font-bold md:my-4"
            delay={150}
            duration={1}
            splitType="chars"
            from={{ opacity: 0, y: 40 }}
            to={{ opacity: 1, y: 0 }}
            threshold={0.1}
            rootMargin="-100px"
            textAlign="center"
            onLetterAnimationComplete={() => setSubHeaderCompleted(true)}
        />
    ), []);



    return (
        <div className="flex flex-col justify-center items-center text-center w-full">
            <h1 className={`text-4xl md:text-6xl flex flex-row items-center justify-center ${!headerCompleted ? 'mb-4' : ''}`}>
                In
                {headerSplit}
                Tasks
            </h1>
            <div
                className={`flex flex-row items-center gap-2 transition-all duration-300 overflow-hidden mb-4
                    ${headerCompleted ? 'max-h-[28px] md:max-h-[36px] opacity-100' : 'max-h-0 opacity-0'}`}
            >
                {headerCompleted && subHeaderSplit}
                {subHeaderCompleted && (
                    <SplitText
                        text={`${user?.username}`}
                        className="text-lg md:text-3xl font-bold md:my-4 text-pop"
                        delay={10}
                        duration={1}
                        splitType="words"
                        from={{ opacity: 0, y: 40 }}
                        to={{ opacity: 1, y: 0 }}
                        threshold={0.1}
                        rootMargin="-100px"
                        textAlign="center"


                    />
                )}
            </div>
            {allTasks.length > 0 && (
                <RecentlyViewed />
            )}
        </div>
    )
} 