import { useTranslation } from 'react-i18next';

import SwitchLanguageButton from '@/components/SwitchLanguageButton';
import ToggleThemeButton from '@/components/ToggleThemeButton';

function AboutModal() {
  return (
    <>
      <input type="checkbox" id="about-modal" className="modal-toggle" />
      <label htmlFor="about-modal" className="cursor-pointer modal">
        <label className="relative modal-box" htmlFor="">
          <h3 className="text-lg font-bold">About OpenAI Translator</h3>
          <p className="py-4">Author: Lance.Moe</p>
        </label>
      </label>
    </>
  );
}

function Header() {
  const { t } = useTranslation();
  return (
    <>
      <AboutModal />
      <div className="sticky top-0 z-50 navbar bg-primary text-primary-content">
        <div className="flex-1">
          <label className="text-xl normal-case btn btn-ghost" htmlFor="about-modal">
            {t('topbar.title')}
          </label>
        </div>
        <div className="flex-none">
          <ToggleThemeButton />
          <SwitchLanguageButton />
        </div>
      </div>
    </>
  );
}

export default Header;
