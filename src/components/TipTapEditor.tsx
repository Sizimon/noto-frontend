'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import React, { useEffect } from 'react';

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
            <div className='flex gap-2 mb-2 justify-center items-center'>
                <button
                    type="button"
                    className="px-2 py-1 rounded bg-zinc-300 dark:bg-zinc-700 text-xs"
                    onClick={() => editor?.chain().focus().toggleBold().run()}
                >
                    Bold
                </button>
                <button
                    type="button"
                    className="px-2 py-1 rounded bg-zinc-300 dark:bg-zinc-700 text-xs"
                    onClick={() => editor?.chain().focus().toggleItalic().run()}
                >
                    Italic
                </button>
                <button
                    type="button"
                    className="px-2 py-1 rounded bg-zinc-300 dark:bg-zinc-700 text-xs"
                    onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
                >
                    Code Block
                </button>
            </div>
            <EditorContent 
                editor={editor} 
                className="
                    bg-zinc-200 text-zinc-600 p-4 rounded-lg shadow-lg
                    dark:bg-zinc-900 dark:text-zinc-300 dark:shadow-black

                "/>
        </div>
    )
}