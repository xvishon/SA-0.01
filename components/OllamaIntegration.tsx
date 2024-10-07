import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RefreshCw } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface OllamaIntegrationProps {
  onContinue: (model: string, prompt: string) => Promise<any>;
  content: string;
}

const OllamaIntegration: React.FC<OllamaIntegrationProps> = ({ onContinue, content }) => {
  const [models, setModels] = useState<string[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchModels = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/ollama?path=/api/tags');
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch Ollama models');
      }
      const data = await response.json();
      if (data.models) {
        setModels(data.models.map((model: { name: string }) => model.name));
        if (data.models.length > 0 && !selectedModel) {
          setSelectedModel(data.models[0].name);
        }
      } else {
        throw new Error('No models found in the response');
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error fetching Ollama models:', error.message);
        setError(`Failed to fetch Ollama models: ${error.message}. Make sure Ollama is running locally.`);
      } else {
        console.error('Unknown error fetching Ollama models');
        setError('Unknown error occurred while fetching Ollama models.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchModels();
  }, []);

  const handleContinue = async () => {
    if (selectedModel) {
      setIsLoading(true);
      try {
        const result = await onContinue(selectedModel, content); 
        if (!result) {
          throw new Error('Failed to generate content with Ollama');
        }
      } catch (error) {
        if (error instanceof Error) {
          console.error('Error generating content with Ollama:', error.message);
          setError(`Failed to generate content: ${error.message}. Make sure Ollama is running locally.`);
        } else {
          console.error('Unknown error generating content');
          setError('Unknown error occurred during content generation.');
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="flex items-center space-x-4 mt-4">
      <Select value={selectedModel} onValueChange={setSelectedModel}>
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
      <Button onClick={handleContinue} className="bg-accent text-accent-foreground hover:bg-accent/90" disabled={!selectedModel || isLoading}>
        AI Continue
      </Button>
    </div>
  );
};

export default OllamaIntegration;
