import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useState } from "react";

export const TextEditor = ({
    value,
    onChange,
    disabled = false
}: {
    value?: string;
    onChange: (value: string) => void;
    disabled?: boolean;
}) => {
    const [ isActive, setIsActive ] = useState<{
        bold: boolean,
        italic: boolean
    }>({
        bold: false,
        italic: false
    })

    const editor = useEditor({
        extensions: [StarterKit],
        content: value || "",
        editorProps: {
            attributes: {
                class:
                    "prose max-w-none focus:outline-none min-h-[200px] px-3 py-2 text-gray-800",
            },
        },
        onUpdate: ({ editor }) => {
            const html = editor.getHTML();
            onChange(html);
        },
    });

    useEffect(() => {
        if (!editor) return;

        const update = () => {
            setIsActive({
                bold:
                    editor.isActive("bold") ||
                    !!editor.state.storedMarks?.some(
                        mark => mark.type.name === "bold"
                    ),
                italic:
                    editor.isActive("italic") ||
                    !!editor.state.storedMarks?.some(
                        mark => mark.type.name === "italic"
                    ),
            });
        };

        editor.on("selectionUpdate", update);
        editor.on("transaction", update);

        return () => {
            editor.off("selectionUpdate", update);
            editor.off("transaction", update);
        };
    }, [editor]);

    useEffect(() => {
        if (editor && value !== editor.getHTML()) {
            editor.commands.setContent(value || "");
        }
    }, [value, editor]);

    useEffect(() => {
        if (editor) {
            editor.setEditable(!disabled);
        }
    }, [editor, disabled]);

    if (!editor) return null;

    const buttonClass = (isActive: boolean) =>
        `px-3 py-1 rounded-md text-sm border ${
            isActive
                ? "bg-gray-800 text-white border-gray-800"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
        }`;
    
    return (
        <div className="border border-gray-300 rounded-lg">
            <div className="flex flex-wrap gap-2 p-2 border-b bg-gray-50 rounded-t-lg">
                
                <button
                    onClick={() => {
                        editor.chain().focus().toggleBold().run()
                    }}
                    className={buttonClass(isActive.bold)}
                >
                    Bold
                </button>

                <button
                    onClick={() => {
                        editor.chain().focus().toggleItalic().run()
                    }}
                    className={buttonClass(isActive.italic)}
                >
                    Italic
                </button>

                <button
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    className={buttonClass(editor.isActive("heading", { level: 1 }))}
                >
                    H1
                </button>

                <button
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    className={buttonClass(editor.isActive("heading", { level: 2 }))}
                >
                    H2
                </button>

                <button
                    onClick={() =>
                        editor.chain().focus().toggleBulletList().run()
                    }
                    className={buttonClass(editor.isActive("bulletList"))}
                >
                    • List
                </button>

            <button
                onClick={() =>
                    editor.chain().focus().toggleOrderedList().run()
                }
                className={buttonClass(editor.isActive("orderedList"))}
            >
                1. List
            </button>
            </div>

            <EditorContent
                editor={editor}
                className="bg-white rounded-b-lg prose max-w-none"
            />
        </div>
    );
}