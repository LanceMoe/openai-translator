import { lazy, Suspense } from 'react';

import { Loading } from '@/components/Loading';

const HistoryRecordPage = lazy(() => import('@/pages/HistoryRecord'));

type Props = {
  children: React.ReactNode;
};

function HistoryRecordDrawerLayout(props: Props) {
  const { children } = props;

  return (
    <>
      <input id="history-record-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">{children}</div>
      <div className="drawer-side">
        <label htmlFor="history-record-drawer" className="drawer-overlay"></label>
        <Suspense fallback={<Loading />}>
          <HistoryRecordPage />
        </Suspense>
      </div>
    </>
  );
}

export default HistoryRecordDrawerLayout;
