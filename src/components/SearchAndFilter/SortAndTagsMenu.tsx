import { FaCaretDown } from "react-icons/fa";

export default function SortAndTagsMenu({
    sortMenuOpen, handleSortMenuToggle, sortOrder, setSortOrder, sortRef,
    tagsMenuOpen, handleTagsMenuToggle, tagsRef
}: any) {
    return (
        <div className='flex flex-row items-center justify-center space-x-4'>
            {/* Sort */}
            <div className="relative items-center gap-2">
                <button
                    className="flex text-sm items-center font-semibold uppercase text-black cursor-pointer hover:text-amber-600 transition-all duration-300 dark:text-white"
                    onClick={handleSortMenuToggle}
                >
                    Sort
                    <FaCaretDown />
                </button>
                {sortMenuOpen && (
                    <div className="absolute left-0 top-full mt-2 w-32 bg-zinc-100 dark:bg-zinc-800 text-black rounded shadow-lg p-2 dark:text-white md:w-48" ref={sortRef}>
                        <label className="flex items-center gap-1 text-xs">
                            <input type="radio" name="sort" value="alphabetical" className="accent-amber-600"
                                checked={sortOrder === 'alphabetical'}
                                onChange={() => setSortOrder('alphabetical')} /> A-Z
                        </label>
                        <label className="flex items-center gap-1 text-xs">
                            <input type="radio" name="sort" value="date" className="accent-amber-600"
                                checked={sortOrder === 'date'}
                                onChange={() => setSortOrder('date')} /> Date Created
                        </label>
                        <label className="flex items-center gap-1 text-xs">
                            <input type="radio" name="sort" value="favorite" className="accent-amber-600"
                                checked={sortOrder === 'favorite'}
                                onChange={() => setSortOrder('favorite')} /> Filter by favorites.
                        </label>
                    </div>
                )}
            </div>
            {/* Tags */}
            <div className="relative items-center gap-2">
                <button
                    className="flex text-sm items-center font-semibold uppercase text-black cursor-pointer hover:text-amber-600 transition-all duration-300 dark:text-white"
                    onClick={handleTagsMenuToggle}
                >
                    Tags
                    <FaCaretDown />
                </button>
                {tagsMenuOpen && (
                    <div className="absolute left-0 top-full mt-2 w-32 bg-zinc-100 dark:bg-zinc-950 text-black rounded shadow-lg p-2 dark:text-white md:w-48" ref={tagsRef}>
                        <label className="flex items-center gap-1 text-xs">
                            <input type="checkbox" className="accent-amber-600" /> CRON
                        </label>
                        <label className="flex items-center gap-1 text-xs">
                            <input type="checkbox" className="accent-amber-600" /> SSL
                        </label>
                        <label className="flex items-center gap-1 text-xs">
                            <input type="checkbox" className="accent-amber-600" /> DEV
                        </label>
                    </div>
                )}
            </div>
        </div>
    );
}