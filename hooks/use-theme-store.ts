import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { type ColorScheme } from '@/lib/theme';

interface ThemeState {
  colorScheme: ColorScheme;
  fontSize: 'sm' | 'base' | 'lg' | 'xl';
  reducedMotion: boolean;
  setColorScheme: (scheme: ColorScheme) => void;
  setFontSize: (size: 'sm' | 'base' | 'lg' | 'xl') => void;
  setReducedMotion: (reduced: boolean) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      colorScheme: 'default',
      fontSize: 'base',
      reducedMotion: false,
      setColorScheme: (scheme) => set({ colorScheme: scheme }),
      setFontSize: (size) => set({ fontSize: size }),
      setReducedMotion: (reduced) => set({ reducedMotion: reduced }),
    }),
    {
      name: 'trend-radar-theme-preferences',
    }
  )
); 