"use client"

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useSettings } from '@/contexts/SettingsContext';

export default function TestPage() {
  const { pageWidth } = useSettings();
  const [testComponent, setTestComponent] = useState<React.ReactNode | null>(null);

  const renderTestComponent = () => {
    // This is where you would render your test component
    setTestComponent(
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Test Component</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This is where your test component would be rendered.</p>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className={`container mx-auto p-4 ${pageWidth === 'narrow' ? 'max-w-2xl' : pageWidth === 'medium' ? 'max-w-4xl' : 'max-w-6xl'}`}>
      <h1 className="text-3xl font-bold mb-6">Component Testing Ground</h1>
      <Card>
        <CardHeader>
          <CardTitle>Test Your Component</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">Use this area to test new components before implementation.</p>
          <Button onClick={renderTestComponent}>Render Test Component</Button>
        </CardContent>
      </Card>
      {testComponent}
    </div>
  );
}