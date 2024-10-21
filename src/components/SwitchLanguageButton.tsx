import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';
import { Badge, Button } from 'react-daisyui';
import { useTranslation } from 'react-i18next';
import { FaSortDown } from 'react-icons/fa';
import { IoLanguage } from 'react-icons/io5';
import { useLocalStorage, useOnClickOutside } from 'usehooks-ts';

const LANGUAGES = [
  {
    code: 'en',
    name: 'English',
    icon: (
      <Badge size="sm" variant="outline">
        EN
      </Badge>
    ),
  },
  {
    code: 'zh',
    name: '简体中文',
    icon: (
      <Badge size="sm" variant="outline">
        ZH
      </Badge>
    ),
  },
  {
    code: 'zh-TW',
    name: '正體中文',
    icon: (
      <Badge size="sm" variant="outline">
        ZH
      </Badge>
    ),
  },
  {
    code: 'ja',
    name: '日本語',
    icon: (
      <Badge size="sm" variant="outline">
        JA
      </Badge>
    ),
  },
] as const;

type LanguageCode = (typeof LANGUAGES)[number]['code'];

export function SwitchLanguageButton() {
  const { t, i18n } = useTranslation();
  const ref = useRef(null);
  const [lang, setLang] = useLocalStorage<LanguageCode>('langCode', 'zh');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useOnClickOutside(ref, () => setIsMenuOpen(false));

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
    <div title="Change Language" className={clsx('dropdown', 'dropdown-end', isMenuOpen && 'dropdown-open')} ref={ref}>
      <Button
        type="button"
        title={t('Change Language')}
        tabIndex={0}
        color="ghost"
        className="gap-1 normal-case"
        onClick={() => setIsMenuOpen((prev) => !prev)}
      >
        <IoLanguage size={20} />
        <FaSortDown size={12} />
      </Button>
      <div className="w-56 mt-16 overflow-y-auto shadow-2xl dropdown-content bg-base-200 text-base-content rounded-t-box rounded-b-box top-px">
        <ul className="gap-1 p-3 menu menu-compact" tabIndex={0}>
          {LANGUAGES.map((language) => (
            <li key={language.code}>
              <a
                className={clsx('flex', i18n.language === language.code && 'active')}
                onClick={() => {
                  setLang(language.code);
                  setIsMenuOpen(false);
                }}
              >
                {language.icon}
                <span className="flex justify-between flex-1">{language.name}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
