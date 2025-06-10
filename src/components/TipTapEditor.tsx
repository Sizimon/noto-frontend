'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import React, { useEffect } from 'react';
import { FaBold, FaItalic, FaHeading, FaStrikethrough, FaQuoteLeft, FaList, FaListOl } from "react-icons/fa";
import { FaT, FaCode } from "react-icons/fa6";

interface TipTapEditorProps {
    content: string;
    onChange: (content: string) => void;
}

export default function TipTapEditor({ content, onChange }: TipTapEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Placeholder.configure({
                placeholder: 'Get Creative...'
            }),
        ],
        content,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
    });

    useEffect(() => {
        if (editor && content !== editor.getHTML()) {
            editor.commands.setContent(content || '');
        }
    }, [content])

    return (
        <div className="w-full max-w-4xl">
            <div className='flex gap-2 mb-4 justify-center items-center'>
                <button
                    type="button"
                    className={`
                        p-2 rounded-full text-xs
                        ${editor?.isActive('paragraph') ? 'bg-amber-500 text-white' : 'bg-zinc-300 dark:bg-zinc-700'}`}
                    onClick={() => editor?.chain().focus().setParagraph().run()}
                >
                    <FaT />
                </button>
                <button
                    type="button"
                    className={`
                        p-2 rounded-full text-xs
                        ${editor?.isActive('heading', { level: 1 }) ? 'bg-amber-500 text-white' : 'bg-zinc-300 dark:bg-zinc-700'}`}
                    onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
                >
                    <FaHeading />
                </button>
                <button
                    type="button"
                    className={`
                        p-2 rounded-full text-xs
                        ${editor?.isActive('bold') ? 'bg-amber-500 text-white' : 'bg-zinc-300 dark:bg-zinc-700'}`}
                    onClick={() => editor?.chain().focus().toggleBold().run()}
                >
                    <FaBold />
                </button>
                <button
                    type="button"
                    className={`
                        p-2 rounded-full text-xs
                        ${editor?.isActive('italic') ? 'bg-amber-500 text-white' : 'bg-zinc-300 dark:bg-zinc-700'}`}
                    onClick={() => editor?.chain().focus().toggleItalic().run()}
                >
                    <FaItalic />
                </button>
                <button
                    type="button"
                    className={`
                        p-2 rounded-full text-xs
                        ${editor?.isActive('strike') ? 'bg-amber-600 text-white' : 'bg-zinc-300 dark:bg-zinc-700'}`}
                    onClick={() => editor?.chain().focus().toggleStrike().run()}
                >
                    <FaStrikethrough />
                </button>
                <button
                    type="button"
                    className={`
                        p-2 rounded-full text-xs
                        ${editor?.isActive('bulletList') ? 'bg-amber-500 text-white' : 'bg-zinc-300 dark:bg-zinc-700'}`}
                    onClick={() => editor?.chain().focus().toggleBulletList().run()}
                >
                    <FaList />
                </button>
                <button
                    type="button"
                    className={`
                        p-2 rounded-full text-xs
                        ${editor?.isActive('orderedList') ? 'bg-amber-500 text-white' : 'bg-zinc-300 dark:bg-zinc-700'}`}
                    onClick={() => editor?.chain().focus().toggleOrderedList().run()}
                >
                    <FaListOl />
                </button>
                <button
                    type="button"
                    className={`
                        p-2 rounded-full text-xs
                        ${editor?.isActive('blockquote') ? 'bg-amber-500 text-white' : 'bg-zinc-300 dark:bg-zinc-700'}`}
                    onClick={() => editor?.chain().focus().toggleBlockquote().run()}
                >
                    <FaQuoteLeft />
                </button>
                <button
                    type="button"
                    className={`
                        p-2 rounded-full text-xs
                        ${editor?.isActive('code') ? 'bg-amber-500 text-white' : 'bg-zinc-300 dark:bg-zinc-700'}`}
                    onClick={() => editor?.chain().focus().toggleCode().run()}
                >
                    <FaCode />
                </button>
            </div>
            <EditorContent 
                editor={editor} 
                className="
                    bg-zinc-200 text-zinc-600 p-4 rounded-lg text-sm
                    dark:bg-zinc-900 dark:text-zinc-300
                    md:text-lg
                "/>
        </div>
    )
}