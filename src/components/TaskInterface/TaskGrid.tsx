import TaskCard from './TaskCard';

export default function TaskGrid({
    filteredTasks, creatingTagForId, setCreatingTagForId, newTag, setNewTag, handleCreateTag, handleTaskClick
}: any) {
    return (
        <div className='grid grid-cols-1 grid-flow-row md:grid-cols-5 justify-items-center w-full md:px-4 md:space-x-4'>
            {filteredTasks.length > 0 ? (
                filteredTasks.map((card: any, index: number) => (
                    <TaskCard
                        key={card.id || index}
                        card={card}
                        creatingTagForId={creatingTagForId}
                        setCreatingTagForId={setCreatingTagForId}
                        newTag={newTag}
                        setNewTag={setNewTag}
                        handleCreateTag={handleCreateTag}
                        handleTaskClick={handleTaskClick}
                    />
                ))
            ) : (
                <p className='text-gray-500 col-span-5 py-8'>No tasks found.</p>
            )}
        </div>
    );
}