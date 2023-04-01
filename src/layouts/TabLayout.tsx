import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import Header from '@/components/Header';
import { Loading } from '@/components/Loading';
import NavBar from '@/components/NavBar';
import ConfigDrawerLayout from '@/layouts/ConfigDrawerLayout';

function TabLayout() {
  return (
    <ConfigDrawerLayout>
      <Header />
      <Suspense fallback={<Loading />}>
        <Outlet />
      </Suspense>
      <NavBar />
    </ConfigDrawerLayout>
  );
}

export default TabLayout;
