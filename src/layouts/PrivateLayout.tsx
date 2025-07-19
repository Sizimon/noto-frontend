'use client';

import { TasksProvider } from '@/context/TasksProvider';
import { TagsProvider } from '@/context/TagsProvider';
import HistorySync from '@/components/GlobalFunctions/HistorySync';

export default function PrivateLayout({ children }: { children: React.ReactNode }) {
  return (
    <TasksProvider>
      <TagsProvider>
        {children}
        <HistorySync />
      </TagsProvider>
    </TasksProvider>
  );
}