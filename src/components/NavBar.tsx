import clsx from 'clsx';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { BsTranslate } from 'react-icons/bs';
import { FaHistory } from 'react-icons/fa';
import { Link, matchPath, useLocation } from 'react-router-dom';

const NAV_ITEMS = [
  { key: 'translator', label: 'Translator', to: '/', icon: <BsTranslate size={18} /> },
  { key: 'history', label: 'History records', to: '/history', icon: <FaHistory size={18} /> },
] as const;

function NavBar() {
  const location = useLocation();
  const { t } = useTranslation();

  const selectedKey = useMemo(
    () =>
      matchPath({ path: '/', end: true }, location.pathname)
        ? NAV_ITEMS[0].key
        : NAV_ITEMS.find(({ to }) => matchPath({ path: to, end: true }, location.pathname))?.key,
    [location],
  );

  return (
    <nav
      id="bottom-navigation"
      className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-center p-2 bg-base-100/80 backdrop-blur-md border-t border-base-200/80 pb-[calc(0.5rem+env(safe-area-inset-bottom))]"
    >
      <div className="flex items-center gap-1 sm:gap-2 bg-base-200/60 p-1 rounded-2xl border border-base-200 shadow-xs">
        {NAV_ITEMS.map(({ key, label, to, icon }) => {
          const isActive = selectedKey === key;
          return (
            <Link
              key={key}
              to={to}
              title={t(`navbar.${label}`)}
              aria-label={t(`navbar.${label}`)}
              draggable="false"
              className={clsx(
                'flex items-center gap-2 px-4 sm:px-6 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 select-none',
                isActive
                  ? 'bg-primary text-primary-content shadow-xs scale-100'
                  : 'text-base-content/70 hover:text-base-content hover:bg-base-100/60',
              )}
            >
              {icon}
              <span>{t(`navbar.${label}`)}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export default NavBar;
