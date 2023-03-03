import { useTranslation } from 'react-i18next';
import { IoMoon, IoSunny } from 'react-icons/io5';

import { useDarkMode } from '@/hooks/theme';

function ToggleThemeButton() {
  const { t } = useTranslation();
  const [darkMode, setDarkMode] = useDarkMode();
  return (
    <label className="swap swap-rotate btn btn-ghost btn-circle " title={t('topbar.darkModeSwitcherTitle')}>
      <input
        type="checkbox"
        onClick={() => setDarkMode(!darkMode)}
        checked={!darkMode}
        title="Dark Mode Switcher"
        readOnly
      />
      <IoSunny className="w-5 h-5 fill-current swap-on" size={20} />
      <IoMoon className="w-5 h-5 fill-current swap-off" size={20} />
    </label>
  );
}

export default ToggleThemeButton;
