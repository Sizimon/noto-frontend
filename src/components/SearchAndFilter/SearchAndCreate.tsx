import { IoCreateOutline } from 'react-icons/io5';

export default function SearchAndCreate({
    handleModalOpen,
    setSearchInput
}: {
    handleModalOpen: () => void;
    setSearchInput: (value: string) => void;
}) {
    return (
        <div className="flex flex-row items-center justify-center mb-4 md:m-0 md:space-x-4">
            <button
                className='uppercase rounded cursor-pointer transition-all duration-300 hover:text-amber-600'
                onClick={handleModalOpen}
            >
                <IoCreateOutline className='text-2xl md:text-3xl' />
            </button>
            <input
                type="text"
                placeholder="Search..."
                onChange={(e) => setSearchInput(e.target.value)}
                className="border rounded p-2 text-xs border-none bg-white dark:bg-zinc-900 dark:border-zinc-700 outline-none focus:ring-1 focus:ring-amber-500 transition-all duration-300"
            />
        </div>
    )
}