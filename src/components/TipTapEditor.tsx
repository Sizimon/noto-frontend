'use client';

import React, { useEffect } from 'react';

// TipTap Editor
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';

// Icons
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
                        ${editor?.isActive('paragraph') ? 'bg-pop text-white' : 'bg-foreground'}`}
                    onClick={() => editor?.chain().focus().setParagraph().run()}
                >
                    <FaT />
                </button>
                <button
                    type="button"
                    className={`
                        p-2 rounded-full text-xs
                        ${editor?.isActive('heading', { level: 1 }) ? 'bg-pop text-white' : 'bg-foreground'}`}
                    onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
                >
                    <FaHeading />
                </button>
                <button
                    type="button"
                    className={`
                        p-2 rounded-full text-xs
                        ${editor?.isActive('bold') ? 'bg-pop text-white' : 'bg-foreground'}`}
                    onClick={() => editor?.chain().focus().toggleBold().run()}
                >
                    <FaBold />
                </button>
                <button
                    type="button"
                    className={`
                        p-2 rounded-full text-xs
                        ${editor?.isActive('italic') ? 'bg-pop text-white' : 'bg-foreground'}`}
                    onClick={() => editor?.chain().focus().toggleItalic().run()}
                >
                    <FaItalic />
                </button>
                <button
                    type="button"
                    className={`
                        p-2 rounded-full text-xs
                        ${editor?.isActive('strike') ? 'bg-pop text-white' : 'bg-foreground'}`}
                    onClick={() => editor?.chain().focus().toggleStrike().run()}
                >
                    <FaStrikethrough />
                </button>
                <button
                    type="button"
                    className={`
                        p-2 rounded-full text-xs
                        ${editor?.isActive('bulletList') ? 'bg-pop text-white' : 'bg-foreground'}`}
                    onClick={() => editor?.chain().focus().toggleBulletList().run()}
                >
                    <FaList />
                </button>
                <button
                    type="button"
                    className={`
                        p-2 rounded-full text-xs
                        ${editor?.isActive('orderedList') ? 'bg-pop text-white' : 'bg-foreground'}`}
                    onClick={() => editor?.chain().focus().toggleOrderedList().run()}
                >
                    <FaListOl />
                </button>
                <button
                    type="button"
                    className={`
                        p-2 rounded-full text-xs
                        ${editor?.isActive('blockquote') ? 'bg-pop text-white' : 'bg-foreground'}`}
                    onClick={() => editor?.chain().focus().toggleBlockquote().run()}
                >
                    <FaQuoteLeft />
                </button>
                <button
                    type="button"
                    className={`
                        p-2 rounded-full text-xs
                        ${editor?.isActive('code') ? 'bg-pop text-white' : 'bg-foreground'}`}
                    onClick={() => editor?.chain().focus().toggleCode().run()}
                >
                    <FaCode />
                </button>
            </div>
            <EditorContent 
                editor={editor} 
                className="
                    bg-background text-default p-4 rounded-lg text-base
                    md:text-lg
                "/>
        </div>
    )
}