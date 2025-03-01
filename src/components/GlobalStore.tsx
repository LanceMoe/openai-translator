import { useLocalStorage } from '@mantine/hooks';
import { createContext, type Dispatch, type SetStateAction, useContext, useEffect, useMemo, useState } from 'react';

import { setApiBaseUrl } from '@/client';
import type { ChatModel, ConfigValues as ConfigValuesBase } from '@/constants';
import { useQueryApi } from '@/hooks/useQueryApi';

type ConfigValues = Omit<ConfigValuesBase, 'currentModel'> & {
  currentModel: ChatModel;
};

type GlobalContextValue = {
  configValues: ConfigValues;
  setConfigValues: Dispatch<SetStateAction<ConfigValues>>;
  availableModels: { id: string; name: string }[];
  setAvailableModels: Dispatch<SetStateAction<{ id: string; name: string }[]>>;
  translator: {
    lastTranslateData: LastTranslateData;
    setLastTranslateData: Dispatch<SetStateAction<LastTranslateData>>;
    translateText: string;
    setTranslateText: Dispatch<SetStateAction<string>>;
    translatedText: string | undefined;
    mutateTranslateText: (data: {
      token: string;
      engine: ChatModel;
      prompt: string;
      temperatureParam: number;
      queryText: string;
    }) => void;
    isTranslating: boolean;
    isTranslateError: boolean;
  };
  history: {
    historyRecords: HistoryRecord[];
    setHistoryRecords: Dispatch<SetStateAction<HistoryRecord[]>>;
  };
};

const context = createContext<GlobalContextValue>({
  configValues: {
    openaiApiUrl: 'https://api.openai.com',
    openaiApiKey: '',
    streamEnabled: true,
    currentModel: 'gpt-4o-mini',
    temperatureParam: 0.7,
  },
  setConfigValues: () => undefined,
  availableModels: [],
  setAvailableModels: () => undefined,
  translator: {
    lastTranslateData: {
      fromLang: 'auto',
      toLang: 'auto',
    },
    setLastTranslateData: () => undefined,
    translateText: '',
    setTranslateText: () => undefined,
    translatedText: undefined,
    mutateTranslateText: () => undefined,
    isTranslating: false,
    isTranslateError: false,
  },
  history: {
    historyRecords: [],
    setHistoryRecords: () => undefined,
  },
});

type Props = {
  children: React.ReactNode;
};

export function GlobalProvider(props: Props) {
  const { children } = props;
  const [translateText, setTranslateText] = useState('');
  const [historyRecords, setHistoryRecords] = useLocalStorage<HistoryRecord[]>({
    key: 'history-record',
    defaultValue: [],
    getInitialValueInEffect: false,
  });
  const [lastTranslateData, setLastTranslateData] = useLocalStorage<LastTranslateData>({
    key: 'last-translate-data',
    defaultValue: {
      fromLang: 'auto',
      toLang: 'auto',
    },
    getInitialValueInEffect: false,
  });
  const [configValues, setConfigValues] = useLocalStorage<ConfigValues>({
    key: 'extra-config',
    defaultValue: {
      openaiApiUrl: 'https://api.openai.com',
      openaiApiKey: '',
      streamEnabled: true,
      currentModel: 'gpt-4o-mini',
      temperatureParam: 0.7,
    },
    getInitialValueInEffect: false,
  });
  const {
    openaiApiUrl = 'https://api.openai.com',
    openaiApiKey = '',
    streamEnabled = true,
    currentModel = 'gpt-4o-mini',
    temperatureParam = 0.7,
  } = configValues;

  const { data: translatedText, mutate: mutateTranslateText, isLoading, isError } = useQueryApi(streamEnabled);
  const [availableModels, setAvailableModels] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => setApiBaseUrl(configValues.openaiApiUrl), [configValues.openaiApiUrl]);

  useEffect(() => {
    if (!translatedText || isLoading) {
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
  }, [
    translatedText,
    isLoading,
    setHistoryRecords,
    lastTranslateData.fromLang,
    lastTranslateData.toLang,
    translateText,
  ]);

  const contextValue = useMemo(
    () => ({
      configValues: { openaiApiUrl, openaiApiKey, streamEnabled, currentModel, temperatureParam },
      setConfigValues,
      availableModels,
      setAvailableModels,
      translator: {
        lastTranslateData,
        setLastTranslateData,
        translateText,
        setTranslateText,
        translatedText,
        mutateTranslateText,
        isTranslating: isLoading,
        isTranslateError: isError,
      },
      history: {
        historyRecords,
        setHistoryRecords,
      },
    }),
    [
      openaiApiUrl,
      openaiApiKey,
      streamEnabled,
      currentModel,
      temperatureParam,
      setConfigValues,
      availableModels,
      lastTranslateData,
      setLastTranslateData,
      translateText,
      translatedText,
      mutateTranslateText,
      isLoading,
      isError,
      historyRecords,
      setHistoryRecords,
    ],
  );

  return <context.Provider value={contextValue}>{children}</context.Provider>;
}

export function useGlobalStore() {
  const value = useContext(context);
  if (!value) {
    throw new Error('useGlobalStore must be used within a GlobalProvider');
  }
  return value;
}
