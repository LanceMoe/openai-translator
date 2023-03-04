import { useTranslation } from 'react-i18next';
import { FaMoon, FaSun } from 'react-icons/fa';

import { useDarkMode } from '@/hooks/theme';

export function ToggleThemeButton() {
  const { t } = useTranslation();
  const [darkMode, setDarkMode] = useDarkMode();
  return (
    <label className="swap swap-rotate btn btn-ghost btn-circle" title={t('topbar.darkModeSwitcherTitle')}>
      <input
        type="checkbox"
        onClick={() => setDarkMode(!darkMode)}
        checked={!darkMode}
        title="Dark Mode Switcher"
        readOnly
      />
      <FaSun className="w-5 h-5 fill-current swap-on" size={20} />
      <FaMoon className="w-5 h-5 fill-current swap-off" size={20} />
    </label>
  );
}
