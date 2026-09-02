import { useClickOutside, useLocalStorage } from '@mantine/hooks';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaSortDown } from 'react-icons/fa';
import { MdCheck, MdLanguage } from 'react-icons/md';

const LANGUAGES = [
  {
    code: 'en',
    name: 'English',
    badge: 'EN',
  },
  {
    code: 'zh',
    name: '简体中文',
    badge: '简',
  },
  {
    code: 'zh-TW',
    name: '正體中文',
    badge: '繁',
  },
  {
    code: 'ja',
    name: '日本語',
    badge: '日',
  },
] as const;

type LanguageCode = (typeof LANGUAGES)[number]['code'];

export function SwitchLanguageButton() {
  const { t, i18n } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const ref = useClickOutside<HTMLDivElement>(() => setIsMenuOpen(false));
  const [lang, setLang] = useLocalStorage<LanguageCode>({
    key: 'langCode',
    defaultValue: 'zh',
    getInitialValueInEffect: false,
  });

  useEffect(() => {
    document.documentElement.setAttribute('lang', lang);
    i18n.changeLanguage(lang);
  }, [i18n, lang]);

  useEffect(() => {
    if (!isMenuOpen && document.activeElement) {
      const elem = document.activeElement as HTMLElement;
      elem.blur();
    }
  }, [isMenuOpen]);

  return (
    <div className={clsx('dropdown dropdown-end', isMenuOpen && 'dropdown-open')} ref={ref}>
      <button
        type="button"
        title={t('Change Language')}
        aria-label={t('Change Language')}
        className="btn btn-ghost btn-sm sm:btn-md rounded-xl gap-1.5 px-2.5 font-medium text-base-content/80 hover:text-base-content"
        onClick={() => setIsMenuOpen((prev) => !prev)}
      >
        <MdLanguage size={19} />
        <FaSortDown size={10} className="mb-0.5 text-base-content/50" />
      </button>

      <ul
        tabIndex={0}
        className="dropdown-content menu z-50 mt-2 w-48 rounded-2xl border border-base-200 bg-base-100 p-1.5 shadow-xl backdrop-blur-md"
      >
        {LANGUAGES.map((language) => {
          const isActive = i18n.language === language.code;
          return (
            <li key={language.code} className="w-full">
              <button
                type="button"
                className={clsx(
                  'flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs sm:text-sm font-medium transition-all',
                  isActive
                    ? 'active bg-primary text-primary-content font-semibold'
                    : 'text-base-content/80 hover:bg-base-200 hover:text-base-content',
                )}
                onClick={() => {
                  setLang(language.code);
                  setIsMenuOpen(false);
                }}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={clsx(
                      'badge badge-xs px-1.5 py-2 font-mono font-bold rounded-md',
                      isActive ? 'badge-neutral bg-primary-content/20 text-primary-content border-none' : 'badge-ghost',
                    )}
                  >
                    {language.badge}
                  </span>
                  <span>{language.name}</span>
                </div>
                {isActive && <MdCheck size={16} className="shrink-0" />}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
