'use client';

import React from 'react';
import { Moon, Sun, Monitor, Laptop, Type } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from '@/components/ui/dropdown-menu';
import { useTheme } from 'next-themes';
import { useThemeStore } from '@/hooks/use-theme-store';
import { type ColorScheme } from '@/lib/theme';

interface ColorSchemeOption {
  name: string;
  value: ColorScheme;
  colors: string[];
}

const colorSchemeOptions: ColorSchemeOption[] = [
  {
    name: 'Default',
    value: 'default',
    colors: ['from-blue-500 to-purple-600', 'from-blue-600 to-purple-700'],
  },
  {
    name: 'Nature',
    value: 'nature',
    colors: ['from-green-500 to-emerald-600', 'from-green-600 to-emerald-700'],
  },
  {
    name: 'Sunset',
    value: 'sunset',
    colors: ['from-orange-500 to-red-600', 'from-orange-600 to-red-700'],
  },
];

const fontSizeOptions = [
  { label: 'Small', value: 'sm' },
  { label: 'Medium', value: 'base' },
  { label: 'Large', value: 'lg' },
  { label: 'Extra Large', value: 'xl' },
];

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const { colorScheme, fontSize, reducedMotion, setColorScheme, setFontSize, setReducedMotion } = useThemeStore();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Theme Mode</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => setTheme('light')}>
          <Sun className="h-4 w-4 mr-2" />
          <span>Light</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')}>
          <Moon className="h-4 w-4 mr-2" />
          <span>Dark</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('system')}>
          <Monitor className="h-4 w-4 mr-2" />
          <span>System</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        <DropdownMenuLabel>Color Scheme</DropdownMenuLabel>
        {colorSchemeOptions.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => setColorScheme(option.value)}
            className="flex items-center gap-2"
          >
            <div
              className={`w-8 h-4 rounded-full bg-gradient-to-r ${
                theme === 'dark' ? option.colors[1] : option.colors[0]
              }`}
            />
            <span>{option.name}</span>
            {colorScheme === option.value && (
              <span className="ml-auto text-xs text-primary">Active</span>
            )}
          </DropdownMenuItem>
        ))}

        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Type className="h-4 w-4 mr-2" />
            <span>Font Size</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuRadioGroup value={fontSize} onValueChange={(value) => setFontSize(value as any)}>
              {fontSizeOptions.map((option) => (
                <DropdownMenuRadioItem key={option.value} value={option.value}>
                  {option.label}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => setReducedMotion(!reducedMotion)}>
          <Laptop className="h-4 w-4 mr-2" />
          <span>Reduce Motion</span>
          {reducedMotion && <span className="ml-auto text-xs text-primary">Active</span>}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Example usage:
/*
import { ThemeToggle } from '@/components/ThemeToggle';

function Header() {
  return (
    <header>
      <ThemeToggle />
    </header>
  );
}
*/ 