'use client';

import TaskCard from './TaskCard';
import AnimatedList, { AnimatedItem } from '@/blocks/Components/AnimatedList/AnimatedList';


export default function TaskGrid({
    filteredTasks,
    noteMenuOpen,
    setNoteMenuOpen,
    noteMenuRef,

    // Handler Functions
    handleNoteMenuToggle,
    handleCreateTag,
    handleRemoveTag,
    handleTaskClick,
    handleFavoriteToggle
}: any) {
    return (
        // <div className='grid grid-flow-row justify-items-center w-full'>
        <AnimatedList
            className="flex items-center w-full justify-center"
        >
            {filteredTasks.length > 0 ? (
                filteredTasks.map((card: any, index: number) => (
                    <AnimatedItem
                        key={card.id || index}
                        index={index}
                        delay={index * 0.05}
                    >
                        <TaskCard
                            card={card}
                            noteMenuOpen={noteMenuOpen}
                            setNoteMenuOpen={setNoteMenuOpen}
                            noteMenuRef={noteMenuRef}

                            // Handlers
                            handleNoteMenuToggle={handleNoteMenuToggle}
                            handleCreateTag={handleCreateTag}
                            handleRemoveTag={handleRemoveTag}
                            handleTaskClick={handleTaskClick}
                            handleFavoriteToggle={handleFavoriteToggle}
                        />
                    </AnimatedItem>
                ))
            ) : (
                <p className='text-gray-500 col-span-5 py-8'>No tasks found.</p>
            )}
        </AnimatedList>
        // </div>
    );
}