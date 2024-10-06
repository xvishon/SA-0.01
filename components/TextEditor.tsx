"use client"

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { Button } from '@/components/ui/button';
import { debounce } from 'lodash';
import { Bold, Italic, Strikethrough, Eraser } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';

interface TextEditorProps {
  bookId: number;
  initialContent: string;
  onContentChange: (content: string) => void;
}

const TextEditor: React.FC<TextEditorProps> = ({ bookId, initialContent, onContentChange }) => {
  const [localContent, setLocalContent] = useState(initialContent);
  const { ollamaModel, isOllamaAvailable } = useSettings();

  const debouncedOnContentChange = useMemo(
    () => debounce(onContentChange, 300),
    [onContentChange]
  );

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Start writing your magical tome...',
      }),
    ],
    content: localContent,
    onUpdate: ({ editor }) => {
      const newContent = editor.getHTML();
      setLocalContent(newContent);
      debouncedOnContentChange(newContent);
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl focus:outline-none max-w-none',
      },
    },
    // Add this line to resolve the SSR error
    immediatelyRender: false,
  });

  useEffect(() => {
    if (editor && initialContent !== editor.getHTML()) {
      editor.commands.setContent(initialContent, false);
      setLocalContent(initialContent);
    }
  }, [initialContent, editor]);

  const handleAIContinue = useCallback(() => {
    // Implement AI continue logic here
    console.log('AI Continue with model:', ollamaModel);
  }, [ollamaModel]);

  if (!editor) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="border border-input bg-background/50 rounded-md p-4">
        <EditorContent editor={editor} className="min-h-[200px] focus:outline-none" />
      </div>
      <div className="flex justify-between items-center flex-wrap gap-2">
        <div className="flex space-x-2">
          <Button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={editor.isActive('bold') ? 'is-active' : ''}
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={editor.isActive('italic') ? 'is-active' : ''}
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={editor.isActive('strike') ? 'is-active' : ''}
          >
            <Strikethrough className="h-4 w-4" />
          </Button>
          <Button onClick={() => editor.chain().focus().unsetAllMarks().run()}>
            <Eraser className="h-4 w-4" />
          </Button>
        </div>
        <Button
          onClick={handleAIContinue}
          disabled={!isOllamaAvailable}
          className="bg-accent text-accent-foreground hover:bg-accent/90"
        >
          AI Continue
        </Button>
      </div>
    </div>
  );
};

export default React.memo(TextEditor);