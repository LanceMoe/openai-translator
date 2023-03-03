export function getGlobalThemeMode() {
  const globalThemeMode = localStorage.getItem('globalThemeMode');
  if (globalThemeMode) {
    return globalThemeMode;
  }
  const themeMedia = window.matchMedia('(prefers-color-scheme: light)');
  return themeMedia.matches ? 'light' : 'dark';
}

export function setThemeColor(color: string) {
  const themeMeta = document.head.querySelector('meta[name="theme-color"]');
  if (themeMeta) {
    themeMeta.setAttribute('content', color);
  }
}

export function setDaisyUiTheme(theme: string) {
  document.documentElement.setAttribute('data-theme', theme);
}

export function enableTailwindDarkMode(enable: boolean) {
  const { classList } = document.documentElement;
  enable ? classList.add('dark') : classList.remove('dark');
}
