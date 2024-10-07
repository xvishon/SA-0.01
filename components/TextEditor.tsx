"use client";

<<<<<<< Updated upstream
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { Button } from '@/components/ui/button';
import debounce from 'lodash/debounce';
import { Bold, Italic, Strikethrough, Eraser } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';
import OllamaIntegration from './OllamaIntegration';

=======
// Import necessary hooks and libraries
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit"; // Basic text editing features like bold, italic, etc.
import Placeholder from "@tiptap/extension-placeholder"; // Placeholder text extension
import { Button } from "@/components/ui/button"; // Custom button component
import { debounce } from "lodash"; // Utility library to optimize performance
import { Bold, Italic, Strikethrough, Eraser } from "lucide-react"; // Icons for formatting buttons
import { useSettings } from "@/contexts/SettingsContext"; // Custom hook for accessing settings
import OllamaIntegration from "./OllamaIntegration"; // Custom component for AI integration

// Define the props that the TextEditor component will receive
>>>>>>> Stashed changes
interface TextEditorProps {
  bookId: number; // The ID of the book being edited
    initialContent: string; // The initial content of the editor
    content: string; // The actual content of the editor
    setContent: React.Dispatch<React.SetStateAction<string>>;
  onContentChange: (content: string) => void; // Callback to notify the parent component when content changes
}

<<<<<<< Updated upstream
const TextEditor: React.FC<TextEditorProps> = ({ bookId, initialContent, onContentChange }) => {
  // ... (rest of the component code remains the same)
=======


const TextEditor: React.FC<TextEditorProps> = ({
  bookId,
  initialContent,
  onContentChange,
}) => {
  // State to manage the current content of the editor
  const [content, setContent] = useState(initialContent);
  
  // Access the settings using a custom hook, here we're checking if AI is available
  const { isOllamaAvailable } = useSettings();

  // Function to handle AI-generated content (if AI is available)
  const handleAIContinue = async (model: string) => {
    if (editor) {
      const currentContent = editor.getText(); // Get the current text content from the editor
      try {
        // Send a request to the API to generate more content using AI
        const response = await fetch("/api/ollama", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: model, // AI model to use
            prompt: currentContent, // Pass the current content as a prompt
            stream: false,
          }),
        });

        const data = await response.json(); // Get the response data
        if (data.response) {
          // If the AI returns content, append it to the editor's content
          editor.commands.setContent(currentContent + " " + data.response);
          setContent(editor.getHTML()); // Update the state with new content
        }
      } catch (error) {
        console.error("Error generating content with Ollama:", error); // Log any errors
      }
    }
  };

  // Callback to update the local content and notify the parent component about the change
  const handleContentUpdate = useCallback(
    (newContent: string) => {
      setContent(newContent); // Update local state
      onContentChange(newContent); // Notify the parent about the content change
    },
    [onContentChange] // Only recreate this function when `onContentChange` changes
  );

  // Debounce the content update to avoid frequent updates, improving performance
  const debouncedContentUpdate = useMemo(
    () => debounce(handleContentUpdate, 300), // Debounce for 300ms
    [handleContentUpdate]
  );

  // Initialize the editor with the required extensions and content
  const editor = useEditor({
    extensions: [
      StarterKit, // Includes basic text editing features like bold, italic, etc.
      Placeholder.configure({
        placeholder: "Start writing your magical tome...", // Placeholder text for the editor
      }),
    ],
    content: content, // Use the state variable for content
    onUpdate: ({ editor }) => {
      // This function is called whenever the editor content changes
      debouncedContentUpdate(editor.getHTML()); // Debounce the update to avoid performance issues
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl focus:outline-none max-w-none", // Custom classes for styling the editor
      },
    },
    immediatelyRender: false, // Prevent immediate rendering of the editor's content
  });

  // Effect to update the editor's content when `initialContent` changes
  useEffect(() => {
    if (editor && initialContent !== editor.getHTML()) {
      editor.commands.setContent(initialContent, false); // Update the editor's content
      setContent(initialContent); // Update the state
    }
  }, [initialContent, editor]); // Only run this effect when `initialContent` or `editor` changes

  // If the editor hasn't been initialized yet, return null (this prevents rendering errors)
  if (!editor) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* The main editor component where users can type */}
      <div className="border border-input bg-background/50 rounded-md p-4">
        <EditorContent
          editor={editor}
          className="min-h-[200px] focus:outline-none"
        />
      </div>

      {/* Formatting buttons like Bold, Italic, etc. */}
      <div className="flex justify-between items-center flex-wrap gap-2">
        <div className="flex space-x-2">
          {/* Button for bold text */}
          <Button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={editor.isActive("bold") ? "is-active" : ""}
          >
            <Bold className="h-4 w-4" />
          </Button>

          {/* Button for italic text */}
          <Button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={editor.isActive("italic") ? "is-active" : ""}
          >
            <Italic className="h-4 w-4" />
          </Button>

          {/* Button for strikethrough text */}
          <Button
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={editor.isActive("strike") ? "is-active" : ""}
          >
            <Strikethrough className="h-4 w-4" />
          </Button>

          {/* Button to remove all formatting */}
          <Button onClick={() => editor.chain().focus().unsetAllMarks().run()}>
            <Eraser className="h-4 w-4" />
          </Button>
        </div>

        {/* Integration for AI content generation */}
        <OllamaIntegration 
        content={content} 
        onContinue={handleAIContinue} />
      </div>
    </div>
  );
>>>>>>> Stashed changes
};

// Use React.memo to optimize rendering performance (only re-render when props change)
export default React.memo(TextEditor);
