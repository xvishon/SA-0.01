"use client"

import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';

type PageWidth = 'narrow' | 'medium' | 'wide';

interface SettingsContextType {
  pageWidth: PageWidth;
  setPageWidth: (width: PageWidth) => void;
  ollamaModel: string;
  setOllamaModel: (model: string) => void;
  refreshOllamaModels: () => Promise<void>;
  isOllamaAvailable: boolean;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [pageWidth, setPageWidth] = useState<PageWidth>('medium');
  const [ollamaModel, setOllamaModel] = useState<string>('');
  const [isOllamaAvailable, setIsOllamaAvailable] = useState(false);

  const refreshOllamaModels = useCallback(async () => {
    try {
      const response = await fetch('/api/ollama?path=/api/tags');
      if (!response.ok) {
        throw new Error('Failed to fetch Ollama models');
      }
      const data = await response.json();
      if (data.models) {
        setOllamaModel(data.models[0]?.name || '');
        setIsOllamaAvailable(true);
      } else {
        throw new Error('No models found in the response');
      }
    } catch (error) {
      console.error('Error fetching Ollama models:', error);
      setIsOllamaAvailable(false);
    }
  }, []);

  return (
    <SettingsContext.Provider value={{
      pageWidth,
      setPageWidth,
      ollamaModel,
      setOllamaModel,
      refreshOllamaModels,
      isOllamaAvailable,
    }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};