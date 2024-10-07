"use client"

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { Button } from '@/components/ui/button';
import { debounce } from 'lodash';
import { Bold, Italic, Strikethrough, Eraser } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';
import OllamaIntegration from './OllamaIntegration';
interface TextEditorProps {
  bookId: number;
  initialContent: string;
  onContentChange: (content: string) => void;
}

const TextEditor: React.FC<TextEditorProps> = ({ bookId, initialContent, onContentChange }) => {
  const [content, setContent] = useState(initialContent);
  const { isOllamaAvailable } = useSettings();
//ai cont
const handleAIContinue = async (model: string) => {
  if (editor) {
    const currentContent = editor.getText();
    try {
      const response = await fetch('/api/ollama', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: model,
          prompt: currentContent,
          stream: false,
        }),
      });
      const data = await response.json();
      if (data.response) {
        editor.commands.setContent(currentContent + ' ' + data.response);
        setContent(editor.getHTML());
      }
    } catch (error) {
      console.error('Error generating content with Ollama:', error);
    }
  }
};


  // Update local content and notify parent component on change
  const handleContentUpdate = useCallback(
    (newContent: string) => {
      setContent(newContent);
      onContentChange(newContent);
    },
    [onContentChange]
  );

  // Debounce content updates to improve performance
  const debouncedContentUpdate = useMemo(
    () => debounce(handleContentUpdate, 300),
    [handleContentUpdate]
  );

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Start writing your magical tome...',
      }),
    ],
    content: content, // Use state variable for content
    onUpdate: ({ editor }) => {
      debouncedContentUpdate(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl focus:outline-none max-w-none',
      },
    },
    immediatelyRender: false,
  });

  // Update editor content when initialContent changes
  useEffect(() => {
    if (editor && initialContent !== editor.getHTML()) {
      editor.commands.setContent(initialContent, false);
      setContent(initialContent);
    }
  }, [initialContent, editor]);

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
          {/* Formatting buttons */}
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
        <OllamaIntegration onContinue={handleAIContinue} />
      </div>
    </div>
  );
};

export default React.memo(TextEditor);