import { useEffect } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const statusBarColor = {
  light: '#047AFF',
  dark: '#487ce2',
} as const;

const localStorageKey = 'openai-translator-theme' as const;

const isSystemInDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;

type ThemeStore = {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
};

export const useTheme = create<ThemeStore>()(
  persist(
    (set) => ({
      theme: isSystemInDarkMode ? 'dark' : 'light',
      toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
    }),
    { name: localStorageKey },
  ),
);

export function setDaisyUiTheme(theme: string) {
  document.documentElement.setAttribute('data-theme', theme);
}

export function setThemeColor(color: string) {
  const themeMeta = document.head.querySelector('meta[name="theme-color"]');
  themeMeta?.setAttribute('content', color);
}

export function useAutoChangeTheme() {
  const { theme } = useTheme();
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    setDaisyUiTheme(theme);
    setThemeColor(statusBarColor[theme]);
  }, [theme]);
}
