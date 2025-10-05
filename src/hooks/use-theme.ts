import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { type ColorScheme, colorSchemes, darkColorSchemes } from '@/lib/theme';

export interface UseThemeProps {
  defaultColorScheme?: ColorScheme;
}

export function useAppTheme({ defaultColorScheme = 'default' }: UseThemeProps = {}) {
  const { theme, setTheme, systemTheme } = useTheme();
  const [colorScheme, setColorScheme] = useState<ColorScheme>(defaultColorScheme);
  const [mounted, setMounted] = useState(false);

  // After mounting, we have access to the theme
  useEffect(() => setMounted(true), []);

  const isDark = theme === 'dark' || (theme === 'system' && systemTheme === 'dark');

  // Update CSS variables when theme or color scheme changes
  useEffect(() => {
    if (!mounted) return;

    const colors = isDark ? darkColorSchemes[colorScheme] : colorSchemes[colorScheme];
    const root = document.documentElement;

    Object.entries(colors).forEach(([key, value]) => {
      const cssVar = key.includes('-') ? key : `--${key}`;
      root.style.setProperty(cssVar, value.split('hsl(')[1]?.split(')')[0] || value);
    });
  }, [isDark, colorScheme, mounted]);

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  const setThemeMode = (mode: 'light' | 'dark' | 'system') => {
    setTheme(mode);
  };

  const setAppColorScheme = (scheme: ColorScheme) => {
    setColorScheme(scheme);
  };

  // Return null on first render to avoid hydration mismatch
  if (!mounted) {
    return {
      theme: null,
      isDark: null,
      colorScheme: null,
      toggleTheme: () => {},
      setThemeMode: () => {},
      setColorScheme: () => {},
    };
  }

  return {
    theme,
    isDark,
    colorScheme,
    toggleTheme,
    setThemeMode,
    setColorScheme: setAppColorScheme,
  };
}

// Utility function to get theme-aware styles
export function getThemeAwareStyle(lightStyle: string, darkStyle: string) {
  const { isDark } = useAppTheme();
  return isDark ? darkStyle : lightStyle;
}

// Utility function to get theme-aware colors
export function getThemeAwareColor(lightColor: string, darkColor: string) {
  const { isDark } = useAppTheme();
  return isDark ? darkColor : lightColor;
}

// Utility function to get theme-aware classes
export function getThemeAwareClass(lightClass: string, darkClass: string) {
  const { isDark } = useAppTheme();
  return isDark ? darkClass : lightClass;
}

// Utility function to get theme-aware variants
export function getThemeAwareVariant(lightVariant: string, darkVariant: string) {
  const { isDark } = useAppTheme();
  return isDark ? darkVariant : lightVariant;
}

// Example usage:
/*
import { useAppTheme } from '@/hooks/use-theme';

function MyComponent() {
  const { isDark, toggleTheme, setThemeMode, setColorScheme } = useAppTheme();

  return (
    <div>
      <button onClick={toggleTheme}>
        Toggle Theme
      </button>
      
      <button onClick={() => setThemeMode('system')}>
        Use System Theme
      </button>
      
      <button onClick={() => setColorScheme('nature')}>
        Use Nature Color Scheme
      </button>
      
      <div className={getThemeAwareClass(
        'bg-white text-black',
        'bg-black text-white'
      )}>
        Theme Aware Content
      </div>
    </div>
  );
}
*/ 