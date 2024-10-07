'use client';

import React, { useEffect, useMemo } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import debounce from 'lodash/debounce';
import { Button } from '@/components/ui/button';
import { Bold, Italic, Strikethrough, Eraser } from 'lucide-react';
import OllamaIntegration from '@/components/OllamaIntegration';


// Interface defining the props for the TextEditor component.
interface TextEditorProps {
  bookId: number;
  initialContent: string;
  onContentChange: (content: string) => void;
}

const TextEditor: React.FC<TextEditorProps> = ({ bookId, initialContent, onContentChange }) => {
  // Initialize the editor with necessary extensions and content
  const editor = useEditor({
    extensions: [StarterKit, Placeholder.configure({ placeholder: 'Start typing your story...' })],
    content: initialContent,
    onUpdate: ({ editor }) => debouncedSave(editor.getHTML()),
  });

  // Debounce function to delay the save action for performance
  const debouncedSave = React.useMemo(() => debounce(onContentChange, 300), [onContentChange]);

  useEffect(() => {
    let isMounted = true;

    // Handle AI continuation logic inside an async function
    const handleAIContinue = async (model: string, prompt: string) => {
      try {
        const response = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ model, prompt }),
        });

        if (!response.ok) {
          console.error('Error from /api/generate:', response.status, await response.text());
          return;
        }

        const reader = response.body!.getReader();
        let result = '';
        let done = false;

        while (!done && isMounted) {
          const { value, done: readerDone } = await reader.read();
          done = readerDone;

          if (value) {
            result += new TextDecoder('utf-8').decode(value);
            // Insert the AI-generated text into Tiptap editor
            if (editor) {
              editor.commands.insertContentAt(editor.state.selection.from, result);
            }
          }
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error('Error during AI continuation:', error.message);
        } else {
          console.error('Unknown error during AI continuation');
        }
      }
    };

    // Cleanup function to cancel any pending operations when the component is unmounted
    return () => {
      isMounted = false;
    };
  }, [editor, onContentChange]);

  if (!editor) {
    return null; // Or a loading spinner/message.
    return null; // Or a loading spinner/message.
  }

  function handleAIContinue(model: string, prompt: string): Promise<any> {
    throw new Error('Function not implemented.');
  }

  return (
    <div className="editor-container">
      {/* Editor toolbar and content go here */}
      {/* Ollama Integration component */}
      <OllamaIntegration content='text' onContinue={handleAIContinue} />
    </div>
  );
};

  return (
    <div className="editor-container">
      <div className="editor-toolbar flex space-x-2 mb-2">
        {/* Bold Button */}
        <Button
          variant="ghost"
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().toggleBold()}
        >
          <Bold className="h-5 w-5" />
        </Button>

        {/* Italic Button */}
        <Button
          variant="ghost"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().toggleItalic()}
        >
          <Italic className="h-5 w-5" />
        </Button>

        {/* Strikethrough Button */}
        <Button
          variant="ghost"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editor.can().toggleStrike()}
        >
          <Strikethrough className="h-5 w-5" />
        </Button>

        {/* Clear Marks Button */}
        <Button
          variant="ghost"
          onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
        >
          <Eraser className="h-5 w-5" />
        </Button>
      </div>

      {/* The editor content */}
      <EditorContent editor={editor} className="editor-content border p-4" />

      {/* Ollama Integration */}
      <OllamaIntegration
        content={editor.getHTML() || ''}  // Ensure content is not null
        onContinue={async (model: string, prompt: string) => {
          try {
            const result = await fetch('/api/generate', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ model, prompt }),
            });

            if (!result.ok) {
              const errorText = await result.text();
              console.error('Error from /api/generate:', result.status, errorText);
            }

            const data = await result.json();
            const data = await result.json();
            return data;
          } catch (error: unknown) {
            if (error instanceof Error) {
              console.error('Error during AI continuation:', error.message);
            } else {
              console.error('Unknown error during AI continuation');
            }
            return null;
          }
        }}
      />
  return (
    <div className="editor-container">
      {/* Your JSX structure here */}
  );

export default React.memo(TextEditor);
