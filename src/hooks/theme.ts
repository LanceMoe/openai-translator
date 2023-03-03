import { useLocalStorage, useMediaQuery, useUpdateEffect } from 'usehooks-ts';

const COLOR_SCHEME_QUERY = '(prefers-color-scheme: dark)';

// Hook
export function useDarkMode() {
  // Use our useLocalStorage hook to persist state through a page refresh.
  // Read the recipe for this hook to learn more: usehooks.com/useLocalStorage
  const [enabledState, setEnabledState] = useLocalStorage<boolean | null>('dark-mode-enabled', null);
  // See if user has set a browser or OS preference for dark mode.
  // The usePrefersDarkMode hook composes a useMedia hook (see code below).
  const isDarkOS = useMediaQuery(COLOR_SCHEME_QUERY);
  // If enabledState is defined use it, otherwise fallback to prefersDarkMode.
  // This allows user to override OS level setting on our website.
  const enabled = enabledState === null ? isDarkOS : enabledState;
  // Fire off effect that add/removes dark mode class

  const setThemeColor = (color: string) => {
    const themeMeta = document.head.querySelector('meta[name="theme-color"]');
    if (themeMeta) {
      themeMeta.setAttribute('content', color);
    }
  };

  const setDaisyUiTheme = (theme: string) => {
    document.documentElement.setAttribute('data-theme', theme);
  };

  useUpdateEffect(
    () => {
      const className = 'dark';
      const element = window.document.documentElement;
      setDaisyUiTheme(enabled ? 'mcpdark' : 'mcplight');
      setThemeColor(enabled ? '#1C4E80' : '#047AFF');
      if (enabled) {
        element.classList.add(className);
      } else {
        element.classList.remove(className);
      }
    },
    [enabled], // Only re-call effect when value changes
  );
  // Return enabled state and setter
  return [enabled, setEnabledState] as const;
}
