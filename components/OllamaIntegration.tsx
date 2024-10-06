"use client"

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RefreshCw, AlertCircle } from 'lucide-react';

interface OllamaIntegrationProps {
  onContinue: (model: string) => void;
}

const OllamaIntegration: React.FC<OllamaIntegrationProps> = ({ onContinue }) => {
  const [models, setModels] = useState<string[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOllamaAvailable, setIsOllamaAvailable] = useState(true);

  const fetchModels = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/ollama?path=/api/tags');
      if (!response.ok) {
        throw new Error('Failed to fetch Ollama models');
      }
      const data = await response.json();
      if (data.models) {
        setModels(data.models.map((model: { name: string }) => model.name));
        if (data.models.length > 0 && !selectedModel) {
          setSelectedModel(data.models[0].name);
        }
        setIsOllamaAvailable(true);
      } else {
        throw new Error('No models found in the response');
      }
    } catch (error) {
      console.error('Error fetching Ollama models:', error);
      setError(`Failed to fetch Ollama models. AI features are not available.`);
      setIsOllamaAvailable(false);
    } finally {
      setIsLoading(false);
    }
  }, [selectedModel]);

  useEffect(() => {
    fetchModels();
  }, [fetchModels]);

  const handleContinue = async () => {
    if (selectedModel && isOllamaAvailable) {
      onContinue(selectedModel);
    }
  };

  return (
    <div className="space-y-4 mt-4">
      <div className="flex items-center space-x-4">
        <Select
          value={selectedModel}
          onValueChange={setSelectedModel}
          disabled={!isOllamaAvailable || isLoading}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select a model" />
          </SelectTrigger>
          <SelectContent>
            {models.map((model) => (
              <SelectItem key={model} value={model}>
                {model}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={fetchModels} variant="outline" size="icon" disabled={isLoading}>
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
        </Button>
        <Button
          onClick={handleContinue}
          className="bg-accent text-accent-foreground hover:bg-accent/90"
          disabled={!selectedModel || !isOllamaAvailable || isLoading}
        >
          AI Continue
        </Button>
      </div>
      {!isOllamaAvailable && (
        <p className="text-sm text-muted-foreground flex items-center">
          <AlertCircle className="h-4 w-4 mr-2" />
          AI features are not available. Please ensure Ollama is running locally.
        </p>
      )}
    </div>
  );
};

export default OllamaIntegration;