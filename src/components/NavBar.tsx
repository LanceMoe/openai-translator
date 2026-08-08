import clsx from 'clsx';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { BsTranslate } from 'react-icons/bs';
import { FaHistory } from 'react-icons/fa';
import { Link, matchPath, useLocation } from 'react-router-dom';

const NAV_ITEMS = [
  { key: 'translator', label: 'Translator', to: '/', icon: <BsTranslate className="size-6 p-0" size={24} /> },
  { key: 'history', label: 'History records', to: '/history', icon: <FaHistory className="size-6 p-0" size={24} /> },
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
    <section id="bottom-navigation" className="dock p-0 h-12">
      {NAV_ITEMS.map(({ key, label, to, icon }) => (
        <Link
          key={key}
          to={to}
          title={t(`navbar.${label}`)}
          aria-label={t(`navbar.${label}`)}
          draggable="false"
          className={clsx(
            'flex flex-col items-center justify-start w-24 duration-300 mb-0',
            selectedKey === key ? 'text-primary' : 'text-base-content',
          )}
        >
          <div
            className={clsx(
              'w-10 h-1 mb-2 duration-300 rounded-full',
              selectedKey === key ? 'bg-primary' : 'bg-transparent',
            )}
          ></div>
          {icon}
        </Link>
      ))}
    </section>
  );
}

export default NavBar;
