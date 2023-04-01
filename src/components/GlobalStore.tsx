import { createContext, Dispatch, SetStateAction, useContext, useEffect, useMemo, useState } from 'react';
import { useLocalStorage } from 'usehooks-ts';

import { setApiBaseUrl } from '@/client';
import { fetchTranslation } from '@/client/fetcher';
import { useQueryApi } from '@/hooks/useQueryApi';
import { ConfigValues, HistoryRecord, LastTranslateData } from '@/types';

type GlobalContextValue = {
  configValues: ConfigValues;
  setConfigValues: Dispatch<SetStateAction<ConfigValues>>;
  translator: {
    lastTranslateData: LastTranslateData;
    setLastTranslateData: Dispatch<SetStateAction<LastTranslateData>>;
    translateText: string;
    setTranslateText: Dispatch<SetStateAction<string>>;
    translatedText: string | undefined;
    mutateTanslateText: (data: Parameters<typeof fetchTranslation>[0]) => void;
    isTranslating: boolean;
    isTranslateError: boolean;
  };
  history: {
    historyRecords: HistoryRecord[];
    setHistoryRecords: Dispatch<SetStateAction<HistoryRecord[]>>;
  };
};

const GlobalContext = createContext<GlobalContextValue>({
  configValues: {
    openaiApiUrl: 'https://api.openai.com',
    openaiApiKey: '',
    streamEnabled: true,
    currentModel: 'gpt-3.5-turbo',
    tempretureParam: 0.7,
  },
  setConfigValues: () => {},
  translator: {
    lastTranslateData: {
      fromLang: 'auto',
      toLang: 'auto',
    },
    setLastTranslateData: () => {},
    translateText: '',
    setTranslateText: () => {},
    translatedText: undefined,
    mutateTanslateText: () => {},
    isTranslating: false,
    isTranslateError: false,
  },
  history: {
    historyRecords: [],
    setHistoryRecords: () => {},
  },
});

type Props = {
  children: React.ReactNode;
};

export function GlobalProvider(props: Props) {
  const { children } = props;
  const [translateText, setTranslateText] = useState('');
  const [historyRecords, setHistoryRecords] = useLocalStorage<HistoryRecord[]>('history-record', []);
  const [lastTranslateData, setLastTranslateData] = useLocalStorage<LastTranslateData>('last-translate-data', {
    fromLang: 'auto',
    toLang: 'auto',
  });
  const [configValues, setConfigValues] = useLocalStorage<ConfigValues>('extra-config', {
    openaiApiUrl: 'https://api.openai.com',
    openaiApiKey: '',
    streamEnabled: true,
    currentModel: 'gpt-3.5-turbo',
    tempretureParam: 0.7,
  });
  const {
    openaiApiUrl = 'https://api.openai.com',
    openaiApiKey = '',
    streamEnabled = true,
    currentModel = 'gpt-3.5-turbo',
    tempretureParam = 0.7,
  } = configValues;

  const {
    data: translatedText,
    mutate: mutateTanslateText,
    isLoading: isTranslating,
    isError: isTranslateError,
  } = useQueryApi(streamEnabled);

  useEffect(() => setApiBaseUrl(configValues.openaiApiUrl), [configValues.openaiApiUrl]);

  useEffect(() => {
    if (!translatedText || isTranslating) {
      return;
    }
    setHistoryRecords((prev) => [
      {
        id: self.crypto.randomUUID(),
        fromLanguage: lastTranslateData.fromLang,
        toLanguage: lastTranslateData.toLang,
        text: translateText,
        translation: translatedText,
        createdAt: Date.now(),
      },
      ...prev,
    ]);
  }, [translatedText, isTranslating]);

  const contextValue = useMemo(
    () => ({
      configValues: { openaiApiUrl, openaiApiKey, streamEnabled, currentModel, tempretureParam },
      setConfigValues,
      translator: {
        lastTranslateData,
        setLastTranslateData,
        translateText,
        setTranslateText,
        translatedText,
        mutateTanslateText,
        isTranslating,
        isTranslateError,
      },
      history: {
        historyRecords,
        setHistoryRecords,
      },
    }),
    [
      translateText,
      setTranslateText,
      translatedText,
      mutateTanslateText,
      isTranslating,
      isTranslateError,
      historyRecords,
      setHistoryRecords,
      openaiApiUrl,
      openaiApiKey,
      streamEnabled,
      currentModel,
      tempretureParam,
      setConfigValues,
    ],
  );

  return <GlobalContext.Provider value={contextValue}>{children}</GlobalContext.Provider>;
}

export function useGlobalStore() {
  return useContext(GlobalContext);
}
