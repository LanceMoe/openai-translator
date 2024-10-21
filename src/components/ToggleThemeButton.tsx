import { useTranslation } from 'react-i18next';
import { FaMoon, FaSun } from 'react-icons/fa';

import { useTheme } from '@/hooks/useTheme';

export function ToggleThemeButton() {
  const { t } = useTranslation();
  const { theme, toggleTheme } = useTheme();

  return (
    <label className="swap swap-rotate btn btn-ghost btn-circle" title={t('topBar.darkModeSwitcherTitle')}>
      <input
        type="checkbox"
        onClick={() => toggleTheme()}
        checked={theme === 'dark'}
        title="Dark Mode Switcher"
        readOnly
      />
      <FaSun className="w-5 h-5 fill-current swap-on" size={20} />
      <FaMoon className="w-5 h-5 fill-current swap-off" size={20} />
    </label>
  );
}
