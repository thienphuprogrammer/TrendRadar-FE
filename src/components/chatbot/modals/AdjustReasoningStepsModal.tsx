'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { Lightbulb, Settings, Info, X } from 'lucide-react';

interface AdjustReasoningStepsModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: { responseId: number; retrievedTables: string[]; sqlGenerationReasoning: string }) => Promise<void>;
  loading?: boolean;
  defaultValue?: { responseId: number; retrievedTables: string[]; sqlGenerationReasoning: string };
}

// Mock model options
const modelOptions = [
  { value: 'analytics_data', label: 'Analytics Data', description: 'Main analytics dataset' },
  { value: 'user_metrics', label: 'User Metrics', description: 'User behavior metrics' },
  { value: 'revenue_data', label: 'Revenue Data', description: 'Financial performance data' },
  { value: 'social_media', label: 'Social Media', description: 'Social media engagement data' },
  { value: 'content_data', label: 'Content Data', description: 'Content performance metrics' }
];

export default function AdjustReasoningStepsModal({ 
  visible, 
  onClose, 
  onSubmit, 
  loading = false, 
  defaultValue 
}: AdjustReasoningStepsModalProps) {
  const [selectedTables, setSelectedTables] = useState<string[]>(defaultValue?.retrievedTables || []);
  const [reasoning, setReasoning] = useState(defaultValue?.sqlGenerationReasoning || '');
  const [error, setError] = useState<string | null>(null);

  const handleTableToggle = (tableValue: string) => {
    setSelectedTables(prev => 
      prev.includes(tableValue) 
        ? prev.filter(t => t !== tableValue)
        : [...prev, tableValue]
    );
  };

  const handleSubmit = async () => {
    if (selectedTables.length === 0) {
      setError('Please select at least one table');
      return;
    }

    if (!reasoning.trim()) {
      setError('Reasoning steps are required');
      return;
    }

    if (!defaultValue?.responseId) {
      setError('Invalid response ID');
      return;
    }

    try {
      await onSubmit({
        responseId: defaultValue.responseId,
        retrievedTables: selectedTables,
        sqlGenerationReasoning: reasoning.trim()
      });
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update reasoning');
    }
  };

  const handleClose = () => {
    setSelectedTables([]);
    setReasoning('');
    setError(null);
    onClose();
  };

  return (
    <Dialog open={visible} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[640px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Adjust Reasoning Steps
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="space-y-3">
            <Label>Selected Models</Label>
            <div className="text-sm text-muted-foreground mb-3">
              Select the tables needed to answer your question. Tables not selected won't be used in SQL generation.
            </div>
            
            <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto">
              {modelOptions.map((model) => (
                <motion.div
                  key={model.value}
                  whileHover={{ scale: 1.02 }}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    selectedTables.includes(model.value)
                      ? 'bg-primary/10 border-primary/30'
                      : 'bg-muted/30 border-border hover:bg-muted/50'
                  }`}
                  onClick={() => handleTableToggle(model.value)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="font-medium text-sm">{model.label}</div>
                      <div className="text-xs text-muted-foreground">{model.description}</div>
                    </div>
                    {selectedTables.includes(model.value) && (
                      <Badge variant="secondary" className="text-xs">
                        Selected
                      </Badge>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
            
            {selectedTables.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-wrap gap-2"
              >
                {selectedTables.map((tableValue) => {
                  const model = modelOptions.find(m => m.value === tableValue);
                  return (
                    <Badge
                      key={tableValue}
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {model?.label}
                      <X 
                        className="h-3 w-3 cursor-pointer hover:text-red-500" 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTableToggle(tableValue);
                        }}
                      />
                    </Badge>
                  );
                })}
              </motion.div>
            )}
          </div>

          <div className="space-y-3">
            <Label>Reasoning Steps</Label>
            <div className="text-sm text-muted-foreground mb-2">
              Edit the reasoning logic below. Each step should build toward answering the question accurately.
            </div>
            <Textarea
              value={reasoning}
              onChange={(e) => {
                setReasoning(e.target.value);
                setError(null);
              }}
              placeholder="Enter your reasoning steps here..."
              className="min-h-[200px] font-mono text-sm"
            />
            <div className="text-xs text-muted-foreground">
              <Info className="h-3 w-3 inline mr-1" />
              Tip: Use @ to choose model in the textarea.
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800"
            >
              <Info className="h-4 w-4 text-red-500" />
              <span className="text-sm text-red-700 dark:text-red-300">{error}</span>
            </motion.div>
          )}
        </div>

        <DialogFooter className="flex justify-between">
          <div className="text-xs text-muted-foreground">
            {selectedTables.length} table(s) selected
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleClose} disabled={loading}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={loading || selectedTables.length === 0 || !reasoning.trim()}>
              {loading ? (
                <>
                  <motion.div
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  Regenerating...
                </>
              ) : (
                <>
                  <Lightbulb className="h-4 w-4 mr-2" />
                  Regenerate Answer
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
