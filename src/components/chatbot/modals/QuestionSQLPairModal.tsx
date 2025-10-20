'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { motion } from 'framer-motion';
import { Database, Save, Info, AlertCircle } from 'lucide-react';

interface QuestionSQLPairModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: { question: string; sql: string }) => Promise<void>;
  loading?: boolean;
  defaultValue?: { question: string; sql: string };
}

export default function QuestionSQLPairModal({ 
  visible, 
  onClose, 
  onSubmit, 
  loading = false, 
  defaultValue 
}: QuestionSQLPairModalProps) {
  const [question, setQuestion] = useState(defaultValue?.question || '');
  const [sql, setSql] = useState(defaultValue?.sql || '');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!question.trim()) {
      setError('Question is required');
      return;
    }

    if (!sql.trim()) {
      setError('SQL statement is required');
      return;
    }

    try {
      await onSubmit({
        question: question.trim(),
        sql: sql.trim()
      });
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save question-SQL pair');
    }
  };

  const handleClose = () => {
    setQuestion('');
    setSql('');
    setError(null);
    onClose();
  };

  return (
    <Dialog open={visible} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[640px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Save to Knowledge Base
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="question">Question</Label>
            <Input
              id="question"
              value={question}
              onChange={(e) => {
                setQuestion(e.target.value);
                setError(null);
              }}
              placeholder="Enter the question that this SQL answers..."
              className={error && !question.trim() ? 'border-red-500' : ''}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sql-statement">SQL Statement</Label>
            <Textarea
              id="sql-statement"
              value={sql}
              onChange={(e) => {
                setSql(e.target.value);
                setError(null);
              }}
              placeholder="Enter the SQL statement here..."
              className="font-mono text-sm min-h-[150px]"
            />
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800"
            >
              <AlertCircle className="h-4 w-4 text-red-500" />
              <span className="text-sm text-red-700 dark:text-red-300">{error}</span>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800"
          >
            <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-800 dark:text-blue-200">
              <p className="font-medium mb-1">Knowledge Base:</p>
              <p>This will save the question-SQL pair to your knowledge base, making it available for future queries and improving the AI's understanding of your data patterns.</p>
            </div>
          </motion.div>
        </div>

        <DialogFooter className="flex justify-between">
          <div className="text-xs text-muted-foreground">
            This will be saved to your project's knowledge base
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleClose} disabled={loading}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={loading || !question.trim() || !sql.trim()}>
              {loading ? (
                <>
                  <motion.div
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save to Knowledge Base
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
