import { type ThemeConfig } from 'next-themes';

export const themeConfig: ThemeConfig = {
  defaultTheme: 'system',
  storageKey: 'trend-radar-theme',
  themes: ['light', 'dark', 'system'],
};

export type ColorScheme = 'default' | 'nature' | 'sunset';

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  foreground: string;
  muted: string;
  'muted-foreground': string;
  border: string;
  ring: string;
}

export const colorSchemes: Record<ColorScheme, ThemeColors> = {
  default: {
    primary: 'hsl(262, 83%, 58%)',
    secondary: 'hsl(28, 98%, 54%)',
    accent: 'hsl(174, 60%, 51%)',
    background: 'hsl(0, 0%, 100%)',
    foreground: 'hsl(222, 47%, 11%)',
    muted: 'hsl(210, 40%, 96.1%)',
    'muted-foreground': 'hsl(215.4, 16.3%, 46.9%)',
    border: 'hsl(214.3, 31.8%, 91.4%)',
    ring: 'hsl(215, 20.2%, 65.1%)',
  },
  nature: {
    primary: 'hsl(151, 55%, 41.5%)',
    secondary: 'hsl(163, 94%, 24.3%)',
    accent: 'hsl(174, 60%, 51%)',
    background: 'hsl(0, 0%, 100%)',
    foreground: 'hsl(222, 47%, 11%)',
    muted: 'hsl(210, 40%, 96.1%)',
    'muted-foreground': 'hsl(215.4, 16.3%, 46.9%)',
    border: 'hsl(214.3, 31.8%, 91.4%)',
    ring: 'hsl(215, 20.2%, 65.1%)',
  },
  sunset: {
    primary: 'hsl(20, 95%, 57%)',
    secondary: 'hsl(37, 97%, 55%)',
    accent: 'hsl(174, 60%, 51%)',
    background: 'hsl(0, 0%, 100%)',
    foreground: 'hsl(222, 47%, 11%)',
    muted: 'hsl(210, 40%, 96.1%)',
    'muted-foreground': 'hsl(215.4, 16.3%, 46.9%)',
    border: 'hsl(214.3, 31.8%, 91.4%)',
    ring: 'hsl(215, 20.2%, 65.1%)',
  },
};

export const darkColorSchemes: Record<ColorScheme, ThemeColors> = {
  default: {
    primary: 'hsl(262, 83%, 58%)',
    secondary: 'hsl(28, 98%, 54%)',
    accent: 'hsl(174, 60%, 51%)',
    background: 'hsl(224, 71%, 4%)',
    foreground: 'hsl(213, 31%, 91%)',
    muted: 'hsl(223, 47%, 11%)',
    'muted-foreground': 'hsl(215.4, 16.3%, 56.9%)',
    border: 'hsl(216, 34%, 17%)',
    ring: 'hsl(216, 34%, 17%)',
  },
  nature: {
    primary: 'hsl(151, 55%, 41.5%)',
    secondary: 'hsl(163, 94%, 24.3%)',
    accent: 'hsl(174, 60%, 51%)',
    background: 'hsl(224, 71%, 4%)',
    foreground: 'hsl(213, 31%, 91%)',
    muted: 'hsl(223, 47%, 11%)',
    'muted-foreground': 'hsl(215.4, 16.3%, 56.9%)',
    border: 'hsl(216, 34%, 17%)',
    ring: 'hsl(216, 34%, 17%)',
  },
  sunset: {
    primary: 'hsl(20, 95%, 57%)',
    secondary: 'hsl(37, 97%, 55%)',
    accent: 'hsl(174, 60%, 51%)',
    background: 'hsl(224, 71%, 4%)',
    foreground: 'hsl(213, 31%, 91%)',
    muted: 'hsl(223, 47%, 11%)',
    'muted-foreground': 'hsl(215.4, 16.3%, 56.9%)',
    border: 'hsl(216, 34%, 17%)',
    ring: 'hsl(216, 34%, 17%)',
  },
};

export const fonts = {
  sans: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
  heading: 'Poppins, Inter, ui-sans-serif, system-ui',
  mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
};

export const fontSizes = {
  xs: '0.75rem',
  sm: '0.875rem',
  base: '1rem',
  lg: '1.125rem',
  xl: '1.25rem',
  '2xl': '1.5rem',
  '3xl': '1.875rem',
  '4xl': '2.25rem',
  '5xl': '3rem',
};

export const spacing = {
  px: '1px',
  0: '0',
  0.5: '0.125rem',
  1: '0.25rem',
  1.5: '0.375rem',
  2: '0.5rem',
  2.5: '0.625rem',
  3: '0.75rem',
  3.5: '0.875rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  7: '1.75rem',
  8: '2rem',
  9: '2.25rem',
  10: '2.5rem',
  11: '2.75rem',
  12: '3rem',
  14: '3.5rem',
  16: '4rem',
  20: '5rem',
  24: '6rem',
  28: '7rem',
  32: '8rem',
  36: '9rem',
  40: '10rem',
  44: '11rem',
  48: '12rem',
  52: '13rem',
  56: '14rem',
  60: '15rem',
  64: '16rem',
  72: '18rem',
  80: '20rem',
  96: '24rem',
};

export const borderRadius = {
  none: '0',
  sm: '0.125rem',
  DEFAULT: '0.25rem',
  md: '0.375rem',
  lg: '0.5rem',
  xl: '0.75rem',
  '2xl': '1rem',
  '3xl': '1.5rem',
  full: '9999px',
};

export const shadows = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
  none: 'none',
};

export const transitions = {
  DEFAULT: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
  fast: '100ms cubic-bezier(0.4, 0, 0.2, 1)',
  slow: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
  slower: '500ms cubic-bezier(0.4, 0, 0.2, 1)',
};

export const animations = {
  spin: 'spin 1s linear infinite',
  ping: 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite',
  pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
  bounce: 'bounce 1s infinite',
  'slide-in-up': 'slideInUp 0.3s ease-out',
  'slide-in-right': 'slideInRight 0.3s ease-out',
  'fade-in': 'fadeIn 0.3s ease-out',
};

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

export const zIndices = {
  auto: 'auto',
  0: '0',
  10: '10',
  20: '20',
  30: '30',
  40: '40',
  50: '50',
  dropdown: '1000',
  sticky: '1100',
  banner: '1200',
  overlay: '1300',
  modal: '1400',
  popover: '1500',
  skipLink: '1600',
  toast: '1700',
  tooltip: '1800',
}; 