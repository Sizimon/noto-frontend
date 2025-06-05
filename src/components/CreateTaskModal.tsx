import React from 'react';
import { motion } from 'framer-motion';
import { FaRegStickyNote, FaRegListAlt } from "react-icons/fa";
import { MdOutlineViewKanban } from "react-icons/md";

interface CreateTaskModalProps {
    handleModalClose: () => void;
}

const CreateTaskModal: React.FC<CreateTaskModalProps> = ({ handleModalClose }) => {
    return (
        <motion.div
            className='fixed inset-0 flex items-center justify-center bg-black/75 z-10'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleModalClose}
        >
            <motion.div
                className='bg-white text-white dark:bg-zinc-900 dark:text-white rounded-lg shadow-lg p-8 w-1/3'
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
            >
                <div
                    className='flex flex-row items-center justify-center text-center space-x-4'>
                    <div className="flex flex-col items-center bg-amber-600 w-1/4 rounded-sm p-4 transition-all duration-300 hover:bg-amber-500 cursor-pointer">
                        <FaRegStickyNote className="text-white text-2xl" />
                        <h2>Create Note</h2>
                    </div>
                    <div className="flex flex-col items-center bg-amber-600 w-1/4 rounded-sm p-4 transition-all duration-300 hover:bg-amber-500 cursor-pointer">
                        <FaRegListAlt className="text-white text-2xl" />
                        <h2>Create List</h2>
                    </div>
                    <div className="flex flex-col items-center bg-amber-600 w-1/4 rounded-sm p-4 transition-all duration-300 hover:bg-amber-500 cursor-pointer">
                        <MdOutlineViewKanban className="text-white text-2xl" />
                        <h2>Create Kanban</h2>
                    </div>
                </div>
            </motion.div>

        </motion.div>
    )
}

export default CreateTaskModal;