import '@/i18n';
import '@/index.css';

import { lazy } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import GlobalToaster from '@/components/GlobalToaster';
import ReactQueryProvider from '@/components/ReactQueryProvider';
import { useDarkMode } from '@/hooks/theme';
import TabLayout from '@/layouts/TabLayout';
import NotFound from '@/pages/NotFound';

import { GlobalProvider } from './components/GlobalStore';

const TranslatorPage = lazy(() => import('@/pages/Translator/index'));
const ConfigPage = lazy(() => import('@/pages/Config'));

function Router() {
  useDarkMode();

  return (
    <ReactQueryProvider>
      <GlobalProvider>
        <GlobalToaster />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<TabLayout />}>
              <Route index element={<TranslatorPage />} />
              <Route path="config" element={<ConfigPage />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </GlobalProvider>
    </ReactQueryProvider>
  );
}

export default Router;
