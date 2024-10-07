import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RefreshCw, AlertCircle } from "lucide-react";
import { useSettings } from "@/contexts/SettingsContext";

interface OllamaIntegrationProps {
  onContinue: (model: string, prompt: string) => void;
  content: string;
}

const OllamaIntegration: React.FC<OllamaIntegrationProps> = ({ onContinue, content }) => {
  const { ollamaModel, setOllamaModel, ollamaModels, refreshOllamaModels, isOllamaAvailable } = useSettings();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!ollamaModel) {
      refreshOllamaModels();
    }
  }, [ollamaModel, refreshOllamaModels]);

  const handleContinue = async () => {
    if (ollamaModel && isOllamaAvailable) {
      setIsLoading(true);
      try {
        const prompt = `Continue the following text:\n\n${content}\n\nContinuation:`;
        await onContinue(ollamaModel, prompt);
      } catch (error) {
        // Handle error here if needed
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (!isOllamaAvailable) {
    return (
      <div className="space-y-4 mt-4">
        <p className="text-sm text-muted-foreground flex items-center">
          <AlertCircle className="h-4 w-4 mr-2" />
          AI features are not available. Ollama is not running or cannot be reached.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 mt-4">
      <div className="flex items-center space-x-4">
        <Select
          value={ollamaModel}
          onValueChange={setOllamaModel}
          disabled={isLoading}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select a model" />
          </SelectTrigger>
          <SelectContent>
            {ollamaModels.map((model) => (
              <SelectItem key={model} value={model}>
                {model}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={refreshOllamaModels} variant="outline" size="icon" disabled={isLoading}>
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
        </Button>
        <Button
          onClick={handleContinue}
          className="bg-accent text-accent-foreground hover:bg-accent/90"
          disabled={!ollamaModel || isLoading}
        >
          AI Continue
        </Button>
      </div>
    </div>
  );
};

export default OllamaIntegration;
