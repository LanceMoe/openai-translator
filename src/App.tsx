import '@/i18n';
import '@/index.css';

import { lazy } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { GlobalToaster } from '@/components/GlobalToaster';
import { ReactQueryProvider } from '@/components/ReactQueryProvider';
import { useDarkMode } from '@/hooks/theme';
import TabLayout from '@/layouts/TabLayout';
import NotFound from '@/pages/NotFound';

import { GlobalProvider } from './components/GlobalStore';

const TranslatorPage = lazy(() => import('@/pages/Translator'));
const HistoryRecordPage = lazy(() => import('@/pages/HistoryRecord'));

function App() {
  useDarkMode();

  return (
    <ReactQueryProvider>
      <GlobalProvider>
        <GlobalToaster />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<TabLayout />}>
              <Route index element={<TranslatorPage />} />
              <Route path="history" element={<HistoryRecordPage />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </GlobalProvider>
    </ReactQueryProvider>
  );
}

export default App;
