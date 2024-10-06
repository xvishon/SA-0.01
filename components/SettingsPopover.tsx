"use client"

import React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Settings, RefreshCw, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

const SettingsPopover: React.FC = () => {
  const { pageWidth, setPageWidth, ollamaModel, setOllamaModel, refreshOllamaModels, isOllamaAvailable } = useSettings();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon">
          <Settings className="h-5 w-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Settings</h4>
            <p className="text-sm text-muted-foreground">
              Customize your writing environment
            </p>
          </div>
          <div className="grid gap-2">
            <div className="grid grid-cols-3 items-center gap-4">
              <label htmlFor="width">Page Width</label>
              <Select value={pageWidth} onValueChange={(value: any) => setPageWidth(value)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select width" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="narrow">Narrow</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="wide">Wide</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <Collapsible className="mt-4">
          <CollapsibleTrigger asChild>
            <Button variant="outline" className="flex justify-between w-full">
              Ollama Settings
              <ChevronDown className="h-4 w-4" />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span>Model:</span>
                <Select value={ollamaModel} onValueChange={setOllamaModel}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Select model" />
                  </SelectTrigger>
                  <SelectContent>
                    {/* Add Ollama model options here */}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={refreshOllamaModels} className="w-full">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh Models
              </Button>
              {!isOllamaAvailable && (
                <p className="text-sm text-muted-foreground flex items-center">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Ollama is not available
                </p>
              )}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </PopoverContent>
    </Popover>
  );
};

export default SettingsPopover;