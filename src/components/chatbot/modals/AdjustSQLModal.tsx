'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { motion } from 'framer-motion';
import { Code, Play, Info, AlertCircle, CheckCircle } from 'lucide-react';

interface AdjustSQLModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: { responseId: number; sql: string }) => Promise<void>;
  loading?: boolean;
  defaultValue?: { responseId: number; sql: string };
}

export default function AdjustSQLModal({ 
  visible, 
  onClose, 
  onSubmit, 
  loading = false, 
  defaultValue 
}: AdjustSQLModalProps) {
  const [sql, setSql] = useState(defaultValue?.sql || '');
  const [error, setError] = useState<string | null>(null);
  const [previewData, setPreviewData] = useState<any>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const handlePreview = async () => {
    if (!sql.trim()) return;
    
    setPreviewLoading(true);
    setError(null);
    
    try {
      // Simulate preview data
      await new Promise(resolve => setTimeout(resolve, 1000));
      setPreviewData({
        columns: ['id', 'name', 'value', 'created_at'],
        rows: [
          { id: 1, name: 'Sample 1', value: 100, created_at: '2024-01-01' },
          { id: 2, name: 'Sample 2', value: 200, created_at: '2024-01-02' },
          { id: 3, name: 'Sample 3', value: 300, created_at: '2024-01-03' }
        ]
      });
      setShowPreview(true);
    } catch (err) {
      setError('Failed to preview data');
    } finally {
      setPreviewLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!sql.trim()) {
      setError('SQL statement is required');
      return;
    }

    if (!defaultValue?.responseId) {
      setError('Invalid response ID');
      return;
    }

    try {
      await onSubmit({
        responseId: defaultValue.responseId,
        sql: sql.trim()
      });
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update SQL');
    }
  };

  const handleClose = () => {
    setSql('');
    setError(null);
    setPreviewData(null);
    setShowPreview(false);
    onClose();
  };

  return (
    <Dialog open={visible} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[640px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            Adjust SQL
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="sql-statement">SQL Statement</Label>
            <Textarea
              id="sql-statement"
              value={sql}
              onChange={(e) => {
                setSql(e.target.value);
                setError(null);
              }}
              placeholder="Enter your SQL statement here..."
              className="font-mono text-sm min-h-[120px]"
            />
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 p-2 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800"
              >
                <AlertCircle className="h-4 w-4 text-red-500" />
                <span className="text-sm text-red-700 dark:text-red-300">{error}</span>
              </motion.div>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Data Preview (50 rows)</Label>
              <Button
                variant="outline"
                size="sm"
                onClick={handlePreview}
                disabled={!sql.trim() || previewLoading}
                className="h-8"
              >
                {previewLoading ? (
                  <>
                    <motion.div
                      className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full mr-2"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    Previewing...
                  </>
                ) : (
                  <>
                    <Play className="h-3 w-3 mr-1" />
                    Preview Data
                  </>
                )}
              </Button>
            </div>
            
            {showPreview && previewData && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-50 dark:bg-slate-900 rounded-lg border p-3"
              >
                <div className="text-sm font-medium mb-2 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Preview Results
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b">
                        {previewData.columns.map((col: string) => (
                          <th key={col} className="text-left p-2 font-medium">{col}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {previewData.rows.map((row: any, index: number) => (
                        <tr key={index} className="border-b">
                          {previewData.columns.map((col: string) => (
                            <td key={col} className="p-2">{row[col]}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800"
          >
            <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-800 dark:text-blue-200">
              <p className="font-medium mb-1">SQL Syntax:</p>
              <p>The SQL statement follows <strong>TrendRadar SQL</strong>, which is based on ANSI SQL and optimized for TrendRadar.</p>
            </div>
          </motion.div>
        </div>

        <DialogFooter className="flex justify-between">
          <div className="text-xs text-muted-foreground">
            Make sure to validate your SQL before submitting
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleClose} disabled={loading}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={loading || !sql.trim()}>
              {loading ? (
                <>
                  <motion.div
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  Updating...
                </>
              ) : (
                <>
                  <Code className="h-4 w-4 mr-2" />
                  Update SQL
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
