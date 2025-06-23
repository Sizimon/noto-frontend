import TaskCard from './TaskCard';

export default function TaskGrid({
    filteredTasks,
    creatingTagForId,
    setCreatingTagForId,
    newTag,
    setNewTag,
    noteMenuOpen,
    setNoteMenuOpen,
    noteMenuRef,
    
    // Handler Functions
    handleNoteMenuToggle,
    handleCreateTag,
    handleTaskClick,
    handleFavoriteToggle
}: any) {
    return (
        <div className='grid grid-flow-row justify-items-center w-full'>
            {filteredTasks.length > 0 ? (
                filteredTasks.map((card: any, index: number) => (
                    <TaskCard
                        key={card.id || index}
                        card={card}
                        creatingTagForId={creatingTagForId}
                        setCreatingTagForId={setCreatingTagForId}
                        newTag={newTag}
                        setNewTag={setNewTag}
                        noteMenuOpen={noteMenuOpen}
                        setNoteMenuOpen={setNoteMenuOpen}
                        noteMenuRef={noteMenuRef}

                        // Handlers
                        handleNoteMenuToggle={handleNoteMenuToggle}
                        handleCreateTag={handleCreateTag}
                        handleTaskClick={handleTaskClick}
                        handleFavoriteToggle={handleFavoriteToggle}
                    />
                ))
            ) : (
                <p className='text-gray-500 col-span-5 py-8'>No tasks found.</p>
            )}
        </div>
    );
}