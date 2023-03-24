import clsx from 'clsx';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, matchPath, useLocation } from 'react-router-dom';

import NAV_ITEMS from '@/constants/NavItems';

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
    <section
      id="bottom-navigation"
      className="fixed inset-x-0 bottom-0 z-50 items-center block h-[calc(48px+env(safe-area-inset-bottom))] rounded-tabs glass"
    >
      <ul id="tabs" className="flex justify-around max-w-screen-md p-0 m-0 mx-auto">
        {NAV_ITEMS.map(({ key, label, to, icon }) => (
          <li
            key={key}
            className={clsx('flex-col w-24 duration-300', selectedKey === key ? 'text-primary' : 'text-base-content')}
          >
            <Link to={to} title={t(`navbar.${label}`)} draggable="false" className="flex flex-col items-center">
              <div
                className={clsx(
                  'w-10 h-1 mb-2 duration-300 rounded-full',
                  selectedKey === key ? 'bg-primary' : 'bg-transparent',
                )}
              ></div>
              {icon}
              {/* <span className='block text-xs font-semibold'>{t(`navbar.${label}`)}</span> */}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default NavBar;
