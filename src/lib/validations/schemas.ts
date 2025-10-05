import { z } from 'zod';

/**
 * Zod validation schemas for forms
 * Provides type-safe form validation across the application
 */

// Common field validations
const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number');

const emailSchema = z
  .string()
  .email('Please enter a valid email address');

const phoneSchema = z
  .string()
  .regex(/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number')
  .optional()
  .or(z.literal(''));

// User schemas
export const userCreateSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string(),
  role: z.enum(['admin', 'account_owner', 'analyst', 'viewer']),
  department: z.string().optional(),
  phone: phoneSchema,
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const userUpdateSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  email: emailSchema,
  role: z.enum(['admin', 'account_owner', 'analyst', 'viewer']),
  department: z.string().optional(),
  phone: phoneSchema,
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
});

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const resetPasswordSchema = z.object({
  password: passwordSchema,
  confirmPassword: z.string(),
  token: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Thread/Conversation schemas
export const threadCreateSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  content: z.string().optional(),
});

export const messageSchema = z.object({
  content: z.string().min(1, 'Message cannot be empty').max(10000, 'Message is too long'),
  threadId: z.number().optional(),
});

// Chatbot schemas
export const askPromptSchema = z.object({
  question: z.string().min(1, 'Question cannot be empty').max(1000, 'Question is too long'),
  context: z.array(z.string()).optional(),
});

export const adjustAnswerSchema = z.object({
  responseId: z.string(),
  adjustment: z.object({
    sql: z.string().optional(),
    reasoning: z.string().optional(),
    tables: z.array(z.string()).optional(),
  }),
});

// Settings schemas
export const appSettingsSchema = z.object({
  theme: z.enum(['light', 'dark', 'system']),
  language: z.string(),
  timezone: z.string(),
  notifications: z.object({
    email: z.boolean(),
    push: z.boolean(),
    inApp: z.boolean(),
  }),
  autoSave: z.boolean(),
  compactMode: z.boolean(),
});

// Filter schemas
export const filterSchema = z.object({
  dateRange: z.object({
    start: z.date(),
    end: z.date(),
  }).optional(),
  categories: z.array(z.string()).optional(),
  status: z.array(z.string()).optional(),
  search: z.string().optional(),
});

// Report schemas
export const reportSchema = z.object({
  name: z.string().min(1, 'Report name is required').max(100, 'Name must be less than 100 characters'),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
  template: z.string(),
  frequency: z.enum(['daily', 'weekly', 'monthly']),
  recipients: z.array(emailSchema),
  format: z.enum(['pdf', 'excel', 'csv']),
});

// Integration schemas
export const integrationSchema = z.object({
  name: z.string().min(1, 'Integration name is required'),
  type: z.enum(['database', 'api', 'file', 'webhook']),
  config: z.record(z.any()), // Flexible config object
  autoSync: z.boolean(),
  syncFrequency: z.string().optional(),
});

// Type exports for form data
export type UserCreateFormData = z.infer<typeof userCreateSchema>;
export type UserUpdateFormData = z.infer<typeof userUpdateSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type ThreadCreateFormData = z.infer<typeof threadCreateSchema>;
export type MessageFormData = z.infer<typeof messageSchema>;
export type AskPromptFormData = z.infer<typeof askPromptSchema>;
export type AdjustAnswerFormData = z.infer<typeof adjustAnswerSchema>;
export type AppSettingsFormData = z.infer<typeof appSettingsSchema>;
export type FilterFormData = z.infer<typeof filterSchema>;
export type ReportFormData = z.infer<typeof reportSchema>;
export type IntegrationFormData = z.infer<typeof integrationSchema>;
