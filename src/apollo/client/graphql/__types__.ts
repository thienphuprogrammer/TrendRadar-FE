// Basic types for GraphQL operations
// This would normally be generated from schema, but for now we'll define basic types

export interface Error {
  code: string;
  shortMessage: string;
  message: string;
  stacktrace?: string;
}

export interface ThreadResponse {
  id: number;
  threadId: number;
  question: string;
  sql?: string;
  view?: {
    id: number;
    name: string;
    statement: string;
    displayName: string;
  };
  breakdownDetail?: ThreadResponseBreakdownDetail;
  answerDetail?: ThreadResponseAnswerDetail;
  chartDetail?: ThreadResponseChartDetail;
  askingTask?: AskingTask;
  adjustment?: {
    type: string;
    payload: any;
  };
  adjustmentTask?: AdjustmentTask;
}

export interface ThreadResponseBreakdownDetail {
  queryId: string;
  status: string;
  description: string;
  steps: Array<{
    summary: string;
    sql: string;
    cteName?: string;
  }>;
  error?: Error;
}

export interface ThreadResponseAnswerDetail {
  queryId: string;
  status: string;
  content: string;
  numRowsUsedInLLM?: number;
  error?: Error;
}

export interface ThreadResponseChartDetail {
  queryId: string;
  status: string;
  description: string;
  chartType: string;
  chartSchema: any;
  error?: Error;
  adjustment?: any;
}

export interface AskingTask {
  status: string;
  type: string;
  candidates: Array<{
    sql: string;
    type: string;
    view?: {
      id: number;
      name: string;
      statement: string;
      displayName: string;
    };
    sqlPair?: {
      id: number;
      question: string;
      sql: string;
      projectId: number;
    };
  }>;
  error?: Error;
  rephrasedQuestion?: string;
  intentReasoning?: string;
  sqlGenerationReasoning?: string;
  retrievedTables: string[];
  invalidSql?: string;
  traceId?: string;
  queryId?: string;
}

export interface AdjustmentTask {
  queryId: string;
  status: string;
  error?: Error;
  sql?: string;
  traceId?: string;
  invalidSql?: string;
}

export interface Thread {
  id: number;
  summary?: string;
  responses: ThreadResponse[];
}

export interface SqlPair {
  id: number;
  projectId: number;
  sql: string;
  question: string;
  createdAt: string;
  updatedAt: string;
}

export interface View {
  id: number;
  name: string;
  statement: string;
  displayName?: string;
}

// Input types
export interface CreateThreadInput {
  summary?: string;
}

export interface CreateThreadResponseInput {
  question: string;
  sql?: string;
  viewId?: number;
}

export interface CreateSqlPairInput {
  question: string;
  sql: string;
}

export interface CreateViewInput {
  name: string;
  statement: string;
}

export interface AdjustThreadResponseInput {
  type: 'sql' | 'reasoning';
  data: any;
}

export interface AdjustThreadResponseChartInput {
  chartType?: string;
  chartSchema?: any;
}

// Where input types
export interface ThreadUniqueWhereInput {
  id: number;
}

export interface ThreadResponseUniqueWhereInput {
  id: number;
}

export interface SqlPairWhereUniqueInput {
  id: number;
}

export interface ViewWhereUniqueInput {
  id: number;
}

// Update input types
export interface UpdateThreadInput {
  summary?: string;
}

export interface UpdateThreadResponseInput {
  sql?: string;
}

export interface UpdateSqlPairInput {
  question?: string;
  sql?: string;
}

// Preview input types
export interface PreviewDataInput {
  sql: string;
  limit?: number;
  dryRun?: boolean;
}

export interface PreviewViewDataInput {
  viewId: number;
  limit?: number;
}

export interface ValidateViewInput {
  name: string;
}

// Other input types
export interface AskingTaskInput {
  question: string;
  sql?: string;
  viewId?: number;
}

export interface InstantRecommendedQuestionsInput {
  question: string;
}