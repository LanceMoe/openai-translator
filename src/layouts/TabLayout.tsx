import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import Header from '@/components/Header';
import { Loading } from '@/components/Loading';
import NavBar from '@/components/NavBar';

function App() {
  return (
    <>
      <Header />
      <Suspense fallback={<Loading />}>
        <Outlet />
      </Suspense>
      <NavBar />
    </>
  );
}

export default App;
