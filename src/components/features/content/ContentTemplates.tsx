'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Copy, Star } from 'lucide-react';

interface ContentTemplate {
  id: number;
  name: string;
  category: string;
  content: string;
  engagement: string;
  platforms: string[];
  performance: string;
}

interface ContentTemplatesProps {
  templates: ContentTemplate[];
  onSelectTemplate: (content: string) => void;
}

export function ContentTemplates({ templates, onSelectTemplate }: ContentTemplatesProps) {
  const getPerformanceColor = (performance: string) => {
    switch (performance) {
      case 'Very High': return 'text-success bg-success/10';
      case 'High': return 'text-primary bg-primary/10';
      case 'Medium': return 'text-warning bg-warning/10';
      case 'Low': return 'text-error bg-error/10';
      default: return 'text-muted bg-muted/10';
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'TikTok': return '🎵';
      case 'Instagram': return '📷';
      case 'Facebook': return '📘';
      case 'LinkedIn': return '💼';
      default: return '🌐';
    }
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {templates.map((template) => (
        <Card key={template.id} className="hover:shadow-lg transition-all cursor-pointer group">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="font-semibold text-lg mb-1">{template.name}</h4>
                <Badge variant="outline" className="text-xs">
                  {template.category}
                </Badge>
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${getPerformanceColor(template.performance)}`}>
                <Star className="h-3 w-3 mr-1 inline" />
                {template.performance}
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
              {template.content}
            </p>
            
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                {template.platforms.map((platform) => (
                  <span key={platform} className="text-lg">
                    {getPlatformIcon(platform)}
                  </span>
                ))}
              </div>
              <Badge variant="secondary" className="text-xs">
                {template.engagement} avg engagement
              </Badge>
            </div>
            
            <div className="flex gap-2">
              <Button 
                size="sm" 
                className="flex-1"
                onClick={() => onSelectTemplate(template.content)}
              >
                <Copy className="h-4 w-4 mr-2" />
                Use Template
              </Button>
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}