import { ThreadResponse } from '@/apollo/client/graphql/__types__';

export interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  chart?: {
    type: 'line' | 'bar' | 'pie';
    data: any;
    title: string;
  };
  deepDiveLink?: string;
  streaming?: boolean;
  suggestions?: string[];
  sql?: {
    query: string;
    status: 'pending' | 'running' | 'completed' | 'failed';
    result?: any;
  };
  reasoningSteps?: {
    steps: string[];
    currentStep?: number;
  };
  status?: 'pending' | 'running' | 'completed' | 'failed';
  threadId?: string;
  responseId?: string;
  actions?: {
    onSaveAsView?: () => void;
    onAdjustSQL?: () => void;
    onAdjustReasoning?: () => void;
    onRegenerate?: () => void;
  };
}

export interface ChatState {
  messages: Message[];
  currentThreadId: string | null;
  isLoading: boolean;
  error: string | null;
}

export interface ChatActions {
  sendMessage: (message: string) => Promise<void>;
  createNewThread: () => void;
  loadThread: (threadId: string) => Promise<void>;
  clearMessages: () => void;
  exportThread: () => void;
}

export interface ModalState {
  saveAsViewModal: {
    visible: boolean;
    data?: { sql: string; responseId: number };
  };
  adjustSQLModal: {
    visible: boolean;
    data?: { responseId: number; sql: string };
  };
  adjustReasoningModal: {
    visible: boolean;
    data?: { responseId: number; reasoning: string };
  };
  questionSQLPairModal: {
    visible: boolean;
    data?: { question: string; sql: string };
  };
}

export interface QuickAction {
  label: string;
  icon: React.ComponentType<any>;
  query: string;
}

export interface SampleQuestion {
  text: string;
  category: string;
}

export interface SessionStats {
  queriesToday: number;
  avgResponseTime: string;
  accuracy: number;
  sources: number;
}

export interface ThreadInfo {
  id: string;
  summary?: string;
  messageCount: number;
  status: 'active' | 'archived';
  lastActivity: Date;
}
