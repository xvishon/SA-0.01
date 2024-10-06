"use client"

import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';

type PageWidth = 'narrow' | 'medium' | 'wide';

interface SettingsContextType {
  pageWidth: PageWidth;
  setPageWidth: (width: PageWidth) => void;
  ollamaModel: string;
  setOllamaModel: (model: string) => void;
  ollamaModels: string[];
  refreshOllamaModels: () => Promise<void>;
  isOllamaAvailable: boolean;
  isLoadingModels: boolean;
  ollamaError: string | null;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [pageWidth, setPageWidth] = useState<PageWidth>('medium');
  const [ollamaModel, setOllamaModel] = useState<string>('');
  const [ollamaModels, setOllamaModels] = useState<string[]>([]);
  const [isOllamaAvailable, setIsOllamaAvailable] = useState(false);
  const [isLoadingModels, setIsLoadingModels] = useState(false);
  const [ollamaError, setOllamaError] = useState<string | null>(null);

  const refreshOllamaModels = useCallback(async () => {
    setIsLoadingModels(true);
    setOllamaError(null);
    try {
      const response = await fetch('/api/ollama?path=/api/tags');
      if (response.status === 503) {
        setIsOllamaAvailable(false);
        throw new Error('Ollama service is not available');
      }
      if (!response.ok) {
        throw new Error('Failed to fetch Ollama models');
      }
      const data = await response.json();
      if (data.models && Array.isArray(data.models)) {
        const modelNames = data.models.map((model: { name: string }) => model.name);
        setOllamaModels(modelNames);
        if (modelNames.length > 0 && !ollamaModel) {
          setOllamaModel(modelNames[0]);
        }
        setIsOllamaAvailable(true);
      } else {
        throw new Error('No models found in the response');
      }
    } catch (error) {
      console.error('Error fetching Ollama models:', error);
      setIsOllamaAvailable(false);
      setOllamaError(error.message);
    } finally {
      setIsLoadingModels(false);
    }
  }, [ollamaModel]);

  useEffect(() => {
    refreshOllamaModels();
  }, [refreshOllamaModels]);

  return (
    <SettingsContext.Provider value={{
      pageWidth,
      setPageWidth,
      ollamaModel,
      setOllamaModel,
      ollamaModels,
      refreshOllamaModels,
      isOllamaAvailable,
      isLoadingModels,
      ollamaError,
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