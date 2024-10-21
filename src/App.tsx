import '@/i18n';
import '@/index.css';

import { lazy } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { GlobalProvider } from '@/components/GlobalStore';
import { ReactQueryProvider } from '@/components/ReactQueryProvider';
import { useAutoChangeTheme } from '@/hooks/useTheme';
import TabLayout from '@/layouts/TabLayout';
import NotFound from '@/pages/NotFound';

const GlobalToaster = lazy(() => import('@/components/GlobalToaster'));

const TranslatorPage = lazy(() => import('@/pages/Translator'));
const HistoryRecordPage = lazy(() => import('@/pages/HistoryRecord'));

function App() {
  useAutoChangeTheme();

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
