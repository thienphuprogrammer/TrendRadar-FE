import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

/**
 * Main application store using Zustand
 * Manages global application state with persistence and devtools support
 */

export interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  language: string;
  timezone: string;
  notifications: {
    email: boolean;
    push: boolean;
    inApp: boolean;
  };
  autoSave: boolean;
  compactMode: boolean;
}

export interface AppState {
  // Settings
  settings: AppSettings;

  // UI State
  sidebarCollapsed: boolean;
  activeView: string;
  breadcrumbs: Array<{ label: string; path?: string }>;

  // Loading states
  globalLoading: boolean;
  loadingMessage?: string;

  // Modal states
  activeModals: Record<string, boolean>;

  // Actions
  setSetting: <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => void;
  updateSettings: (settings: Partial<AppSettings>) => void;
  toggleSidebar: () => void;
  setActiveView: (view: string) => void;
  setBreadcrumbs: (breadcrumbs: Array<{ label: string; path?: string }>) => void;
  setGlobalLoading: (loading: boolean, message?: string) => void;
  openModal: (modalId: string) => void;
  closeModal: (modalId: string) => void;
  closeAllModals: () => void;
}

const defaultSettings: AppSettings = {
  theme: 'system',
  language: 'en',
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  notifications: {
    email: true,
    push: true,
    inApp: true,
  },
  autoSave: true,
  compactMode: false,
};

export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        settings: defaultSettings,
        sidebarCollapsed: false,
        activeView: 'dashboard',
        breadcrumbs: [],
        globalLoading: false,
        activeModals: {},

        // Actions
        setSetting: (key, value) => {
          set(
            (state) => ({
              settings: {
                ...state.settings,
                [key]: value,
              },
            }),
            false,
            `setSetting/${key}`
          );
        },

        updateSettings: (newSettings) => {
          set(
            (state) => ({
              settings: {
                ...state.settings,
                ...newSettings,
              },
            }),
            false,
            'updateSettings'
          );
        },

        toggleSidebar: () => {
          set(
            (state) => ({
              sidebarCollapsed: !state.sidebarCollapsed,
            }),
            false,
            'toggleSidebar'
          );
        },

        setActiveView: (view) => {
          set(
            { activeView: view },
            false,
            `setActiveView/${view}`
          );
        },

        setBreadcrumbs: (breadcrumbs) => {
          set(
            { breadcrumbs },
            false,
            'setBreadcrumbs'
          );
        },

        setGlobalLoading: (loading, message) => {
          set(
            {
              globalLoading: loading,
              loadingMessage: message,
            },
            false,
            'setGlobalLoading'
          );
        },

        openModal: (modalId) => {
          set(
            (state) => ({
              activeModals: {
                ...state.activeModals,
                [modalId]: true,
              },
            }),
            false,
            `openModal/${modalId}`
          );
        },

        closeModal: (modalId) => {
          set(
            (state) => ({
              activeModals: {
                ...state.activeModals,
                [modalId]: false,
              },
            }),
            false,
            `closeModal/${modalId}`
          );
        },

        closeAllModals: () => {
          set(
            { activeModals: {} },
            false,
            'closeAllModals'
          );
        },
      }),
      {
        name: 'app-store',
        partialize: (state) => ({
          settings: state.settings,
          sidebarCollapsed: state.sidebarCollapsed,
        }),
      }
    ),
    {
      name: 'AppStore',
    }
  )
);
