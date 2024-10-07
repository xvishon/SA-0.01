import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { Button } from "@/components/ui/button";
import { debounce } from "lodash";
import { Bold, Italic, Strikethrough, Eraser } from "lucide-react";
import { useSettings } from "@/contexts/SettingsContext";
import OllamaIntegration from "./OllamaIntegration";

interface TextEditorProps {
  bookId: number;
  initialContent: string;
  content: string;
  setContent: React.Dispatch<React.SetStateAction<string>>;
  onContentChange: (content: string) => void;
}

const TextEditor: React.FC<TextEditorProps> = ({
  bookId,
  initialContent,
  onContentChange,
}) => {
  const [content, setContent] = useState(initialContent);
  const { isOllamaAvailable } = useSettings();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleAIContinue = async (model: string) => {
    if (editor) {
      const currentContent = editor.getText();
      try {
        const response = await fetch("/api/ollama", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: model,
            prompt: currentContent,
            stream: false,
          }),
        });

        const data = await response.json();
        if (data.response) {
          editor.commands.setContent(currentContent + " " + data.response);
          setContent(editor.getHTML());
          setErrorMessage(null); // Clear error message on success
        }
      } catch (error) {
        console.error("Error generating content with Ollama:", error);
        setErrorMessage("Failed to generate content: Failed to generate content with Ollama. Make sure Ollama is running locally."); // Set error message
      }
    }
  };

  const handleContentUpdate = useCallback(
    (newContent: string) => {
      setContent(newContent);
      onContentChange(newContent);
    },
    [onContentChange]
  );

  const debouncedContentUpdate = useMemo(
    () => debounce(handleContentUpdate, 300),
    [handleContentUpdate]
  );

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Start writing your magical tome...",
      }),
    ],
    content: content,
    onUpdate: ({ editor }) => {
      debouncedContentUpdate(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl focus:outline-none max-w-none",
      },
    },
    immediatelyRender: false,
  });

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
        <EditorContent
          editor={editor}
          className="min-h-[200px] focus:outline-none"
        />
      </div>

      <div className="flex justify-between items-center flex-wrap gap-2">
        <div className="flex space-x-2">
          <Button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={editor.isActive("bold") ? "is-active" : ""}
          >
            <Bold className="h-4 w-4" />
          </Button>

          <Button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={editor.isActive("italic") ? "is-active" : ""}
          >
            <Italic className="h-4 w-4" />
          </Button>

          <Button
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={editor.isActive("strike") ? "is-active" : ""}
          >
            <Strikethrough className="h-4 w-4" />
          </Button>

          <Button onClick={() => editor.chain().focus().unsetAllMarks().run()}>
            <Eraser className="h-4 w-4" />
          </Button>
        </div>

        <OllamaIntegration
          content={content}
          onContinue={handleAIContinue}
        />
      </div>

      {errorMessage && (
        <div className="text-yellow-500 font-bold mt-4">
          {errorMessage}
        </div>
      )}
    </div>
  );
};

export default React.memo(TextEditor);
