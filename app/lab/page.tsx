"use client"

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useSettings } from '@/contexts/SettingsContext';

export default function LabPage() {
  const { pageWidth } = useSettings();

  return (
    <div className={`container mx-auto p-4 ${pageWidth === 'narrow' ? 'max-w-2xl' : pageWidth === 'medium' ? 'max-w-4xl' : 'max-w-6xl'}`}>
      <h1 className="text-3xl font-bold mb-6">The Alchemist's Lab</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Experiment #1: Button Styles</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="default">Default Button</Button>
            <Button variant="destructive">Destructive Button</Button>
            <Button variant="outline">Outline Button</Button>
            <Button variant="secondary">Secondary Button</Button>
            <Button variant="ghost">Ghost Button</Button>
            <Button variant="link">Link Button</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Experiment #2: Input Fields</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Input type="text" placeholder="Standard Input" />
            <Input type="password" placeholder="Password Input" />
            <Input type="number" placeholder="Number Input" />
            <Input type="date" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}