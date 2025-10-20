'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { motion } from 'framer-motion';
import { Info, Save } from 'lucide-react';

interface SaveAsViewModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; sql: string; responseId: number }) => Promise<void>;
  loading?: boolean;
  defaultValue?: { sql: string; responseId: number };
}

export default function SaveAsViewModal({ 
  visible, 
  onClose, 
  onSubmit, 
  loading = false, 
  defaultValue 
}: SaveAsViewModalProps) {
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError('View name is required');
      return;
    }

    if (!defaultValue?.sql) {
      setError('No SQL statement to save');
      return;
    }

    try {
      await onSubmit({
        name: name.trim(),
        sql: defaultValue.sql,
        responseId: defaultValue.responseId
      });
      setName('');
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save view');
    }
  };

  const handleClose = () => {
    setName('');
    setError(null);
    onClose();
  };

  return (
    <Dialog open={visible} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Save className="h-5 w-5" />
            Save as View
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="view-name">View Name</Label>
            <Input
              id="view-name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError(null);
              }}
              placeholder="Enter a name for this view"
              className={error ? 'border-red-500' : ''}
            />
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-red-500"
              >
                {error}
              </motion.p>
            )}
          </div>

          {defaultValue?.sql && (
            <div className="space-y-2">
              <Label>SQL Statement</Label>
              <div className="bg-slate-900 text-slate-100 p-3 rounded-lg font-mono text-sm overflow-x-auto max-h-60">
                <pre>{defaultValue.sql}</pre>
              </div>
            </div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800"
          >
            <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-800 dark:text-blue-200">
              <p className="font-medium mb-1">Important:</p>
              <p>After saving, make sure you go to "Modeling Page" to deploy all saved views.</p>
            </div>
          </motion.div>
        </div>

        <DialogFooter className="flex justify-between">
          <div className="text-xs text-muted-foreground">
            This will create a reusable view for future queries
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleClose} disabled={loading}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={loading || !name.trim()}>
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
                  Save View
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
