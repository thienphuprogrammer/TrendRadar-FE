'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface CodeBlockProps {
  language: string;
  value: string;
  className?: string;
}

export function CodeBlock({ language, value, className }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className={cn('relative group', className)}>
      <div className="flex items-center justify-between px-4 py-2 bg-muted border-b text-sm font-medium">
        <span className="text-muted-foreground">{language}</span>
        <Button
          size="sm"
          variant="ghost"
          onClick={handleCopy}
          className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          {copied ? (
            <Check className="h-3 w-3 text-green-600" />
          ) : (
            <Copy className="h-3 w-3" />
          )}
        </Button>
      </div>
      <pre className="p-4 overflow-x-auto bg-muted/50 text-sm">
        <code className={cn(
          'text-foreground',
          language === 'sql' && 'text-blue-600',
          language === 'json' && 'text-green-600',
          language === 'javascript' && 'text-yellow-600',
          language === 'typescript' && 'text-blue-500'
        )}>
          {value}
        </code>
      </pre>
    </div>
  );
}
