import { useTranslation } from 'react-i18next';
import { BsLightbulbFill, BsMoonStarsFill } from 'react-icons/bs';

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
      <BsLightbulbFill className="swap-on" size={20} />
      <BsMoonStarsFill className="swap-off" size={20} />
    </label>
  );
}
