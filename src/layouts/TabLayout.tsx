import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import Header from '@/components/Header';
import { HistoryRecordDrawerLayout } from '@/components/HistoryRecordDrawer';
import { Loading } from '@/components/Loading';
import NavBar from '@/components/NavBar';

function TabLayout() {
  return (
    <HistoryRecordDrawerLayout>
      <Header />
      <Suspense fallback={<Loading />}>
        <Outlet />
      </Suspense>
      <NavBar />
    </HistoryRecordDrawerLayout>
  );
}

export default TabLayout;
