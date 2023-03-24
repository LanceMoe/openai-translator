import { useEffect } from 'react';
import { useLocalStorage, useMediaQuery } from 'usehooks-ts';

const COLOR_SCHEME_QUERY = '(prefers-color-scheme: dark)';

// Hook
export function useDarkMode() {
  // See if user has set a browser or OS preference for dark mode.
  // The usePrefersDarkMode hook composes a useMedia hook (see code below).
  const isDarkOS = useMediaQuery(COLOR_SCHEME_QUERY);
  // Use our useLocalStorage hook to persist state through a page refresh.
  // Read the recipe for this hook to learn more: usehooks.com/useLocalStorage
  const [enabledState, setEnabledState] = useLocalStorage<boolean | null>('dark-mode-enabled', isDarkOS ?? false);

  const setThemeColor = (color: string) => {
    const themeMeta = document.head.querySelector('meta[name="theme-color"]');
    if (themeMeta) {
      themeMeta.setAttribute('content', color);
    }
  };

  const setDaisyUiTheme = (theme: string) => {
    document.documentElement.setAttribute('data-theme', theme);
  };

  useEffect(
    () => {
      const className = 'dark';
      const element = window.document.documentElement;
      setDaisyUiTheme(enabledState ? 'mcpdark' : 'mcplight');
      setThemeColor(enabledState ? '#487ce2' : '#047AFF');
      if (enabledState) {
        element.classList.add(className);
      } else {
        element.classList.remove(className);
      }
    },
    [enabledState], // Only re-call effect when value changes
  );
  // Return enabled state and setter
  return [enabledState, setEnabledState] as const;
}
