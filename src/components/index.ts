/**
 * Components Barrel Export
 * Central export point for all components following Next.js best practices
 * 
 * Structure:
 * - ui/ - Shadcn/UI base components
 * - common/ - Shared reusable components (buttons, display, feedback, wrappers)
 * - layouts/ - Layout components (Header, Sidebar, Page layouts)
 * - features/ - Feature-specific components organized by domain
 * - providers/ - Context providers and theme management
 * - pages/ - Page-specific components
 * - chart/ - Chart visualization components
 * - table/ - Table components
 * - modals/ - Modal dialogs
 * - editor/ - Code/text editor components
 * - sidebar/ - Sidebar navigation components
 * - selectors/ - Selector components
 * - settings/ - Settings components
 * - diagram/ - Diagram and flow components
 * - code/ - Code display components
 * - dataPreview/ - Data preview components
 * - deploy/ - Deployment components
 * - learning/ - Learning/guide components
 */

// ==================== CORE UI COMPONENTS ====================
export * from './ui';

// ==================== COMMON COMPONENTS ====================
export * from './common';
export * from './common/buttons';
export * from './common/display';
export * from './common/feedback';
export * from './common/wrappers';

// ==================== LAYOUT COMPONENTS ====================
export * from './layouts';

// ==================== FEATURE COMPONENTS ====================
export * from './features/auth';
export * from './features/analytics';
export * from './features/billing';
export * from './features/chatbot';
export * from './features/content';
export * from './features/data-lab';
export * from './features/notifications';
export * from './features/trends';
export * from './features/users';
export * from './features/wren-ai';

// ==================== PROVIDERS ====================
export * from './providers';

// ==================== SPECIALIZED COMPONENTS ====================
export * from './chart';
export * from './table';
export * from './modals';
export * from './editor';
export * from './sidebar';
export * from './selectors';
export * from './settings';
export * from './diagram';
export * from './code';
export * from './dataPreview';
export * from './deploy';
export * from './learning';

