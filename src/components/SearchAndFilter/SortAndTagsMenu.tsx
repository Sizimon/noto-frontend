import { FaCaretDown } from "react-icons/fa";
import { useTags } from "@/context/TagsProvider";
import { motion } from "framer-motion";

export default function SortAndTagsMenu({
    sortMenuOpen, // State boolean to control the visibility of the sort menu
    handleSortMenuToggle, // Function to toggle the sort menu visibility
    sortOrder, // Current sort order state
    setSortOrder, // State Function to update the sort order state
    tagsMenuOpen, // State boolean to control the visibility of the tags menu
    handleTagsMenuToggle, // Function to toggle the tags menu visibility
}: any) {
    const { tags } = useTags();
    const tagVariants = {
        rest: { opacity: 1, scale: 1, x: 0 },
        hover: { opacity: 1, scale: 1, x: 0 },
        initial: { opacity: 0, scale: 0.6, x: 20 },
        exit: { opacity: 0, scale: 0.6, x: -20 },
    };

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
                    <div
                        className="absolute z-50 left-0 top-full mt-2 w-32 bg-zinc-100 text-black rounded shadow-lg p-2
                        dark:bg-zinc-800 dark:text-white
                        md:w-48
                        "
                        onMouseLeave={handleSortMenuToggle}
                    >
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
                    className="flex text-sm items-center font-semibold uppercase text-black cursor-pointer
                    hover:text-amber-600 transition-all duration-300
                    dark:text-white
                    "
                    onClick={handleTagsMenuToggle}
                >
                    Tags
                    <FaCaretDown />
                </button>
                {tagsMenuOpen && (
                    <div
                        className="absolute z-50 left-0 top-full mt-2 w-32 bg-zinc-100 dark:bg-zinc-900 text-black rounded shadow-lg p-4
                        dark:text-white
                        md:w-48
                        "
                        onMouseLeave={handleTagsMenuToggle}
                    >
                        <div className="flex flex-wrap justify-center gap-1">
                            {tags.length > 0 ? (
                                tags.map((tag: any) => (
                                    <motion.span
                                        key={tag.id}
                                        className={`inline-flex items-center text-xs ${tag.color} p-1 rounded cursor-default`}
                                        variants={tagVariants}
                                        initial="initial"
                                        animate="rest"
                                        exit="exit"
                                        whileHover="hover"
                                        onClick={e => e.stopPropagation()}
                                    >
                                        {tag.title}
                                        <motion.button
                                            type="button"
                                            className="whitespace-nowrap overflow-hidden cursor-default"
                                            variants={{
                                                rest: { width: 0, opacity: 0 },
                                                hover: { width: 16, opacity: 1 },
                                            }}
                                            transition={{ duration: 0.2, ease: "easeInOut" }}
                                        >
                                            <span className="text-xs ml-1">X</span>
                                        </motion.button>
                                    </motion.span>
                                ))
                            ) : (
                                <p className="text-xs text-gray-500">No tags available</p>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div >
    );
}