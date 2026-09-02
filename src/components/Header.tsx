import { useTranslation } from 'react-i18next';
import { BsGithub, BsTwitter } from 'react-icons/bs';
import { MdClose, MdTranslate } from 'react-icons/md';

import { ConfigButton } from '@/components/ConfigButton';
import { SwitchLanguageButton } from '@/components/SwitchLanguageButton';
import { ToggleThemeButton } from '@/components/ToggleThemeButton';

function AboutModal() {
  const { t } = useTranslation();

  return (
    <>
      <input type="checkbox" id="about-modal" className="modal-toggle" />
      <label htmlFor="about-modal" className="cursor-pointer modal backdrop-blur-xs">
        <label className="relative modal-box rounded-3xl border border-base-200 shadow-xl p-6 max-w-md" htmlFor="">
          <div className="flex items-center justify-between pb-4 border-b border-base-200">
            <div className="flex items-center gap-2.5">
              <div className="size-9 rounded-xl bg-primary text-primary-content flex items-center justify-center shadow-xs">
                <MdTranslate size={22} />
              </div>
              <h3 className="text-lg font-bold text-base-content">{t('topBar.title')}</h3>
            </div>
            <label htmlFor="about-modal" className="btn btn-sm btn-circle btn-ghost">
              <MdClose size={18} />
            </label>
          </div>

          <div className="py-4 space-y-3 text-sm text-base-content/80">
            <div className="flex items-center justify-between py-1">
              <span className="font-medium text-base-content/60">Author</span>
              <span className="font-semibold text-base-content">Lance.Moe</span>
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="font-medium text-base-content/60">Build Time</span>
              <span className="font-mono text-xs opacity-75">{BUILD_TIME}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <a
              href="https://github.com/LanceMoe/openai-translator"
              target="_blank"
              rel="noreferrer noopener"
              className="btn btn-outline btn-sm rounded-xl font-medium gap-2 hover:bg-base-200 hover:text-base-content"
            >
              <BsGithub size={18} />
              GitHub
            </a>

            <a
              href="https://twitter.com/lance_moe"
              target="_blank"
              rel="noreferrer noopener"
              className="btn btn-outline btn-primary btn-sm rounded-xl font-medium gap-2"
            >
              <BsTwitter size={18} />
              Twitter
            </a>
          </div>
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
      <header className="navbar sticky top-0 z-40 bg-base-100/80 backdrop-blur-md border-b border-base-200/80 px-3 sm:px-6 transition-all">
        <div className="flex-1">
          <label
            className="flex items-center gap-2.5 cursor-pointer px-2 py-1.5 rounded-xl hover:bg-base-200/60 transition-all select-none"
            htmlFor="about-modal"
          >
            <div className="size-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
              <MdTranslate size={19} />
            </div>
            <span className="text-base sm:text-lg font-bold tracking-tight text-base-content">{t('topBar.title')}</span>
          </label>
        </div>
        <div className="flex items-center gap-1 sm:gap-2 flex-none">
          <ConfigButton />
          <ToggleThemeButton />
          <SwitchLanguageButton />
        </div>
      </header>
    </>
  );
}

export default Header;
