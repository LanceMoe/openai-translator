import { Navbar } from 'react-daisyui';
import { useTranslation } from 'react-i18next';
import { BsGithub, BsTwitter } from 'react-icons/bs';

import { ConfigButton } from '@/components/ConfigButton';
import { SwitchLanguageButton } from '@/components/SwitchLanguageButton';
import { ToggleThemeButton } from '@/components/ToggleThemeButton';

function AboutModal() {
  return (
    <>
      <input type="checkbox" id="about-modal" className="modal-toggle" />
      <label htmlFor="about-modal" className="cursor-pointer modal">
        <label className="relative modal-box" htmlFor="">
          <h3 className="text-lg font-bold">About OpenAI Translator</h3>
          <p className="py-4">Author: Lance.Moe</p>
          <p className="grid grid-cols-2 gap-2 py-4">
            <a
              href="https://github.com/LanceMoe/openai-translator"
              target="_blank"
              rel="noreferrer noopener"
              className="btn btn-outline"
            >
              <BsGithub size={20} className="mr-2" />
              GitHub
            </a>

            <a
              href="https://twitter.com/lance_moe"
              target="_blank"
              rel="noreferrer noopener"
              className="btn btn-outline btn-primary"
            >
              <BsTwitter size={20} className="mr-2" />
              Twitter
            </a>
          </p>
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
      <Navbar className="sticky top-0 z-50 bg-primary text-primary-content">
        <div className="flex-1">
          <label className="text-xl normal-case btn btn-ghost" htmlFor="about-modal">
            {t('topbar.title')}
          </label>
        </div>
        <div className="flex-none">
          <ConfigButton />
          <ToggleThemeButton />
          <SwitchLanguageButton />
        </div>
      </Navbar>
    </>
  );
}

export default Header;
