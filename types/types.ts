// In types.ts
export interface CodexEntry {
    id: string;
    category: string;
    title: string;
    content: string;
    name: string;
    description: string;
  }
  
  export interface TextEditorProps {
    bookId: string;
    content: string;
    setContent: (content: string) => void;
  }
  
  // API Response Types
export interface Book {
  id: string;
  title: string;
  author: string;
  content: string;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export type Optional<T> = T | null;
