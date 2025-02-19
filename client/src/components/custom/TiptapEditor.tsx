'use client';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import Heading from '@tiptap/extension-heading';
import Highlight from '@tiptap/extension-highlight';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import ToolBar from '../ui/Toolbar';

type TiptapProps = {
    description?: string;
    onChange: (value: string) => void;
};

export default function RichTextEditor({ description, onChange }: TiptapProps) {
    const editor = useEditor({
        extensions: [
            StarterKit.configure(),
            TextAlign.configure({
                types: ['heading', 'paragraph']
            }),
            Heading.configure({
                levels: [1, 2, 3]
            }),
            OrderedList.configure({
                HTMLAttributes: {
                    class: 'list-decimal ml-3'
                }
            }),
            BulletList.configure({
                HTMLAttributes: {
                    class: 'list-disc ml-3'
                }
            }),
            Highlight
        ],
        content: description,
        editorProps: {
            attributes: {
                class: 'min-h-[156px] border rounded-md bg-slate-50 py-2 px-3'
            }
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        }
    });

    return (
        <div>
            <ToolBar editor={editor} />
            <EditorContent editor={editor} />
        </div>
    );
}
