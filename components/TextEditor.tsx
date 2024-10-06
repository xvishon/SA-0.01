"use client"

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { Button } from '@/components/ui/button';
import debounce from 'lodash/debounce';
import { Bold, Italic, Strikethrough, Eraser } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';
import OllamaIntegration from './OllamaIntegration';

interface TextEditorProps {
  bookId: number;
  initialContent: string;
  onContentChange: (content: string) => void;
}

const TextEditor: React.FC<TextEditorProps> = ({ bookId, initialContent, onContentChange }) => {
  // ... (rest of the component code remains the same)
};

export default React.memo(TextEditor);